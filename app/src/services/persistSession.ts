/**
 * The write pipeline for a captured session, S23 → S30.
 *
 * Pure functions over `Repos` so the whole sequence is testable against the
 * in-memory implementation. Two rules shape it:
 *
 * 1. Footage is the durable artefact; deliveries are derived from it. So the
 *    session and its clip are written when recording stops, and the deliveries
 *    during processing — which is what makes processing resumable.
 * 2. Confidence is computed exactly once, here, and never re-derived at read
 *    time.
 */
import { InferenceEngine } from '@/capabilities/types';
import { DeliveryObservation } from '@/capabilities/types';
import { Repos } from '@/data/repos/types';
import { SceneScale, Tap, sceneScale, toCalibration } from '@/domain/calibration';
import { Clock, isoDate, systemClock } from '@/domain/clock';
import { finalConfidence } from '@/domain/confidence';
import { DETERMINANTS } from '@/domain/content/determinants';
import { newId } from '@/domain/ids';
import { selectInsight } from '@/domain/insight';
import { Insight, MetricRow, Session, SessionType } from '@/domain/types';
import { WEIGHTING } from '@/domain/workload';

import { track } from './analytics';

/** Where the crash-resume payload for a session lives in `settings`. */
export const pendingKey = (sessionId: string) => `pending:${sessionId}`;

export interface StartSessionInput {
  repos: Repos;
  bowlerId: string;
  sessionType: SessionType;
  /** Two taps from S22, or none when the venue was already calibrated. */
  taps?: Tap[];
  overrodeChecks: boolean;
  captureFps: number | null;
  deviceModel?: string | null;
  /** True when the readings will come from the simulated engine. */
  simulated: boolean;
  clock?: Clock;
}

export interface StartedSession {
  session: Session;
  scale: SceneScale | null;
}

/**
 * Insert the session at "Arm and walk away". From here on the bowler is not
 * touching the phone, so anything not recorded now is lost if the app dies.
 */
export function startSession(input: StartSessionInput): StartedSession {
  const { repos, clock = systemClock } = input;
  const now = clock.now();

  let calibrationId: string | null = null;
  let venueId: string | null = null;
  let scale: SceneScale | null = null;

  const [crease, stumps] = input.taps ?? [];
  if (crease && stumps) {
    scale = sceneScale(crease, stumps);
    // A degenerate pair yields no scale, and an unscaled session cannot produce
    // a speed — S22 blocks Continue on this, so it should not arrive here.
    if (scale) {
      const calibration = toCalibration(newId('cal', now), crease, stumps, now);
      repos.calibrations.save(calibration);
      calibrationId = calibration.id;
      venueId = calibration.venueFingerprint;
    }
  }

  const session: Session = {
    id: newId('ses', now),
    bowlerId: input.bowlerId,
    type: input.sessionType,
    venueId,
    startedAt: now,
    endedAt: null,
    deviceModel: input.deviceModel ?? null,
    captureFps: input.captureFps,
    thermalEvents: [],
    calibrationId,
    weighting: WEIGHTING[input.sessionType],
    status: 'armed',
    processedCount: 0,
    lowConfOverride: input.overrodeChecks,
    clipPath: null,
    simulated: input.simulated,
  };

  repos.sessions.insert(session);
  return { session, scale };
}

export function markRecording(repos: Repos, sessionId: string): void {
  repos.sessions.update(sessionId, { status: 'recording' });
}

export interface EndSessionInput {
  repos: Repos;
  sessionId: string;
  bowlerId: string;
  clipPath: string | null;
  observations: DeliveryObservation[];
  thermalEvents: string[];
  captureFps: number | null;
  clock?: Clock;
}

/**
 * Close the session when recording stops.
 *
 * The workload entry is written here, not on successful analysis. A spell that
 * was bowled but never processed still spent the bowler's weekly budget, and a
 * ledger that only counts analysed sessions would silently lose the load of any
 * session the bowler closed from the summary screen. Idempotent on sessionId so
 * a resume cannot double-count.
 */
export function endSession(input: EndSessionInput): void {
  const { repos, sessionId, clock = systemClock } = input;
  const now = clock.now();

  const session = repos.sessions.get(sessionId);

  repos.sessions.update(sessionId, {
    status: 'ended',
    endedAt: now,
    clipPath: input.clipPath,
    thermalEvents: input.thermalEvents,
    captureFps: input.captureFps,
  });

  // The resume payload. With a real pose pass this is unnecessary — the clip is
  // the input — but the simulated engine has nothing else to replay.
  repos.settings.set(pendingKey(sessionId), JSON.stringify(input.observations));

  if (input.observations.length === 0) return;

  const alreadyCounted = repos.workload.all().some((e) => e.sessionId === sessionId);
  if (alreadyCounted) return;

  repos.workload.insert({
    id: newId('wl', now),
    bowlerId: input.bowlerId,
    // Dated to when the spell was bowled, not when it was analysed.
    date: isoDate(session?.startedAt ?? now),
    deliveries: input.observations.length,
    source: 'captured',
    weighting: session?.weighting ?? WEIGHTING[session?.type ?? 'net'],
    sessionId,
  });
}

/** Read back the observations stashed at `end`, for a resumed session. */
export function loadPendingObservations(repos: Repos, sessionId: string): DeliveryObservation[] {
  const raw = repos.settings.get(pendingKey(sessionId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DeliveryObservation[]) : [];
  } catch {
    return [];
  }
}

export interface ProcessSessionInput {
  repos: Repos;
  sessionId: string;
  inference: InferenceEngine;
  observations?: DeliveryObservation[];
  onProgress?: (done: number, total: number) => void;
  clock?: Clock;
}

export interface ProcessSessionResult {
  deliveriesAnalysed: number;
  insight: Insight | null;
}

/** S26: turn the capture into deliveries, metrics and the one insight. */
export async function processSession(
  input: ProcessSessionInput,
): Promise<ProcessSessionResult> {
  const { repos, sessionId, inference, clock = systemClock } = input;

  const session = repos.sessions.get(sessionId);
  if (!session) throw new Error(`Cannot process unknown session ${sessionId}`);

  const observations = input.observations ?? loadPendingObservations(repos, sessionId);

  repos.sessions.update(sessionId, { status: 'processing' });

  const analysed = await inference.analyse(
    {
      sessionId,
      clipPath: session.clipPath,
      observations,
      fromIndex: session.processedCount,
    },
    (done, total) => input.onProgress?.(done, total),
  );

  for (const observation of analysed) {
    const now = clock.now();
    const deliveryId = newId('del', now);

    // Written once, immutable thereafter. A session whose placement checks were
    // overridden marks every delivery low-confidence, as does an implausible
    // speed — those stay visible in lists but sit outside trends and never feed
    // an insight.
    const confidence = finalConfidence(
      observation.engineConfidence,
      observation.speedKmh,
      session.lowConfOverride,
    );

    if (confidence === 'low') {
      // Diagnostic: the rate of this is how the beta judges whether the speed
      // metric is credible at all.
      track('low_confidence_flagged', {
        sessionId,
        overridden: session.lowConfOverride,
        speedKmh: observation.speedKmh,
      });
    }

    repos.deliveries.insert({
      id: deliveryId,
      sessionId,
      index: observation.index,
      speedKmh: observation.speedKmh,
      speedBandKmh: observation.speedBandKmh,
      confidence,
      clipPath: observation.clipPath ?? session.clipPath,
      frameCount: observation.frameCount,
      events: observation.events,
      createdAt: now,
    });

    if (observation.metrics.length > 0) {
      const rows: MetricRow[] = observation.metrics.map((m) => {
        const determinant = DETERMINANTS[m.key];
        return {
          deliveryId,
          key: m.key,
          value: m.value,
          bandValue: m.bandValue,
          referenceLo: determinant?.range.good[0] ?? null,
          referenceHi: determinant?.range.good[1] ?? null,
        };
      });
      repos.metrics.insertMany(rows);
    }

    // The resume checkpoint: a crash here restarts from the next delivery.
    repos.sessions.update(sessionId, { processedCount: observation.index });
  }

  // sessionMeans already filters to ok-confidence deliveries, so excluding
  // low-confidence balls from the insight is structural, not a convention.
  const means = repos.metrics.sessionMeans(sessionId);
  const insight = selectInsight(sessionId, means);
  if (insight) repos.insights.save(insight);

  repos.sessions.update(sessionId, { status: 'complete' });
  repos.settings.set(pendingKey(sessionId), '');

  return {
    deliveriesAnalysed: repos.deliveries.count(sessionId),
    insight,
  };
}
