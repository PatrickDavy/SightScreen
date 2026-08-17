import {
  CREASE_TO_STUMPS_M,
  PITCH_LENGTH_M,
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
