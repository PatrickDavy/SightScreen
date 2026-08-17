/**
 * The capture state machine — S20 through S26.
 *
 * A pure reducer, deliberately free of React, timers and repositories: capture
 * is the flow whose failures are unrecoverable (a lost spell cannot be
 * re-bowled), so its transitions are the part that most needs to be testable
 * without a renderer.
 *
 *   type → place → calib → ready → count → rec → ended → proc
 *            ↳──────────────↗ (venue already calibrated, or overridden)
 *                                        ended → ready (nothing detected)
 */
import { Tap } from '@/domain/calibration';
import { SessionType } from '@/domain/types';

import { DeliveryObservation, ProblemReason } from '@/capabilities/types';

export type CaptureStep =
  | 'type'
  | 'place'
  | 'calib'
  | 'ready'
  | 'count'
  | 'rec'
  | 'ended'
  | 'proc';

/** The three countdown lengths S23 offers. 30 s is the default. */
export const COUNTDOWN_OPTIONS = [15, 30, 60] as const;
export const DEFAULT_COUNTDOWN_S = 30;

export interface CaptureProblem {
  reason: ProblemReason;
  spoken: string;
}

export interface CaptureState {
  step: CaptureStep;
  sessionType: SessionType;
  /** Calibration taps: the popping crease, then the base of the stumps. */
  taps: Tap[];
  countdownSeconds: number;
  /** Live countdown remaining. */
  count: number;
  audioEnabled: boolean;
  spokenEnabled: boolean;
  observations: DeliveryObservation[];
  /** Non-null puts S24 into its amber state. Clears itself. */
  problem: CaptureProblem | null;
  /**
   * A placement check was continued past. Every delivery in the session is then
   * written low-confidence: overriding is allowed, hiding the cost is not.
   */
  overrodeChecks: boolean;
  sessionId: string | null;
  clipPath: string | null;
  /** Deliveries persisted so far — the resume checkpoint. */
  processedCount: number;
  thermalEvents: string[];
  captureFps: number | null;
}

export type CaptureAction =
  | { type: 'setSessionType'; sessionType: SessionType }
  | { type: 'toPlacement' }
  | { type: 'toCalibration' }
  /** `overrode` when a failing check was continued past. */
  | { type: 'toReady'; overrode?: boolean }
  | { type: 'addTap'; tap: Tap }
  | { type: 'clearTaps' }
  | { type: 'setCountdown'; seconds: number }
  | { type: 'setAudio'; enabled: boolean }
  | { type: 'setSpoken'; enabled: boolean }
  | { type: 'arm'; sessionId: string; captureFps: number | null }
  | { type: 'tick' }
  | { type: 'skipCountdown' }
  | { type: 'delivery'; observation: DeliveryObservation }
  | { type: 'problem'; problem: CaptureProblem }
  | { type: 'resolved' }
  | { type: 'fpsChanged'; fps: number; atMs: number }
  | { type: 'end'; clipPath: string | null }
  | { type: 'retry' }
  | { type: 'startProcessing' }
  | { type: 'processed'; count: number }
  /** Relaunch after an interrupted session: drop straight into processing. */
  | {
      type: 'resume';
      sessionId: string;
      sessionType: SessionType;
      observations: DeliveryObservation[];
      processedCount: number;
      clipPath: string | null;
      overrodeChecks: boolean;
    };

export function initialCaptureState(sessionType: SessionType = 'net'): CaptureState {
  return {
    step: 'type',
    sessionType,
    taps: [],
    countdownSeconds: DEFAULT_COUNTDOWN_S,
    count: DEFAULT_COUNTDOWN_S,
    audioEnabled: true,
    // Off by default: the counter alone may satisfy mid-session curiosity, and
    // whether spoken speed helps or breaks the rhythm is an open question the
    // beta is meant to answer.
    spokenEnabled: false,
    observations: [],
    problem: null,
    overrodeChecks: false,
    sessionId: null,
    clipPath: null,
    processedCount: 0,
    thermalEvents: [],
    captureFps: null,
  };
}

export function captureReducer(state: CaptureState, action: CaptureAction): CaptureState {
  switch (action.type) {
    case 'setSessionType':
      return { ...state, sessionType: action.sessionType };

    case 'toPlacement':
      return { ...state, step: 'place' };

    case 'toCalibration':
      return { ...state, step: 'calib', taps: [] };

    case 'toReady':
      return {
        ...state,
        step: 'ready',
        // Sticky: once a check has been overridden the session is compromised,
        // and going back and forth must not quietly clear that.
        overrodeChecks: state.overrodeChecks || action.overrode === true,
      };

    case 'addTap':
      // Two taps and no more — the crease, then the stumps.
      return state.taps.length >= 2 ? state : { ...state, taps: [...state.taps, action.tap] };

    case 'clearTaps':
      return { ...state, taps: [] };

    case 'setCountdown':
      return { ...state, countdownSeconds: action.seconds, count: action.seconds };

    case 'setAudio':
      return { ...state, audioEnabled: action.enabled };

    case 'setSpoken':
      return { ...state, spokenEnabled: action.enabled };

    case 'arm':
      return {
        ...state,
        step: 'count',
        count: state.countdownSeconds,
        sessionId: action.sessionId,
        captureFps: action.captureFps,
        observations: [],
        problem: null,
        clipPath: null,
        processedCount: 0,
      };

    case 'tick': {
      if (state.step !== 'count') return state;
      const next = state.count - 1;
      return next <= 0 ? { ...state, count: 0, step: 'rec' } : { ...state, count: next };
    }

    case 'skipCountdown':
      return state.step === 'count' ? { ...state, count: 0, step: 'rec' } : state;

    case 'delivery':
      if (state.step !== 'rec') return state;
      return { ...state, observations: [...state.observations, action.observation] };

    case 'problem':
      return state.step === 'rec' ? { ...state, problem: action.problem } : state;

    case 'resolved':
      return { ...state, problem: null };

    case 'fpsChanged':
      // Degrade, never stop: record it so review can explain the wider bands.
      return {
        ...state,
        captureFps: action.fps,
        thermalEvents: [...state.thermalEvents, `fps=${action.fps}@${action.atMs}ms`],
      };

    case 'end':
      if (state.step !== 'rec' && state.step !== 'count') return state;
      return { ...state, step: 'ended', clipPath: action.clipPath, problem: null };

    case 'retry':
      return { ...state, step: 'ready', observations: [], problem: null, clipPath: null };

    case 'startProcessing':
      return { ...state, step: 'proc' };

    case 'processed':
      return { ...state, processedCount: action.count };

    case 'resume':
      return {
        ...state,
        step: 'proc',
        sessionId: action.sessionId,
        sessionType: action.sessionType,
        observations: action.observations,
        processedCount: action.processedCount,
        clipPath: action.clipPath,
        overrodeChecks: action.overrodeChecks,
        problem: null,
      };

    default:
      return state;
  }
}

/* ---------- selectors: derived, never stored ---------- */

/** Whether S22's Continue is available: two taps that are not the same point. */
export function hasUsableCalibration(state: CaptureState): boolean {
  return state.taps.length === 2;
}

export function deliveryCount(state: CaptureState): number {
  return state.observations.length;
}

export function fastestKmh(state: CaptureState): number | null {
  if (state.observations.length === 0) return null;
  return Math.max(...state.observations.map((o) => o.speedKmh));
}

export function averageKmh(state: CaptureState): number | null {
  if (state.observations.length === 0) return null;
  const total = state.observations.reduce((a, o) => a + o.speedKmh, 0);
  return total / state.observations.length;
}

/** Mean band across the session — the honest band for an aggregate. */
export function averageBandKmh(state: CaptureState): number | null {
  if (state.observations.length === 0) return null;
  const total = state.observations.reduce((a, o) => a + o.speedBandKmh, 0);
  return total / state.observations.length;
}

/** The band belonging to the fastest ball, not the session mean. */
export function fastestBandKmh(state: CaptureState): number | null {
  if (state.observations.length === 0) return null;
  return state.observations.reduce(
    (best, o) => (o.speedKmh > best.speedKmh ? o : best),
    state.observations[0]!,
  ).speedBandKmh;
}
