/** The determinant set is deliberately small — front knee at release, run-up
 *  speed, arm delay, trunk flexion (handover §6). Values/references from the
 *  prototype (ProtoReview.jsx), which supersedes the older ui_kits/app set. */

export interface Determinant {
  key: string;
  name: string;
  unit: string;
  /** Research-derived reference line, e.g. "Faster bowlers: >150°". */
  ref: string;
  range: { min: number; max: number; good: [number, number] };
  /** One-line meaning shown under the value. */
  mean: string;
  /** Higher is better within the good band? Used by insight scoring. */
  direction: 'higher' | 'lower' | 'band';
  /** Safer-and-easier-to-change order — lower = preferred tiebreak. */
  safetyEaseOrder: number;
  /** Drill prescribed for this determinant. */
  drillId: string;
  /** Estimated km/h available per unit of normalised deficit (lo..hi). */
  gainPerDeficit: [number, number];
}

export const DETERMINANTS: Record<string, Determinant> = {
  knee: {
    key: 'knee',
    name: 'Front knee at release',
    unit: '°',
    ref: 'Faster bowlers: >150°',
    range: { min: 120, max: 180, good: [150, 180] },
    mean: 'A braced, straight front leg converts run-up momentum into ball speed. Yours collapses slightly.',
    direction: 'higher',
    safetyEaseOrder: 1,
    drillId: 'brace',
    gainPerDeficit: [3, 6],
  },
  runup: {
    key: 'runup',
    name: 'Run-up speed',
    unit: 'm/s',
    ref: 'Faster bowlers: 5.5–7.0 m/s',
    range: { min: 3, max: 8, good: [5.5, 7] },
    mean: 'Momentum in is speed out — but only if the front leg can brace against it.',
    direction: 'higher',
    safetyEaseOrder: 2,
    drillId: 'rhythm',
    gainPerDeficit: [2, 5],
  },
  delay: {
    key: 'delay',
    name: 'Arm delay',
    unit: 's',
    ref: 'Faster bowlers: 0.10–0.13 s',
    range: { min: 0.05, max: 0.25, good: [0.1, 0.13] },
    mean: "The lag between front-foot contact and the arm firing. Longer isn't better past a point.",
    direction: 'band',
    safetyEaseOrder: 3,
    drillId: 'delay',
    gainPerDeficit: [1, 4],
  },
  trunk: {
    key: 'trunk',
    name: 'Trunk flexion at release',
    unit: '°',
    ref: 'Typical band: 25–45°',
    range: { min: 0, max: 60, good: [25, 45] },
    mean: 'Forward trunk drive adds speed; sideways collapse costs it and loads the back.',
    direction: 'band',
    safetyEaseOrder: 4,
    drillId: 'stack',
    gainPerDeficit: [1, 3],
  },
};

export const DETERMINANT_KEYS = Object.keys(DETERMINANTS);
