/**
 * The simulated capture and inference engines.
 *
 * These stand in for real 240 fps capture and on-device pose inference, which
 * need native modules and a trained model. They reproduce the prototype's
 * cadence (a delivery every 3.8 s, an amber alert at 13 s that clears at 18 s)
 * so the whole flow is exercisable, but unlike the prototype they are seeded
 * and take an injectable timer, so tests can assert on them.
 *
 * Both report `kind: 'simulated'`, which the UI must surface — a synthesised
 * speed may never be presented as a measurement.
 */
import { DETERMINANTS } from '@/domain/content/determinants';
import { Confidence } from '@/domain/types';

import { hashSeed, mulberry32 } from './prng';
import {
  CaptureConfig,
  CaptureEngine,
  CaptureHandle,
  CaptureSignal,
  DeliveryObservation,
  InferenceEngine,
  InferenceInput,
} from './types';

type TimerHandle = ReturnType<typeof setTimeout>;

export interface SimulatedEngineOptions {
  /** Prototype cadence: one delivery every 3.8 s. */
  intervalMs?: number;
  /** Prototype demo: amber fires here. */
  problemAtMs?: number;
  /** ...and clears here — "resumes itself". */
  resolveAtMs?: number;
  /** Prototype processing advances one delivery per 550 ms. */
  processingStepMs?: number;
  seed?: number;
  setTimer?: (fn: () => void, ms: number) => TimerHandle;
  clearTimer?: (handle: TimerHandle) => void;
}

const DEFAULTS = {
  intervalMs: 3800,
  problemAtMs: 13000,
  resolveAtMs: 18000,
  processingStepMs: 550,
};

/**
 * Centres for the four determinants, chosen to match the prototype's canonical
 * session: knee 148°, run-up 5.2 m/s, arm delay 0.14 s, trunk 38°.
 *
 * These matter. Three of the four sit just outside their good band by similar
 * margins, so selectInsight finds several close limiters and has to break the
 * tie on safetyEaseOrder — which lands on the front knee and produces the
 * "two limiters were close" rationale. That exercises the real selection path
 * rather than trivially picking a single obvious outlier.
 */
const METRIC_CENTRES: Record<string, { value: number; band: number; jitter: number }> = {
  knee: { value: 148, band: 5, jitter: 3 },
  runup: { value: 5.2, band: 0.3, jitter: 0.15 },
  delay: { value: 0.14, band: 0.02, jitter: 0.008 },
  trunk: { value: 38, band: 6, jitter: 2.5 },
};

function round(value: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}

function decimalsFor(key: string): number {
  return key === 'delay' ? 3 : key === 'runup' ? 2 : 1;
}

function makeObservation(index: number, atMs: number, rnd: () => number): DeliveryObservation {
  const speedKmh = round(105 + rnd() * 12, 1);
  const speedBandKmh = round(1.9 + rnd(), 1);
  const engineConfidence: Confidence = rnd() < 0.18 ? 'low' : 'ok';
  const frameCount = 19 + Math.floor(rnd() * 10);

  const metrics = Object.keys(DETERMINANTS).map((key) => {
    const centre = METRIC_CENTRES[key];
    // An unknown determinant would otherwise silently vanish from the insight
    // input, so fall back to the middle of its good band.
    if (!centre) {
      const det = DETERMINANTS[key];
      const good = det ? det.range.good : ([0, 1] as [number, number]);
      return { key, value: (good[0] + good[1]) / 2, bandValue: 0 };
    }
    const dp = decimalsFor(key);
    return {
      key,
      value: round(centre.value + (rnd() - 0.5) * 2 * centre.jitter, dp),
      bandValue: centre.band,
    };
  });

  return {
    index,
    atMs,
    speedKmh,
    speedBandKmh,
    engineConfidence,
    frameCount,
    // Prototype scrubber positions, lightly jittered.
    events: {
      bfc: round(0.22 + (rnd() - 0.5) * 0.04, 3),
      ffc: round(0.46 + (rnd() - 0.5) * 0.04, 3),
      release: round(0.58 + (rnd() - 0.5) * 0.04, 3),
    },
    clipPath: null,
    metrics,
  };
}

export function createSimulatedEngines(options: SimulatedEngineOptions = {}): {
  capture: CaptureEngine;
  inference: InferenceEngine;
} {
  const intervalMs = options.intervalMs ?? DEFAULTS.intervalMs;
  const problemAtMs = options.problemAtMs ?? DEFAULTS.problemAtMs;
  const resolveAtMs = options.resolveAtMs ?? DEFAULTS.resolveAtMs;
  const processingStepMs = options.processingStepMs ?? DEFAULTS.processingStepMs;
  const setTimer = options.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
  const clearTimer = options.clearTimer ?? ((handle) => clearTimeout(handle));

  const capture: CaptureEngine = {
    kind: 'simulated',
    async start(cfg: CaptureConfig, onSignal: (s: CaptureSignal) => void): Promise<CaptureHandle> {
      const rnd = mulberry32(options.seed ?? hashSeed(cfg.sessionId));
      const observations: DeliveryObservation[] = [];
      const timers: TimerHandle[] = [];
      let elapsed = 0;
      let stopped = false;

      const tick = () => {
        if (stopped) return;
        elapsed += intervalMs;
        const observation = makeObservation(observations.length + 1, elapsed, rnd);
        observations.push(observation);
        onSignal({ kind: 'delivery', observation });
        timers.push(setTimer(tick, intervalMs));
      };
      timers.push(setTimer(tick, intervalMs));

      timers.push(
        setTimer(() => {
          if (stopped) return;
          onSignal({
            kind: 'problem',
            reason: 'out-of-frame',
            spoken: "Can't see the bowler",
          });
        }, problemAtMs),
      );
      timers.push(
        setTimer(() => {
          if (stopped) return;
          onSignal({ kind: 'resolved' });
        }, resolveAtMs),
      );

      return {
        async stop() {
          stopped = true;
          timers.forEach(clearTimer);
          timers.length = 0;
          return { clipPath: null, observations: [...observations] };
        },
      };
    },
  };

  const inference: InferenceEngine = {
    kind: 'simulated',
    // There is no model, so this replays what the live pass already produced.
    // The native implementation will run a pose pass over `clipPath` instead;
    // the signature is what stays the same. TODO(native): swap this out.
    analyse(input: InferenceInput, onProgress) {
      const pending = input.observations.filter((o) => o.index > input.fromIndex);
      const total = input.observations.length;
      return new Promise((resolve) => {
        let i = 0;
        const step = () => {
          if (i >= pending.length) {
            resolve(pending);
            return;
          }
          i += 1;
          onProgress(input.fromIndex + i, total);
          setTimer(step, processingStepMs);
        };
        if (pending.length === 0) {
          onProgress(total, total);
          resolve([]);
          return;
        }
        setTimer(step, processingStepMs);
      });
    },
  };

  return { capture, inference };
}
