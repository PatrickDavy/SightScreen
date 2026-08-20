import {
  CALIBRATION_REFERENCES,
  CREASE_TO_STUMPS_M,
  MAX_SCALE_UNCERTAINTY,
  PITCH_LENGTH_M,
  RETURN_CREASE_M,
  isCoarse,
  scaleUncertainty,
  sceneScale,
  toCalibration,
  venueFingerprint,
} from './calibration';

describe('sceneScale', () => {
  it('derives metres per frame unit from the crease-to-stumps span', () => {
    // A quarter of the frame apart vertically.
    const scale = sceneScale({ x: 0.5, y: 0.75 }, { x: 0.5, y: 0.5 });
    expect(scale?.metresPerUnit).toBeCloseTo(CREASE_TO_STUMPS_M / 0.25);
  });

  it('refuses two marks on the same point', () => {
    expect(sceneScale({ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.5 })).toBeNull();
  });

  it('refuses marks too close together to scale from', () => {
    expect(sceneScale({ x: 0.5, y: 0.5 }, { x: 0.502, y: 0.5 })).toBeNull();
  });

  it('refuses coordinates that never resolved', () => {
    // NaN passes a naive `dist < 0.01` check and yields a NaN scale, which is
    // worse than no scale: it reads as a calibrated venue and poisons every
    // speed derived from it.
    expect(sceneScale({ x: Number.NaN, y: Number.NaN }, { x: 0.5, y: 0.4 })).toBeNull();
    expect(sceneScale({ x: 0.5, y: 0.6 }, { x: Number.NaN, y: 0.4 })).toBeNull();
    expect(sceneScale({ x: 0.5, y: Infinity }, { x: 0.5, y: 0.4 })).toBeNull();
  });

  it('never returns a scale that is not a usable number', () => {
    const scale = sceneScale({ x: 0.2, y: 0.8 }, { x: 0.6, y: 0.3 });
    expect(Number.isFinite(scale?.metresPerUnit)).toBe(true);
  });
});

describe('venueFingerprint', () => {
  it('matches again from nearby marks at the same venue', () => {
    const a = venueFingerprint({ x: 0.5, y: 0.72 }, { x: 0.54, y: 0.44 });
    const b = venueFingerprint({ x: 0.505, y: 0.723 }, { x: 0.542, y: 0.438 });
    expect(b).toBe(a);
  });

  it('differs when the camera has clearly moved', () => {
    const a = venueFingerprint({ x: 0.5, y: 0.72 }, { x: 0.54, y: 0.44 });
    const b = venueFingerprint({ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.3 });
    expect(b).not.toBe(a);
  });
});

describe('toCalibration', () => {
  it('records both marks and the pitch length it assumed', () => {
    const calibration = toCalibration('cal_1', { x: 0.5, y: 0.72 }, { x: 0.54, y: 0.44 }, 1000);
    expect(calibration).toMatchObject({
      id: 'cal_1',
      creaseX: 0.5,
      creaseY: 0.72,
      stumpX: 0.54,
      stumpY: 0.44,
      pitchLengthM: PITCH_LENGTH_M,
      createdAt: 1000,
    });
  });
});

describe('the baseline decides the accuracy', () => {
  /**
   * Scale error is tap precision over baseline length, and it propagates
   * proportionally into speed. These are the arithmetic behind
   * docs/ball-speed-error-budget.md, pinned so the reasoning cannot drift away
   * from the code it justifies.
   */
  it('halves the uncertainty when the baseline doubles', () => {
    const short = scaleUncertainty(0.1);
    const long = scaleUncertainty(0.2);
    expect(long).toBeCloseTo(short / 2);
  });

  it('scales the same taps by whatever ruler they are told they measured', () => {
    const a = { x: 0.3, y: 0.5 };
    const b = { x: 0.5, y: 0.5 };
    const short = sceneScale(a, b, CREASE_TO_STUMPS_M);
    const long = sceneScale(a, b, RETURN_CREASE_M);

    expect(long!.metresPerUnit / short!.metresPerUnit).toBeCloseTo(
      RETURN_CREASE_M / CREASE_TO_STUMPS_M,
    );
    // Same taps, same geometry — so the same uncertainty. A longer ruler helps
    // because the marks are further apart in frame, not because of the number.
    expect(long!.uncertainty).toBeCloseTo(short!.uncertainty);
  });

  it('reports a real-frame crease-to-stumps span as coarse', () => {
    // 1.22 m in a frame covering ~11.5 m at the app's own 8-10 m standoff.
    const scale = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.506, y: 0.5 })!;
    expect(scale.uncertainty).toBeGreaterThan(MAX_SCALE_UNCERTAINTY);
    expect(isCoarse(scale)).toBe(true);
  });

  it('improves markedly on the return crease at the same standoff', () => {
    const short = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.506, y: 0.5 }, CREASE_TO_STUMPS_M)!;
    const long = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.612, y: 0.5 }, RETURN_CREASE_M)!;
    expect(long.uncertainty).toBeLessThan(short.uncertainty / 1.9);
  });

  it('carries the reference it used, so a remembered venue replays correctly', () => {
    expect(sceneScale({ x: 0.3, y: 0.5 }, { x: 0.6, y: 0.5 })!.referenceM).toBe(
      CREASE_TO_STUMPS_M,
    );
    expect(
      sceneScale({ x: 0.3, y: 0.5 }, { x: 0.6, y: 0.5 }, RETURN_CREASE_M)!.referenceM,
    ).toBe(RETURN_CREASE_M);
  });

  it('offers the longest reference first, because every metre is free accuracy', () => {
    const metres = CALIBRATION_REFERENCES.map((r) => r.metres);
    expect(metres).toEqual([...metres].sort((a, b) => b - a));
  });
});

describe('the old distance guard let a poisoned scale through', () => {
  /**
   * The guard used to be `dist < 0.01`. At 1920 px that is about nineteen
   * pixels — a 22% scale error, or 29 km/h at 130, accepted silently as a
   * calibrated venue. That is precisely the failure the NaN guard exists to
   * prevent, arriving through a different door.
   */
  it('refuses marks that would have passed the old check', () => {
    expect(sceneScale({ x: 0.5, y: 0.5 }, { x: 0.511, y: 0.5 })).toBeNull();
  });

  it('accepts a baseline long enough to mean something', () => {
    expect(sceneScale({ x: 0.3, y: 0.5 }, { x: 0.6, y: 0.5 })).not.toBeNull();
  });

  it('refuses a reference length that is not a usable number', () => {
    const a = { x: 0.3, y: 0.5 };
    const b = { x: 0.6, y: 0.5 };
    expect(sceneScale(a, b, 0)).toBeNull();
    expect(sceneScale(a, b, -1.22)).toBeNull();
    expect(sceneScale(a, b, Number.NaN)).toBeNull();
  });
});
