/**
 * The four S21 placement checks.
 *
 * Each one names a signal the app can actually read, and each failure says
 * exactly what to do about it — blame the setup, never the bowler. All four are
 * overridable, but overriding marks every delivery in the session
 * low-confidence: the bowler may proceed, they may not proceed uninformed.
 */

/** The handover's tolerance: beyond this the pitch foreshortens and speeds read low. */
export const LEVEL_TOLERANCE_DEG = 3;

export type PlacementCheckKey = 'orientation' | 'level' | 'framing' | 'light';

export interface PlacementCheck {
  key: PlacementCheckKey;
  label: string;
  /** Shown only when the check fails. */
  fix: string;
  ok: boolean;
}

export interface PlacementSignals {
  orientation: 'portrait' | 'landscape';
  tiltDeg: number;
  /** A calibration for this venue already exists. */
  calibrated: boolean;
  lightOk: boolean;
}

export function evaluatePlacement(signals: PlacementSignals): PlacementCheck[] {
  return [
    {
      key: 'orientation',
      label: 'Landscape orientation',
      fix: 'Turn the phone landscape — side-on to the pitch.',
      ok: signals.orientation === 'landscape',
    },
    {
      key: 'level',
      label: 'Device level',
      fix: 'Tilt it back to level, or speeds will read low.',
      ok: signals.tiltDeg <= LEVEL_TOLERANCE_DEG,
    },
    {
      key: 'framing',
      label: 'Crease and stumps visible',
      fix: 'Mark them once — remembered for this venue.',
      ok: signals.calibrated,
    },
    {
      key: 'light',
      label: 'Light for 240 fps',
      fix: 'Too dark for slow motion. Move to better light or the speed reading will be unreliable.',
      ok: signals.lightOk,
    },
  ];
}

export function allChecksPass(checks: PlacementCheck[]): boolean {
  return checks.every((c) => c.ok);
}

/**
 * Whether continuing from here compromises the readings.
 *
 * Framing is excluded: an uncalibrated venue is fixed by calibrating, which is
 * the primary action on this screen, not an override. The other three cannot be
 * fixed by the app.
 */
export function wouldOverride(checks: PlacementCheck[]): boolean {
  return checks.some((c) => !c.ok && c.key !== 'framing');
}
