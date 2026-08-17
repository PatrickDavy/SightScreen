/**
 * S20–S26. The screen that owns the capture session.
 *
 * The moving parts live elsewhere on purpose: transitions in captureMachine,
 * device access behind the capability seam, writes in persistSession. What is
 * left here is the wiring between them, plus the side effects that cannot be
 * pure — sounds, speech, timers, and the screen staying awake.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { View } from 'react-native';

import { ENTITLEMENT_KEY } from '@/app/boot';
import { useRepos } from '@/app/ReposProvider';
import { useCapabilities } from '@/capabilities/context';
import type { CaptureHandle } from '@/capabilities/types';
import { CapacityEstimate, estimateCapacity } from '@/domain/capacity';
import { monthKey, systemClock } from '@/domain/clock';
import { recordAnalysis } from '@/domain/paywall';
import { Unit } from '@/domain/types';
import { spokenSpeed } from '@/domain/units';
import type { RootStackParamList } from '@/navigation/types';
import {
  endSession,
  loadPendingObservations,
  markRecording,
  processSession,
  startSession,
} from '@/services/persistSession';
import { useAppStore } from '@/store/useAppStore';
import { color } from '@/theme/tokens';
import { CaptureBar } from '@/ui/CaptureBar';

import {
  averageBandKmh,
  averageKmh,
  captureReducer,
  deliveryCount,
  fastestBandKmh,
  fastestKmh,
  hasUsableCalibration,
  initialCaptureState,
} from './captureMachine';
import { evaluatePlacement, wouldOverride } from './placementChecks';
import { CalibStep } from './steps/CalibStep';
import { CountStep } from './steps/CountStep';
import { EndedStep } from './steps/EndedStep';
import { PlaceStep } from './steps/PlaceStep';
import { ProcessingStep } from './steps/ProcessingStep';
import { ReadyStep } from './steps/ReadyStep';
import { RecordStep } from './steps/RecordStep';
import { TypeStep } from './steps/TypeStep';

type Props = NativeStackScreenProps<RootStackParamList, 'Capture'>;

/** Set once the phone has been calibrated anywhere; see the note below. */
const CALIBRATED_KEY = 'lastCalibrationId';

const BAR: Record<string, { title: string; subtitle: string }> = {
  type: { title: 'Bowl', subtitle: 'S20 · WHAT KIND OF SPELL?' },
  place: { title: 'Place the phone', subtitle: 'S21 · CHECKS PASS AS YOU FIX THEM' },
  calib: { title: 'Calibrate', subtitle: 'S22 · TAP THE CREASE, THEN THE STUMPS' },
  ready: { title: 'Ready', subtitle: 'S23 · THE LAST TOUCH OF THE SESSION' },
  ended: { title: 'Session ended', subtitle: 'S25 · WHAT YOU JUST BOWLED' },
};

export function CaptureScreen({ navigation, route }: Props) {
  const { repos, mutate } = useRepos();
  const capabilities = useCapabilities();
  const showToast = useAppStore((s) => s.showToast);
  const setEntitlement = useAppStore((s) => s.setEntitlement);

  const [state, dispatch] = useReducer(
    captureReducer,
    initialCaptureState(route.params?.type ?? 'net'),
  );

  const bowler = repos.bowler.get();
  const unit: Unit = bowler?.unit ?? 'km/h';
  const simulated = capabilities.capture.kind === 'simulated';

  const handleRef = useRef<CaptureHandle | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  /* ---------- device signals for S21 and S23 ---------- */

  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [tiltDeg, setTiltDeg] = useState(0);
  const [lightOk, setLightOk] = useState(true);
  const [maxFps, setMaxFps] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<CapacityEstimate | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(1);

  useEffect(() => capabilities.sensors.subscribeOrientation(setOrientation), [capabilities]);
  useEffect(() => capabilities.sensors.subscribeLevel(setTiltDeg), [capabilities]);

  useEffect(() => {
    let cancelled = false;
    void capabilities.recorder.probe().then((probe) => {
      if (cancelled) return;
      setLightOk(probe.lightOk);
      setMaxFps(probe.maxFps > 0 ? probe.maxFps : null);
    });
    void capabilities.sensors.getHeadroom().then((headroom) => {
      if (cancelled) return;
      setBatteryLevel(headroom.batteryLevel);
      setCapacity(estimateCapacity(headroom));
    });
    return () => {
      cancelled = true;
    };
  }, [capabilities]);

  // The venue fingerprint is derived from the taps themselves, so it cannot
  // identify a venue *before* calibrating. Until a camera-pose fingerprint
  // exists, "has this phone been calibrated at all" is the best available
  // signal — which is what the prototype's single boolean did too.
  // TODO(native): replace with a real pose fingerprint lookup.
  const alreadyCalibrated = useMemo(
    () => state.taps.length === 2 || repos.settings.get(CALIBRATED_KEY) !== null,
    [repos, state.taps.length],
  );

  const checks = useMemo(
    () => evaluatePlacement({ orientation, tiltDeg, calibrated: alreadyCalibrated, lightOk }),
    [orientation, tiltDeg, alreadyCalibrated, lightOk],
  );

  /* ---------- the countdown ---------- */

  useEffect(() => {
    if (state.step !== 'count') return;
    const timer = setTimeout(() => dispatch({ type: 'tick' }), 1000);
    return () => clearTimeout(timer);
  }, [state.step, state.count]);

  /* ---------- recording ---------- */

  useEffect(() => {
    if (state.step !== 'rec' || !state.sessionId) return;
    const sessionId = state.sessionId;
    let disposed = false;

    void capabilities.screen.beginCaptureMode();
    void capabilities.audio.prepare();
    markRecording(repos, sessionId);

    void capabilities.capture
      .start(
        {
          sessionId,
          scale: null,
          targetFps: state.captureFps ?? 240,
          clock: systemClock,
        },
        (signal) => {
          if (disposed) return;
          switch (signal.kind) {
            case 'delivery':
              dispatch({ type: 'delivery', observation: signal.observation });
              if (state.audioEnabled) capabilities.audio.play('delivery');
              if (state.spokenEnabled) {
                capabilities.speech.speakDigits(spokenSpeed(signal.observation.speedKmh, unit));
              }
              break;
            case 'problem':
              dispatch({
                type: 'problem',
                problem: { reason: signal.reason, spoken: signal.spoken },
              });
              // Announced aloud: a failure discovered at the end of the spell
              // has already cost the bowler the spell.
              if (state.audioEnabled) capabilities.audio.play('alert');
              capabilities.speech.speakSentence(signal.spoken);
              break;
            case 'resolved':
              dispatch({ type: 'resolved' });
              break;
            case 'fps-changed':
              dispatch({ type: 'fpsChanged', fps: signal.fps, atMs: systemClock.now() });
              break;
          }
        },
      )
      .then((handle) => {
        if (disposed) void handle.stop();
        else handleRef.current = handle;
      });

    return () => {
      disposed = true;
    };
    // Keyed on the step alone: re-running this when a toggle changes would
    // restart the capture mid-spell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, state.sessionId]);

  /* ---------- actions ---------- */

  const close = useCallback(() => {
    void capabilities.screen.endCaptureMode();
    capabilities.speech.stop();
    navigation.goBack();
  }, [capabilities, navigation]);

  const arm = useCallback(() => {
    if (!bowler) return;
    const { session } = mutate((r) =>
      startSession({
        repos: r,
        bowlerId: bowler.id,
        sessionType: state.sessionType,
        taps: state.taps.length === 2 ? state.taps : undefined,
        overrodeChecks: state.overrodeChecks,
        captureFps: maxFps,
        simulated,
      }),
    );
    dispatch({ type: 'arm', sessionId: session.id, captureFps: maxFps });
  }, [bowler, mutate, state.sessionType, state.taps, state.overrodeChecks, maxFps, simulated]);

  const end = useCallback(() => {
    const handle = handleRef.current;
    handleRef.current = null;
    const { sessionId, observations, thermalEvents, captureFps, audioEnabled } = state;

    if (audioEnabled) capabilities.audio.play('end');
    void capabilities.screen.endCaptureMode();

    // Leave the recording state on the tap itself, not when the camera has
    // finished flushing its buffer. The summary is built from what the session
    // already observed, so it has everything it needs.
    dispatch({ type: 'end', clipPath: null });

    void (async () => {
      const stopped = handle ? await handle.stop() : { clipPath: null, observations: [] };
      if (!sessionId || !bowler) return;
      // The engine's list is authoritative — the reducer's copy can lag a
      // signal that arrived while it was stopping.
      const finalObservations =
        stopped.observations.length > 0 ? stopped.observations : observations;

      // Written straight through rather than via `mutate`: nothing is on screen
      // that reads this yet, and the processing step bumps once at the end.
      endSession({
        repos,
        sessionId,
        bowlerId: bowler.id,
        clipPath: stopped.clipPath,
        observations: finalObservations,
        thermalEvents,
        captureFps,
      });
    })();
  }, [capabilities, bowler, repos, state]);

  /* ---------- processing ----------
   * Started by the effect below and nowhere else, so that the button press, a
   * resumed session and a re-render cannot each kick off their own pass.
   */

  const runProcessing = useCallback(
    async (sessionId: string) => {
      const result = await processSession({
        repos,
        sessionId,
        inference: capabilities.inference,
        observations: loadPendingObservations(repos, sessionId),
        onProgress: (done, total) => {
          setProgress({ done, total });
          dispatch({ type: 'processed', count: done });
        },
      });

      const current = useAppStore.getState().entitlement;
      if (current) {
        const next = recordAnalysis(current, monthKey(systemClock.now()));
        repos.settings.set(ENTITLEMENT_KEY, JSON.stringify(next));
        setEntitlement(next);
      }

      if (state.audioEnabled) capabilities.audio.play('done');
      useAppStore.getState().bumpData();
      showToast(`Processed. ${result.deliveriesAnalysed} deliveries analysed.`, 'good');

      navigation.navigate('Tabs', {
        screen: 'HomeTab',
        params: { screen: 'Review', params: { sessionId } },
      });
    },
    [repos, capabilities, setEntitlement, state.audioEnabled, showToast, navigation],
  );

  const processingStarted = useRef(false);
  useEffect(() => {
    if (state.step !== 'proc' || !state.sessionId || processingStarted.current) return;
    processingStarted.current = true;
    void runProcessing(state.sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step, state.sessionId]);

  /* ---------- resuming an interrupted session ---------- */

  const resumeId = route.params?.resumeSessionId;
  const resumeApplied = useRef(false);
  useEffect(() => {
    if (!resumeId || resumeApplied.current) return;
    const session = repos.sessions.get(resumeId);
    if (!session) return;
    resumeApplied.current = true;
    dispatch({
      type: 'resume',
      sessionId: session.id,
      sessionType: session.type,
      observations: loadPendingObservations(repos, session.id),
      processedCount: session.processedCount,
      clipPath: session.clipPath,
      overrodeChecks: session.lowConfOverride,
    });
  }, [resumeId, repos]);

  /* ---------- render ---------- */

  // The full-bleed steps carry no chrome: at twenty metres, a header is noise.
  if (state.step === 'count') {
    return <CountStep count={state.count} onSkip={() => dispatch({ type: 'skipCountdown' })} />;
  }
  if (state.step === 'rec') {
    return <RecordStep count={deliveryCount(state)} problem={state.problem} onEnd={end} />;
  }
  if (state.step === 'proc') {
    return (
      <ProcessingStep
        done={progress.done || state.processedCount}
        total={progress.total || deliveryCount(state)}
        simulated={simulated}
      />
    );
  }

  const bar = BAR[state.step] ?? BAR.type!;

  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceApp }}>
      <CaptureBar title={bar.title} subtitle={bar.subtitle} onClose={close} />

      {state.step === 'type' ? (
        <TypeStep
          selected={state.sessionType}
          onSelect={(sessionType) => dispatch({ type: 'setSessionType', sessionType })}
          onContinue={() => dispatch({ type: 'toPlacement' })}
        />
      ) : null}

      {state.step === 'place' ? (
        <PlaceStep
          checks={checks}
          calibrated={alreadyCalibrated}
          onCalibrate={() => dispatch({ type: 'toCalibration' })}
          onContinue={() => dispatch({ type: 'toReady', overrode: wouldOverride(checks) })}
        />
      ) : null}

      {state.step === 'calib' ? (
        <CalibStep
          taps={state.taps}
          onTap={(tap) => dispatch({ type: 'addTap', tap })}
          onReset={() => dispatch({ type: 'clearTaps' })}
          canContinue={hasUsableCalibration(state)}
          onContinue={() => {
            repos.settings.set(CALIBRATED_KEY, 'set');
            dispatch({ type: 'toReady' });
          }}
          // No scale from a manual length yet, so the session is honest about
          // being less certain.
          onManualPitchLength={() => dispatch({ type: 'toReady', overrode: true })}
        />
      ) : null}

      {state.step === 'ready' ? (
        <ReadyStep
          countdownSeconds={state.countdownSeconds}
          onCountdownChange={(seconds) => dispatch({ type: 'setCountdown', seconds })}
          audioEnabled={state.audioEnabled}
          onAudioChange={(enabled) => dispatch({ type: 'setAudio', enabled })}
          spokenEnabled={state.spokenEnabled}
          onSpokenChange={(enabled) => dispatch({ type: 'setSpoken', enabled })}
          capacity={capacity}
          batteryLevel={batteryLevel}
          lowConfidenceWarning={state.overrodeChecks}
          onArm={arm}
        />
      ) : null}

      {state.step === 'ended' ? (
        <EndedStep
          deliveries={deliveryCount(state)}
          fastestKmh={fastestKmh(state)}
          fastestBandKmh={fastestBandKmh(state)}
          averageKmh={averageKmh(state)}
          averageBandKmh={averageBandKmh(state)}
          unit={unit}
          weightingLabel={state.sessionType === 'match' ? 'match' : 'net'}
          simulated={simulated}
          onProcess={() => dispatch({ type: 'startProcessing' })}
          onRetry={() => dispatch({ type: 'retry' })}
          onClose={close}
        />
      ) : null}
    </View>
  );
}
