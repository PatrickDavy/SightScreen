import { DeliveryObservation } from '@/capabilities/types';

import {
  CaptureAction,
  CaptureState,
  DEFAULT_COUNTDOWN_S,
  averageKmh,
  captureReducer,
  deliveryCount,
  fastestBandKmh,
  fastestKmh,
  hasUsableCalibration,
  initialCaptureState,
} from './captureMachine';

const run = (actions: CaptureAction[], from: CaptureState = initialCaptureState()): CaptureState =>
  actions.reduce(captureReducer, from);

const obs = (index: number, speedKmh: number, band = 2): DeliveryObservation => ({
  index,
  atMs: index * 3800,
  speedKmh,
  speedBandKmh: band,
  engineConfidence: 'ok',
  frameCount: 24,
  events: null,
  clipPath: null,
  metrics: [],
});

const armed = (): CaptureState =>
  run([
    { type: 'toPlacement' },
    { type: 'toReady' },
    { type: 'arm', sessionId: 's1', captureFps: 240 },
  ]);

const recording = (): CaptureState => run([{ type: 'skipCountdown' }], armed());

describe('capture flow', () => {
  it('starts on the session type picker', () => {
    expect(initialCaptureState().step).toBe('type');
  });

  it('walks type → placement → calibration → ready', () => {
    const state = run([{ type: 'toPlacement' }, { type: 'toCalibration' }]);
    expect(state.step).toBe('calib');
    expect(run([{ type: 'toReady' }], state).step).toBe('ready');
  });

  it('skips calibration when the venue is already known', () => {
    expect(run([{ type: 'toPlacement' }, { type: 'toReady' }]).step).toBe('ready');
  });

  it('arms into the countdown at the configured length', () => {
    const state = run([
      { type: 'setCountdown', seconds: 60 },
      { type: 'arm', sessionId: 's1', captureFps: 240 },
    ]);
    expect(state.step).toBe('count');
    expect(state.count).toBe(60);
    expect(state.sessionId).toBe('s1');
  });

  it('defaults the countdown to 30 seconds', () => {
    expect(initialCaptureState().countdownSeconds).toBe(DEFAULT_COUNTDOWN_S);
  });

  it('counts down and starts recording at zero', () => {
    let state = run([{ type: 'setCountdown', seconds: 3 }, { type: 'arm', sessionId: 's1', captureFps: 240 }]);
    state = captureReducer(state, { type: 'tick' });
    expect(state).toMatchObject({ step: 'count', count: 2 });
    state = captureReducer(state, { type: 'tick' });
    expect(state).toMatchObject({ step: 'count', count: 1 });
    state = captureReducer(state, { type: 'tick' });
    expect(state).toMatchObject({ step: 'rec', count: 0 });
  });

  it('lets an impatient bowler skip the countdown', () => {
    expect(recording().step).toBe('rec');
  });

  it('ignores ticks once recording', () => {
    const state = captureReducer(recording(), { type: 'tick' });
    expect(state.step).toBe('rec');
  });
});

describe('calibration', () => {
  it('takes exactly two taps and ignores the rest', () => {
    const tap = { x: 0.5, y: 0.5 };
    const state = run([
      { type: 'addTap', tap },
      { type: 'addTap', tap: { x: 0.6, y: 0.7 } },
      { type: 'addTap', tap: { x: 0.1, y: 0.1 } },
    ]);
    expect(state.taps).toHaveLength(2);
  });

  it('is only usable once both points are marked', () => {
    expect(hasUsableCalibration(initialCaptureState())).toBe(false);
    const one = captureReducer(initialCaptureState(), { type: 'addTap', tap: { x: 0.2, y: 0.8 } });
    expect(hasUsableCalibration(one)).toBe(false);
    const two = captureReducer(one, { type: 'addTap', tap: { x: 0.5, y: 0.6 } });
    expect(hasUsableCalibration(two)).toBe(true);
  });

  it('is not usable when both marks land on the same point', () => {
    // No separation means no scale, and no scale means no speed.
    const state = run([
      { type: 'addTap', tap: { x: 0.5, y: 0.5 } },
      { type: 'addTap', tap: { x: 0.5, y: 0.5 } },
    ]);
    expect(state.taps).toHaveLength(2);
    expect(hasUsableCalibration(state)).toBe(false);
  });

  it('is not usable when a tap never resolved to a coordinate', () => {
    // react-native-web leaves locationX/Y undefined, which used to divide into
    // NaN and store a meaningless calibration behind an enabled button.
    const state = run([
      { type: 'addTap', tap: { x: Number.NaN, y: Number.NaN } },
      { type: 'addTap', tap: { x: 0.5, y: 0.4 } },
    ]);
    expect(hasUsableCalibration(state)).toBe(false);
  });

  it('clears the taps when calibration is restarted', () => {
    const state = run([
      { type: 'addTap', tap: { x: 0.2, y: 0.8 } },
      { type: 'toCalibration' },
    ]);
    expect(state.taps).toEqual([]);
  });
});

describe('overriding a placement check', () => {
  it('records the override so every delivery can be marked low-confidence', () => {
    const state = run([{ type: 'toPlacement' }, { type: 'toReady', overrode: true }]);
    expect(state.overrodeChecks).toBe(true);
  });

  it('stays overridden once set — going back must not quietly clear it', () => {
    const state = run(
      [{ type: 'toCalibration' }, { type: 'toReady' }],
      run([{ type: 'toPlacement' }, { type: 'toReady', overrode: true }]),
    );
    expect(state.overrodeChecks).toBe(true);
  });

  it('is not set when every check passed', () => {
    expect(run([{ type: 'toPlacement' }, { type: 'toReady' }]).overrodeChecks).toBe(false);
  });
});

describe('recording', () => {
  it('counts deliveries as they are detected', () => {
    const state = run(
      [
        { type: 'delivery', observation: obs(1, 112) },
        { type: 'delivery', observation: obs(2, 108) },
      ],
      recording(),
    );
    expect(deliveryCount(state)).toBe(2);
  });

  it('ignores deliveries that arrive outside the recording state', () => {
    const state = captureReducer(initialCaptureState(), {
      type: 'delivery',
      observation: obs(1, 112),
    });
    expect(deliveryCount(state)).toBe(0);
  });

  it('goes amber on a problem and clears itself', () => {
    const problem = { reason: 'out-of-frame' as const, spoken: "Can't see the bowler" };
    const amber = captureReducer(recording(), { type: 'problem', problem });
    expect(amber.problem).toEqual(problem);
    expect(captureReducer(amber, { type: 'resolved' }).problem).toBeNull();
  });

  it('records a thermal downgrade rather than stopping the session', () => {
    const state = captureReducer(recording(), { type: 'fpsChanged', fps: 120, atMs: 90_000 });
    expect(state.step).toBe('rec');
    expect(state.captureFps).toBe(120);
    expect(state.thermalEvents).toEqual(['fps=120@90000ms']);
  });

  it('ends on a tap, keeping the deliveries and clearing any amber', () => {
    const state = run(
      [
        { type: 'delivery', observation: obs(1, 112) },
        { type: 'problem', problem: { reason: 'overheating', spoken: 'Getting hot' } },
        { type: 'end', clipPath: 'file://clip.mov' },
      ],
      recording(),
    );
    expect(state).toMatchObject({ step: 'ended', clipPath: 'file://clip.mov', problem: null });
    expect(deliveryCount(state)).toBe(1);
  });
});

describe('after the spell', () => {
  const ended = () =>
    run(
      [
        { type: 'delivery', observation: obs(1, 112, 2.4) },
        { type: 'delivery', observation: obs(2, 116, 2.1) },
        { type: 'delivery', observation: obs(3, 108, 1.9) },
        { type: 'end', clipPath: null },
      ],
      recording(),
    );

  it('reports the fastest ball with its own band, not the session mean', () => {
    const state = ended();
    expect(fastestKmh(state)).toBe(116);
    expect(fastestBandKmh(state)).toBe(2.1);
  });

  it('averages the deliveries', () => {
    expect(averageKmh(ended())).toBeCloseTo(112);
  });

  it('has no figures at all when nothing was detected', () => {
    const state = run([{ type: 'end', clipPath: null }], recording());
    expect(deliveryCount(state)).toBe(0);
    expect(fastestKmh(state)).toBeNull();
    expect(averageKmh(state)).toBeNull();
  });

  it('lets the bowler try again, discarding the empty attempt', () => {
    const state = run([{ type: 'end', clipPath: null }, { type: 'retry' }], recording());
    expect(state).toMatchObject({ step: 'ready', observations: [] });
  });

  it('moves into processing and checkpoints progress', () => {
    const state = run([{ type: 'startProcessing' }, { type: 'processed', count: 2 }], ended());
    expect(state).toMatchObject({ step: 'proc', processedCount: 2 });
  });
});

describe('resuming an interrupted session', () => {
  it('drops straight into processing from the checkpoint', () => {
    const state = captureReducer(initialCaptureState(), {
      type: 'resume',
      sessionId: 's_prev',
      sessionType: 'match',
      observations: [obs(1, 110), obs(2, 114), obs(3, 112)],
      processedCount: 2,
      clipPath: 'file://clip.mov',
      overrodeChecks: true,
    });

    expect(state).toMatchObject({
      step: 'proc',
      sessionId: 's_prev',
      sessionType: 'match',
      processedCount: 2,
      overrodeChecks: true,
    });
    // The footage and its deliveries are never lost.
    expect(deliveryCount(state)).toBe(3);
  });
});
