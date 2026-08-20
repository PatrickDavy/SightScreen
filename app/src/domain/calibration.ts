/**
 * Two-tap calibration — two marks of known separation, resolved against pitch
 * geometry to produce the scale used for run-up and ball speed. Persisted per
 * venue keyed on a camera-pose fingerprint. Fallback: manual pitch-length entry.
 *
 * THE BASELINE IS THE WHOLE BALL GAME. Scale error propagates straight into
 * speed, proportionally: a 1% scale error is a 1% speed error, which is 1.3 km/h
 * at 130. And scale error is `tapPrecision / baselineLength` — so the length of
 * the thing you measure against decides the accuracy of every speed the app
 * ever reports.
 *
 * The original implementation hardcoded the crease-to-stumps span, 1.22 m. At
 * the setup the app asks for — 8-10 m side-on, roughly 6 mm per pixel — a
 * realistic six-pixel tap error on that baseline is 4.2% scale error, or
 * 5.4 km/h. That is more than the entire error budget on its own, before the
 * ball tracker contributes anything. See docs/ball-speed-error-budget.md.
 *
 * So the reference is now chosen rather than assumed, and the scale carries its
 * own uncertainty so the speed band can be honest about it.
 *
 * A note on which references are available. Side-on, only marks separated
 * *along* the pitch are in-plane; anything running across the pitch is
 * foreshortened and useless as a ruler. That rules out the popping crease line
 * itself and the pitch width, and it leaves a short list.
 */
import { Calibration } from './types';

/** 22 yards in metres — stump to stump. Too long to fit an 8-10 m side-on frame. */
export const PITCH_LENGTH_M = 20.12;
/** Popping crease is 1.22 m in front of the stumps. */
export const CREASE_TO_STUMPS_M = 1.22;
/** Return crease is marked at least 2.44 m back from the popping crease. */
export const RETURN_CREASE_M = 2.44;

/**
 * The marks a bowler can be asked to tap, longest first.
 *
 * Longest first is the ordering the UI should offer, because every extra metre
 * of baseline is free accuracy. The short one stays because it is the one
 * always visible: a net with no return crease painted still has a popping
 * crease and a set of stumps.
 */
export const CALIBRATION_REFERENCES = [
  {
    key: 'returnCrease',
    metres: RETURN_CREASE_M,
    prompt: 'Tap each end of the return crease',
  },
  {
    key: 'creaseToStumps',
    metres: CREASE_TO_STUMPS_M,
    prompt: 'Tap the popping crease, then the base of the stumps',
  },
] as const;

export type CalibrationReferenceKey = (typeof CALIBRATION_REFERENCES)[number]['key'];

/**
 * Assumed 1-sigma tap precision, as a fraction of frame width.
 *
 * 0.003 is roughly six pixels at 1920 — a hurried tap in bright sun. It is an
 * assumption, not a measurement, and it is the single number most worth
 * replacing with a real one from the #78 benchmark. Everything downstream of it
 * is arithmetic.
 */
export const TAP_PRECISION_UNITS = 0.003;

/**
 * Fractional scale uncertainty above which a session is flagged.
 *
 * 1.5% is 2 km/h at 130 km/h, which is the session band the retest needs to
 * verify the bottom of the drill gain the product claims. Above this the speeds
 * are still worth showing — they are just not precise enough to call a change
 * real, and the session says so rather than implying otherwise.
 */
export const MAX_SCALE_UNCERTAINTY = 0.015;

export interface Tap {
  /** Normalised 0..1 position in the preview frame. */
  x: number;
  y: number;
}

export interface SceneScale {
  /** Metres per normalised frame unit. */
  metresPerUnit: number;
  /** The real-world length the two marks were taken to be, in metres. */
  referenceM: number;
  /**
   * Fractional 1-sigma uncertainty in the scale, from tap precision over the
   * observed baseline. Propagates proportionally into every speed derived from
   * this scale, so it belongs in the band rather than being quietly dropped.
   */
  uncertainty: number;
}

/** Scale uncertainty for two taps `distUnits` apart: precision over baseline. */
export function scaleUncertainty(distUnits: number): number {
  return (TAP_PRECISION_UNITS * Math.SQRT2) / distUnits;
}

/** Too imprecise to call a change real — the session is flagged, not blocked. */
export function isCoarse(scale: SceneScale): boolean {
  return scale.uncertainty > MAX_SCALE_UNCERTAINTY;
}

/**
 * Derive the scene scale from the two taps. Degenerate taps (the same point)
 * return null — block continue and ask again.
 *
 * Non-finite coordinates return null too. A NaN would otherwise pass the
 * distance check (`NaN < 0.01` is false) and yield a NaN scale, which is worse
 * than no scale: it looks like a calibrated venue and silently poisons every
 * speed derived from it.
 */
/**
 * Smallest baseline that can still produce a scale at all.
 *
 * The old guard was `dist < 0.01`, which at 1920 px is about nineteen pixels —
 * a 22% scale error, or 29 km/h at 130, silently accepted as a calibrated
 * venue. That is the failure the NaN guard below exists to prevent, arriving
 * through a different door. The floor is now derived: refuse anything worse
 * than a 10% scale error, and flag everything between 1.5% and 10%.
 */
const MAX_USABLE_UNCERTAINTY = 0.1;

export function sceneScale(
  first: Tap,
  second: Tap,
  referenceM: number = CREASE_TO_STUMPS_M,
): SceneScale | null {
  if (
    !Number.isFinite(first.x) ||
    !Number.isFinite(first.y) ||
    !Number.isFinite(second.x) ||
    !Number.isFinite(second.y) ||
    !Number.isFinite(referenceM) ||
    referenceM <= 0
  ) {
    return null;
  }
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= 0) return null;

  const uncertainty = scaleUncertainty(dist);
  if (uncertainty > MAX_USABLE_UNCERTAINTY) return null;

  return { metresPerUnit: referenceM / dist, referenceM, uncertainty };
}

/**
 * A coarse camera-pose fingerprint for remembering a venue: quantised tap
 * geometry. A returning bowler at their home nets skips calibration when the
 * stored fingerprint matches the current camera pose.
 */
export function venueFingerprint(crease: Tap, stumps: Tap): string {
  const q = (v: number) => Math.round(v * 20); // 5% buckets
  return `v1:${q(crease.x)},${q(crease.y)}:${q(stumps.x)},${q(stumps.y)}`;
}

export function toCalibration(
  id: string,
  crease: Tap,
  stumps: Tap,
  createdAt: number,
  pitchLengthM: number = PITCH_LENGTH_M,
  referenceM: number = CREASE_TO_STUMPS_M,
): Calibration {
  return {
    id,
    venueFingerprint: venueFingerprint(crease, stumps),
    creaseX: crease.x,
    creaseY: crease.y,
    stumpX: stumps.x,
    stumpY: stumps.y,
    pitchLengthM,
    referenceM,
    createdAt,
  };
}
