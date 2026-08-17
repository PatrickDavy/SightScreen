/**
 * Two-tap calibration — popping crease line, then base of the stumps —
 * resolved against known pitch geometry (22 yd pitch, 1.22 m crease) to
 * produce the scale used for run-up and ball speed. Persisted per venue keyed
 * on a camera-pose fingerprint. Fallback: manual pitch-length entry.
 */
import { Calibration } from './types';

/** 22 yards in metres. */
export const PITCH_LENGTH_M = 20.12;
/** Popping crease is 1.22 m in front of the stumps. */
export const CREASE_TO_STUMPS_M = 1.22;

export interface Tap {
  /** Normalised 0..1 position in the preview frame. */
  x: number;
  y: number;
}

export interface SceneScale {
  /** Metres per normalised frame unit, derived from the crease→stumps span. */
  metresPerUnit: number;
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
export function sceneScale(crease: Tap, stumps: Tap): SceneScale | null {
  if (
    !Number.isFinite(crease.x) ||
    !Number.isFinite(crease.y) ||
    !Number.isFinite(stumps.x) ||
    !Number.isFinite(stumps.y)
  ) {
    return null;
  }
  const dx = stumps.x - crease.x;
  const dy = stumps.y - crease.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.01) return null;
  return { metresPerUnit: CREASE_TO_STUMPS_M / dist };
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
): Calibration {
  return {
    id,
    venueFingerprint: venueFingerprint(crease, stumps),
    creaseX: crease.x,
    creaseY: crease.y,
    stumpX: stumps.x,
    stumpY: stumps.y,
    pitchLengthM,
    createdAt,
  };
}
