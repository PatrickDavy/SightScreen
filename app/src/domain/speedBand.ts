/**
 * The error band on a ball speed.
 *
 * Every speed the product shows carries one, and the handover is explicit that
 * it is model output rather than decoration: "computed from frame count,
 * calibration quality, light and pose confidence". This is where that
 * computation lives.
 *
 * The important idea is that the error has two parts that behave differently,
 * and collapsing them into one number throws away the difference:
 *
 *   CORRELATED — shared by every delivery in a session. Calibration scale is
 *   the big one: the same two taps scale every ball in the spell, so if the
 *   scale is 2% out, every speed is 2% out in the same direction. Averaging
 *   more deliveries does not reduce it at all.
 *
 *   INDEPENDENT — fresh for each delivery. Ball localisation and frame timing.
 *   Averaging n deliveries reduces it by √n.
 *
 * Both are fractional, because both scale with the speed: a 2% scale error is
 * 2.2 km/h at 110 and 3.0 km/h at 150. Bands are therefore computed from the
 * speed, never fixed.
 *
 * This distinction is what decides whether the improve loop can work at all.
 * `retest.ts` calls a change real when it exceeds the combined band of two
 * sessions; if the whole error were correlated, no amount of bowling would ever
 * narrow it, and the retest could never verify anything. See
 * docs/ball-speed-error-budget.md.
 */

export interface SpeedError {
  /** Fractional, shared across a session — calibration scale. Does not average out. */
  correlated: number;
  /** Fractional, per delivery — tracking and timing. Averages out as √n. */
  independent: number;
}

/**
 * Per-delivery tracking and timing uncertainty, as a fraction of speed.
 *
 * ASSUMPTION, NOT A MEASUREMENT. 1% is roughly ±2 px of ball localisation over
 * a 13-frame baseline at the app's stated 8-10 m standoff. It is a placeholder
 * until #78 measures the real figure against radar, and it is flagged here
 * rather than buried because every band in the product scales with it.
 */
export const ASSUMED_TRACKING_UNCERTAINTY = 0.01;

/**
 * Fallback fractional error for a session with no calibration.
 *
 * An uncalibrated session cannot produce a trustworthy speed at all — S22
 * blocks Continue precisely so this does not happen. The value is deliberately
 * wide rather than plausible: if one ever reaches a screen, it should look as
 * uncertain as it is.
 */
export const UNCALIBRATED_UNCERTAINTY = 0.15;

export function errorFor(scaleUncertainty: number | null): SpeedError {
  return {
    correlated: scaleUncertainty ?? UNCALIBRATED_UNCERTAINTY,
    independent: ASSUMED_TRACKING_UNCERTAINTY,
  };
}

/** Combine independent fractional terms in quadrature. */
function quadrature(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

/** Band on one delivery, in the same units as `speedKmh`. */
export function deliveryBandKmh(speedKmh: number, error: SpeedError): number {
  return Math.abs(speedKmh) * quadrature(error.correlated, error.independent);
}

/**
 * Band on the mean of `n` deliveries.
 *
 * The independent part shrinks as √n; the correlated part does not shrink at
 * all, and becomes the floor. Bowling more balls buys accuracy right up to the
 * point where calibration dominates, and then buys nothing — which is why the
 * calibration baseline matters more than the number of deliveries.
 */
export function meanBandKmh(speedKmh: number, error: SpeedError, n: number): number {
  if (n < 1) return deliveryBandKmh(speedKmh, error);
  return Math.abs(speedKmh) * quadrature(error.correlated, error.independent / Math.sqrt(n));
}

/**
 * The floor a band cannot go below however many deliveries are bowled.
 *
 * Useful for answering "would more balls help?" honestly, and for deciding
 * whether a retest is worth offering at all at a given calibration quality.
 */
export function bandFloorKmh(speedKmh: number, error: SpeedError): number {
  return Math.abs(speedKmh) * error.correlated;
}
