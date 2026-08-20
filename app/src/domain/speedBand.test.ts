/**
 * The band is the product's honesty made arithmetic, so the tests are about
 * what it would take to mislead someone: a band that ignores calibration, one
 * that shrinks when it should not, or one that stays fixed as speed rises.
 */
import {
  CREASE_TO_STUMPS_M,
  RETURN_CREASE_M,
  TAP_PRECISION_UNITS,
  sceneScale,
} from './calibration';
import {
  ASSUMED_TRACKING_UNCERTAINTY,
  SpeedError,
  UNCALIBRATED_UNCERTAINTY,
  bandFloorKmh,
  deliveryBandKmh,
  errorFor,
  meanBandKmh,
} from './speedBand';

const error = (correlated: number, independent = 0.01): SpeedError => ({
  correlated,
  independent,
});

describe('a band scales with the speed it describes', () => {
  it('widens as the speed rises, because the error is proportional', () => {
    const e = error(0.02);
    expect(deliveryBandKmh(150, e)).toBeGreaterThan(deliveryBandKmh(110, e));
    expect(deliveryBandKmh(150, e) / deliveryBandKmh(110, e)).toBeCloseTo(150 / 110);
  });

  it('combines the two components in quadrature, not by adding them', () => {
    // Adding would overstate the band by 40% when the parts are equal.
    const e = error(0.02, 0.02);
    expect(deliveryBandKmh(100, e)).toBeCloseTo(100 * Math.sqrt(0.02 ** 2 + 0.02 ** 2));
    expect(deliveryBandKmh(100, e)).toBeLessThan(100 * 0.04);
  });
});

describe('averaging helps against tracking, and not at all against calibration', () => {
  it('shrinks the independent part as the square root of the count', () => {
    const e = error(0, 0.02);
    expect(meanBandKmh(130, e, 4)).toBeCloseTo(deliveryBandKmh(130, e) / 2);
    expect(meanBandKmh(130, e, 9)).toBeCloseTo(deliveryBandKmh(130, e) / 3);
  });

  it('never shrinks the correlated part, however many balls are bowled', () => {
    const e = error(0.02, 0.02);
    // The same two taps scaled every ball in the spell.
    expect(meanBandKmh(130, e, 1000)).toBeCloseTo(bandFloorKmh(130, e));
    expect(meanBandKmh(130, e, 1000)).toBeGreaterThan(130 * 0.019);
  });

  it('approaches a floor rather than zero, so more balls stop helping', () => {
    const e = error(0.02);
    const floor = bandFloorKmh(130, e);
    expect(meanBandKmh(130, e, 5)).toBeGreaterThan(floor);
    expect(meanBandKmh(130, e, 100)).toBeCloseTo(floor, 1);
  });

  it('treats a single delivery as no averaging at all', () => {
    const e = error(0.02);
    expect(meanBandKmh(130, e, 1)).toBeCloseTo(deliveryBandKmh(130, e));
    expect(meanBandKmh(130, e, 0)).toBeCloseTo(deliveryBandKmh(130, e));
  });
});

describe('calibration feeds the band', () => {
  it('carries the scale uncertainty through as the correlated term', () => {
    const scale = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.506, y: 0.5 }, CREASE_TO_STUMPS_M)!;
    expect(errorFor(scale.uncertainty).correlated).toBe(scale.uncertainty);
    expect(errorFor(scale.uncertainty).independent).toBe(ASSUMED_TRACKING_UNCERTAINTY);
  });

  it('gives a narrower band on the longer reference, at the same standoff', () => {
    const short = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.506, y: 0.5 }, CREASE_TO_STUMPS_M)!;
    const long = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.612, y: 0.5 }, RETURN_CREASE_M)!;

    const shortBand = deliveryBandKmh(130, errorFor(short.uncertainty));
    const longBand = deliveryBandKmh(130, errorFor(long.uncertainty));

    expect(longBand).toBeLessThan(shortBand);
    // The whole point of the calibration fix, in km/h at a club quick's pace.
    expect(shortBand - longBand).toBeGreaterThan(2);
  });

  it('is wide and obvious when there is no calibration at all', () => {
    expect(errorFor(null).correlated).toBe(UNCALIBRATED_UNCERTAINTY);
    expect(deliveryBandKmh(130, errorFor(null))).toBeGreaterThan(19);
  });
});

describe('what this means for the retest', () => {
  /**
   * retest.ts calls a change real when the delta exceeds sqrt(b1^2 + b2^2), and
   * determinants.ts claims the front-knee drill is worth 3-6 km/h. These pin
   * the consequence of the band to that claim, so a regression in either shows
   * up as a failing test rather than as a feature quietly ceasing to work.
   */
  const combined = (b: number) => Math.sqrt(2) * b;

  it('cannot verify the bottom of the claimed gain on single best balls', () => {
    // Crease-to-stumps calibration, one delivery each side — the current wiring.
    const scale = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.506, y: 0.5 })!;
    const band = deliveryBandKmh(130, errorFor(scale.uncertainty));
    expect(combined(band)).toBeGreaterThan(3);
  });

  it('cannot verify it by bowling more balls either — calibration is the floor', () => {
    // The longer reference, and a hundred deliveries averaged. Still short,
    // because the correlated term does not shrink and 100 balls buys nothing
    // the first dozen did not. More bowling is not the lever here.
    const scale = sceneScale({ x: 0.4, y: 0.5 }, { x: 0.612, y: 0.5 }, RETURN_CREASE_M)!;
    const e = errorFor(scale.uncertainty);
    expect(combined(meanBandKmh(130, e, 100))).toBeGreaterThan(3);
    expect(combined(bandFloorKmh(130, e))).toBeGreaterThan(3);
  });

  it('names what would actually close the gap: tap precision', () => {
    // Working backwards from the requirement rather than hoping. To verify a
    // 3 km/h change, the combined band must be under 3, so each session band
    // must be under 3/√2, so the correlated term must be under that over the
    // speed. Everything else follows from the calibration geometry.
    const requiredFraction = 3 / Math.SQRT2 / 130;
    expect(requiredFraction).toBeLessThan(0.017);

    // On the 2.44 m return crease at the app's standoff the marks sit about
    // 0.212 of the frame apart, so this is the tap precision it demands.
    const baselineUnits = 0.212;
    const requiredTapUnits = (requiredFraction * baselineUnits) / Math.SQRT2;
    // Under five pixels at 1920 — tighter than the 6 px currently assumed, and
    // the reason S22 needs a magnifier or automatic crease detection.
    expect(requiredTapUnits * 1920).toBeLessThan(5);
    expect(requiredTapUnits).toBeLessThan(TAP_PRECISION_UNITS);
  });
});
