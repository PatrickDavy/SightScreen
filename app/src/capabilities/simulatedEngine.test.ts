import { selectInsight } from '@/domain/insight';
import { DETERMINANT_KEYS } from '@/domain/content/determinants';
import { systemClock } from '@/domain/clock';

import { createFakeCapabilities, DEFAULT_FAKE_SEED } from './index.fake';
import { createSimulatedEngines } from './simulatedEngine';
import { CaptureSignal, DeliveryObservation } from './types';

const cfg = { sessionId: 'ses_test', scale: null, targetFps: 240, clock: systemClock };

/** Runs a capture for `ticks` intervals under fake timers and stops it. */
async function runCapture(sessionId = 'ses_test', ticks = 6) {
  const { capture } = createSimulatedEngines({ intervalMs: 1000 });
  const signals: CaptureSignal[] = [];
  const handle = await capture.start({ ...cfg, sessionId }, (s) => signals.push(s));
  jest.advanceTimersByTime(ticks * 1000);
  const result = await handle.stop();
  return { signals, ...result };
}

describe('simulated capture engine', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('emits one delivery per interval and reports them on stop', async () => {
    const { signals, observations } = await runCapture('ses_a', 5);
    const deliveries = signals.filter((s) => s.kind === 'delivery');
    expect(deliveries).toHaveLength(5);
    expect(observations).toHaveLength(5);
    expect(observations.map((o) => o.index)).toEqual([1, 2, 3, 4, 5]);
  });

  it('is deterministic for a given session id', async () => {
    const first = await runCapture('ses_same', 4);
    const second = await runCapture('ses_same', 4);
    expect(second.observations).toEqual(first.observations);
  });

  it('produces different readings for different sessions', async () => {
    const a = await runCapture('ses_one', 4);
    const b = await runCapture('ses_two', 4);
    expect(b.observations).not.toEqual(a.observations);
  });

  it('carries a band and a frame count on every delivery', async () => {
    const { observations } = await runCapture('ses_bands', 6);
    for (const o of observations) {
      expect(o.speedBandKmh).toBeGreaterThan(0);
      expect(o.frameCount).toBeGreaterThan(0);
      expect(o.speedKmh).toBeGreaterThan(40);
      expect(o.speedKmh).toBeLessThan(170);
    }
  });

  it('measures every determinant on every delivery', async () => {
    const { observations } = await runCapture('ses_metrics', 3);
    for (const o of observations) {
      expect(o.metrics.map((m) => m.key).sort()).toEqual([...DETERMINANT_KEYS].sort());
    }
  });

  it('raises an amber problem aloud and then clears it', async () => {
    const { capture } = createSimulatedEngines({
      intervalMs: 1000,
      problemAtMs: 2500,
      resolveAtMs: 4000,
    });
    const signals: CaptureSignal[] = [];
    const handle = await capture.start(cfg, (s) => signals.push(s));

    jest.advanceTimersByTime(3000);
    const problem = signals.find((s) => s.kind === 'problem');
    expect(problem).toEqual({
      kind: 'problem',
      reason: 'out-of-frame',
      spoken: "Can't see the bowler",
    });

    jest.advanceTimersByTime(2000);
    expect(signals.some((s) => s.kind === 'resolved')).toBe(true);
    await handle.stop();
  });

  it('stops emitting once stopped', async () => {
    const { capture } = createSimulatedEngines({ intervalMs: 1000 });
    const signals: CaptureSignal[] = [];
    const handle = await capture.start(cfg, (s) => signals.push(s));
    jest.advanceTimersByTime(2000);
    await handle.stop();
    const afterStop = signals.length;
    jest.advanceTimersByTime(10000);
    expect(signals).toHaveLength(afterStop);
  });

  it('feeds selectInsight a session with several close limiters', async () => {
    const { observations } = await runCapture('ses_insight', 10);
    // Mirrors repos.metrics.sessionMeans: mean per key across the session.
    const means = DETERMINANT_KEYS.map((key) => {
      const rows = observations.flatMap((o) => o.metrics.filter((m) => m.key === key));
      return {
        key,
        mean: rows.reduce((a, m) => a + m.value, 0) / rows.length,
        meanBand: rows.reduce((a, m) => a + m.bandValue, 0) / rows.length,
      };
    });

    const insight = selectInsight('ses_insight', means);
    expect(insight).not.toBeNull();
    // The front knee is the safest and easiest of the close limiters, so the
    // tiebreak must land there and say so.
    expect(insight?.determinantKey).toBe('knee');
    expect(insight?.drillId).toBe('brace');
    expect(insight?.rationale).toContain('close');
    expect(insight?.estimatedGainHi).toBeGreaterThan(insight!.estimatedGainLo);
  });
});

describe('simulated inference engine', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const obs = (index: number): DeliveryObservation => ({
    index,
    atMs: index * 1000,
    speedKmh: 110,
    speedBandKmh: 2,
    engineConfidence: 'ok',
    frameCount: 24,
    events: null,
    clipPath: null,
    metrics: [],
  });

  it('reports progress per delivery and resolves them all', async () => {
    const { inference } = createSimulatedEngines({ processingStepMs: 10 });
    const progress: [number, number][] = [];
    const promise = inference.analyse(
      { sessionId: 's', clipPath: null, observations: [obs(1), obs(2), obs(3)], fromIndex: 0 },
      (done, total) => progress.push([done, total]),
    );
    await jest.advanceTimersByTimeAsync(100);
    const result = await promise;

    expect(result.map((o) => o.index)).toEqual([1, 2, 3]);
    expect(progress).toEqual([
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  });

  it('resumes from a checkpoint without redoing finished deliveries', async () => {
    const { inference } = createSimulatedEngines({ processingStepMs: 10 });
    const progress: [number, number][] = [];
    const promise = inference.analyse(
      { sessionId: 's', clipPath: null, observations: [obs(1), obs(2), obs(3)], fromIndex: 2 },
      (done, total) => progress.push([done, total]),
    );
    await jest.advanceTimersByTimeAsync(100);
    const result = await promise;

    expect(result.map((o) => o.index)).toEqual([3]);
    expect(progress).toEqual([[3, 3]]);
  });

  it('completes immediately when there is nothing left to analyse', async () => {
    const { inference } = createSimulatedEngines({ processingStepMs: 10 });
    const progress: [number, number][] = [];
    const result = await inference.analyse(
      { sessionId: 's', clipPath: null, observations: [obs(1)], fromIndex: 1 },
      (done, total) => progress.push([done, total]),
    );
    expect(result).toEqual([]);
    expect(progress).toEqual([[1, 1]]);
  });
});

/**
 * Determinism of the test fakes.
 *
 * The engine seeds from the session id when no seed is given, and session ids
 * carry a wall-clock timestamp — so an unseeded fake produced different
 * readings on every run. That surfaced as an insight assertion in
 * CaptureScreen.test failing roughly one run in ten, in a test that had nothing
 * to do with randomness. The guard is here rather than there because the trap
 * belongs to the fake, not to any one test.
 */
describe('the fake capability set is reproducible', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('seeds the simulated engine by default', () => {
    expect(DEFAULT_FAKE_SEED).toBeDefined();
  });

  it('produces identical readings across two independently built fakes', async () => {
    // Fake timers and a fixed tick count, so the comparison is between the
    // readings and not between two races. Different session ids on purpose:
    // the whole point is that the id no longer decides the seed.
    const observe = async (sessionId: string) => {
      const caps = createFakeCapabilities({ intervalMs: 1000 });
      const seen: DeliveryObservation[] = [];
      const handle = await caps.capture.start(
        { sessionId, scale: null, targetFps: 240, clock: systemClock },
        (signal) => {
          if (signal.kind === 'delivery') seen.push(signal.observation);
        },
      );
      jest.advanceTimersByTime(5000);
      await handle.stop();
      return seen;
    };

    const a = await observe('ses_one');
    const b = await observe('ses_two');

    expect(a).toHaveLength(5);
    expect(a).toEqual(b);
  });

  it('still lets a test ask for different readings', async () => {
    const first = createFakeCapabilities({ seed: 99 });
    const second = createFakeCapabilities({ seed: 100 });
    expect(first).not.toBe(second);
  });
});
