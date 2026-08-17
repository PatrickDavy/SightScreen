import { createSimulatedEngines } from '@/capabilities/simulatedEngine';
import { DeliveryObservation } from '@/capabilities/types';
import { createMemoryRepos } from '@/data/repos/memoryRepos';
import { Repos } from '@/data/repos/types';
import { Bowler } from '@/domain/types';
import { WEIGHTING } from '@/domain/workload';

import {
  endSession,
  loadPendingObservations,
  markRecording,
  pendingKey,
  processSession,
  startSession,
} from './persistSession';

const NOW = new Date('2026-08-17T18:04:00').getTime();
const clock = { now: () => NOW };

const bowler: Bowler = {
  id: 'b1',
  yob: 2010,
  arm: 'right',
  type: 'Pace',
  heightCm: 178,
  armSpanCm: 183,
  targetSpeedKmh: 120,
  fix: null,
  unit: 'km/h',
  guardianEmail: null,
  consentState: 'granted',
};

const obs = (
  index: number,
  over: Partial<DeliveryObservation> = {},
): DeliveryObservation => ({
  index,
  atMs: index * 3800,
  speedKmh: 112,
  speedBandKmh: 2.3,
  engineConfidence: 'ok',
  frameCount: 26,
  events: { bfc: 0.22, ffc: 0.46, release: 0.58 },
  clipPath: null,
  metrics: [
    { key: 'knee', value: 148, bandValue: 5 },
    { key: 'runup', value: 5.2, bandValue: 0.3 },
    { key: 'delay', value: 0.14, bandValue: 0.02 },
    { key: 'trunk', value: 38, bandValue: 6 },
  ],
  ...over,
});

function setup() {
  const repos: Repos = createMemoryRepos();
  repos.bowler.save(bowler);
  return repos;
}

const start = (repos: Repos, over: Partial<Parameters<typeof startSession>[0]> = {}) =>
  startSession({
    repos,
    bowlerId: bowler.id,
    sessionType: 'net',
    overrodeChecks: false,
    captureFps: 240,
    simulated: true,
    clock,
    ...over,
  });

describe('startSession', () => {
  it('opens an armed session carrying the type weighting', () => {
    const repos = setup();
    const { session } = start(repos, { sessionType: 'match' });

    expect(session.status).toBe('armed');
    expect(session.weighting).toBe(WEIGHTING.match);
    expect(repos.sessions.get(session.id)?.status).toBe('armed');
  });

  it('records that the readings will be simulated', () => {
    const repos = setup();
    const { session } = start(repos, { simulated: true });
    expect(repos.sessions.get(session.id)?.simulated).toBe(true);
  });

  it('saves the calibration and remembers the venue', () => {
    const repos = setup();
    const taps = [
      { x: 0.5, y: 0.62 },
      { x: 0.52, y: 0.4 },
    ];
    const { session, scale } = start(repos, { taps });

    expect(scale).not.toBeNull();
    expect(session.calibrationId).not.toBeNull();
    expect(session.venueId).not.toBeNull();
    expect(repos.calibrations.byFingerprint(session.venueId!)).not.toBeNull();
  });

  it('does not calibrate from two taps on the same point', () => {
    const repos = setup();
    const taps = [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
    ];
    const { session, scale } = start(repos, { taps });

    expect(scale).toBeNull();
    expect(session.calibrationId).toBeNull();
  });

  it('carries a placement override onto the session', () => {
    const repos = setup();
    const { session } = start(repos, { overrodeChecks: true });
    expect(repos.sessions.get(session.id)?.lowConfOverride).toBe(true);
  });
});

describe('markRecording', () => {
  it('moves the session to recording', () => {
    const repos = setup();
    const { session } = start(repos);
    markRecording(repos, session.id);
    expect(repos.sessions.get(session.id)?.status).toBe('recording');
  });
});

describe('endSession', () => {
  const end = (repos: Repos, sessionId: string, observations: DeliveryObservation[]) =>
    endSession({
      repos,
      sessionId,
      bowlerId: bowler.id,
      clipPath: 'file://clip.mov',
      observations,
      thermalEvents: [],
      captureFps: 240,
      clock,
    });

  it('closes the session and keeps the clip', () => {
    const repos = setup();
    const { session } = start(repos);
    end(repos, session.id, [obs(1), obs(2)]);

    const stored = repos.sessions.get(session.id);
    expect(stored?.status).toBe('ended');
    expect(stored?.endedAt).toBe(NOW);
    expect(stored?.clipPath).toBe('file://clip.mov');
  });

  it('adds the spell to the workload ledger before any analysis happens', () => {
    const repos = setup();
    const { session } = start(repos, { sessionType: 'match' });
    end(repos, session.id, [obs(1), obs(2), obs(3)]);

    const entries = repos.workload.all();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      deliveries: 3,
      source: 'captured',
      weighting: WEIGHTING.match,
      sessionId: session.id,
      date: '2026-08-17',
    });
  });

  it('does not double-count when a session is ended twice', () => {
    const repos = setup();
    const { session } = start(repos);
    end(repos, session.id, [obs(1)]);
    end(repos, session.id, [obs(1)]);
    expect(repos.workload.all()).toHaveLength(1);
  });

  it('counts nothing against the workload when no delivery was detected', () => {
    const repos = setup();
    const { session } = start(repos);
    end(repos, session.id, []);
    expect(repos.workload.all()).toHaveLength(0);
  });

  it('stashes the observations so an interrupted analysis can resume', () => {
    const repos = setup();
    const { session } = start(repos);
    end(repos, session.id, [obs(1), obs(2)]);
    expect(loadPendingObservations(repos, session.id)).toHaveLength(2);
  });

  it('survives a corrupt resume payload', () => {
    const repos = setup();
    const { session } = start(repos);
    repos.settings.set(pendingKey(session.id), '{not json');
    expect(loadPendingObservations(repos, session.id)).toEqual([]);
  });
});

describe('processSession', () => {
  const { inference } = createSimulatedEngines({ processingStepMs: 0 });

  async function capture(
    observations: DeliveryObservation[],
    over: Partial<Parameters<typeof startSession>[0]> = {},
  ) {
    const repos = setup();
    const { session } = start(repos, over);
    markRecording(repos, session.id);
    endSession({
      repos,
      sessionId: session.id,
      bowlerId: bowler.id,
      clipPath: 'file://clip.mov',
      observations,
      thermalEvents: [],
      captureFps: 240,
      clock,
    });
    const result = await processSession({ repos, sessionId: session.id, inference, clock });
    return { repos, sessionId: session.id, result };
  }

  it('writes a delivery per observation and completes the session', async () => {
    const { repos, sessionId, result } = await capture([obs(1), obs(2), obs(3)]);

    expect(result.deliveriesAnalysed).toBe(3);
    expect(repos.sessions.get(sessionId)?.status).toBe('complete');
    expect(repos.deliveries.listForSession(sessionId)).toHaveLength(3);
  });

  it('stores each delivery with its band, frames and events', async () => {
    const { repos, sessionId } = await capture([obs(1)]);
    const delivery = repos.deliveries.listForSession(sessionId)[0];

    expect(delivery).toMatchObject({
      speedKmh: 112,
      speedBandKmh: 2.3,
      frameCount: 26,
      confidence: 'ok',
    });
    expect(delivery?.events).toEqual({ bfc: 0.22, ffc: 0.46, release: 0.58 });
  });

  it('stores metrics with their research reference range', async () => {
    const { repos, sessionId } = await capture([obs(1)]);
    const delivery = repos.deliveries.listForSession(sessionId)[0]!;
    const knee = repos.metrics.listForDelivery(delivery.id).find((m) => m.key === 'knee');

    expect(knee).toMatchObject({ value: 148, bandValue: 5, referenceLo: 150, referenceHi: 180 });
  });

  it('marks every delivery low-confidence when a placement check was overridden', async () => {
    const { repos, sessionId } = await capture([obs(1), obs(2)], { overrodeChecks: true });
    const deliveries = repos.deliveries.listForSession(sessionId);

    // Overriding is allowed; hiding the consequence is not.
    expect(deliveries.map((d) => d.confidence)).toEqual(['low', 'low']);
  });

  it('marks an implausible speed low-confidence rather than hiding it', async () => {
    const { repos, sessionId } = await capture([obs(1, { speedKmh: 260 }), obs(2)]);
    const deliveries = repos.deliveries.listForSession(sessionId);

    expect(deliveries).toHaveLength(2);
    expect(deliveries[0]?.confidence).toBe('low');
    expect(deliveries[1]?.confidence).toBe('ok');
  });

  it('keeps the engine verdict when the delivery is sound', async () => {
    const { repos, sessionId } = await capture([obs(1, { engineConfidence: 'low' }), obs(2)]);
    const deliveries = repos.deliveries.listForSession(sessionId);
    expect(deliveries[0]?.confidence).toBe('low');
    expect(deliveries[1]?.confidence).toBe('ok');
  });

  it('saves exactly one insight, choosing the safest close limiter', async () => {
    const { repos, sessionId } = await capture([obs(1), obs(2), obs(3)]);
    const insight = repos.insights.forSession(sessionId);

    expect(insight?.determinantKey).toBe('knee');
    expect(insight?.drillId).toBe('brace');
    expect(insight?.rationale).toContain('close');
  });

  it('never lets a low-confidence session feed an insight', async () => {
    const { repos, sessionId } = await capture([obs(1), obs(2)], { overrodeChecks: true });

    // Every delivery is low-confidence, so there are no means to score.
    expect(repos.metrics.sessionMeans(sessionId)).toEqual([]);
    expect(repos.insights.forSession(sessionId)).toBeNull();
  });

  it('reports progress delivery by delivery', async () => {
    const repos = setup();
    const { session } = start(repos);
    endSession({
      repos,
      sessionId: session.id,
      bowlerId: bowler.id,
      clipPath: null,
      observations: [obs(1), obs(2)],
      thermalEvents: [],
      captureFps: 240,
      clock,
    });

    const progress: [number, number][] = [];
    await processSession({
      repos,
      sessionId: session.id,
      inference,
      clock,
      onProgress: (done, total) => progress.push([done, total]),
    });

    expect(progress).toEqual([
      [1, 2],
      [2, 2],
    ]);
  });

  it('clears the resume payload once the session is complete', async () => {
    const { repos, sessionId } = await capture([obs(1)]);
    expect(loadPendingObservations(repos, sessionId)).toEqual([]);
  });

  it('resumes from the checkpoint without duplicating finished deliveries', async () => {
    const repos = setup();
    const { session } = start(repos);
    endSession({
      repos,
      sessionId: session.id,
      bowlerId: bowler.id,
      clipPath: null,
      observations: [obs(1), obs(2), obs(3)],
      thermalEvents: [],
      captureFps: 240,
      clock,
    });

    // Simulate a crash after the first two deliveries were written.
    repos.sessions.update(session.id, { status: 'processing', processedCount: 2 });
    repos.deliveries.insert({
      id: 'd1',
      sessionId: session.id,
      index: 1,
      speedKmh: 112,
      speedBandKmh: 2.3,
      confidence: 'ok',
      clipPath: null,
      frameCount: 26,
      events: null,
      createdAt: NOW,
    });
    repos.deliveries.insert({
      id: 'd2',
      sessionId: session.id,
      index: 2,
      speedKmh: 112,
      speedBandKmh: 2.3,
      confidence: 'ok',
      clipPath: null,
      frameCount: 26,
      events: null,
      createdAt: NOW,
    });

    await processSession({ repos, sessionId: session.id, inference, clock });

    // Three in total, not five: the finished two were not redone.
    expect(repos.deliveries.listForSession(session.id)).toHaveLength(3);
    expect(repos.sessions.get(session.id)?.status).toBe('complete');
    // And the spell was only ever counted once against the ledger.
    expect(repos.workload.all()).toHaveLength(1);
  });

  it('refuses to process a session that does not exist', async () => {
    await expect(
      processSession({ repos: setup(), sessionId: 'nope', inference, clock }),
    ).rejects.toThrow('nope');
  });
});
