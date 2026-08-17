/**
 * The one insight — a single biggest opportunity per session, never a list.
 * Confidence-weighted: only ok-confidence deliveries feed it. When two
 * limiters are close, pick the one that is safer and easier to change first,
 * and say so (spec S33).
 */
import { DETERMINANTS, Determinant } from './content/determinants';
import { DRILLS } from './content/drills';
import { Insight } from './types';

export interface MetricMean {
  key: string;
  mean: number;
  meanBand: number;
}

interface Scored {
  det: Determinant;
  deficit: number; // normalised 0..1 distance outside the good band
  mean: number;
  meanBand: number;
}

/** Normalised distance of `value` outside the determinant's good band. */
export function deficitFor(det: Determinant, value: number): number {
  const [lo, hi] = det.range.good;
  const width = det.range.max - det.range.min;
  if (value >= lo && value <= hi) return 0;
  const dist = value < lo ? lo - value : value - hi;
  return Math.min(dist / width, 1);
}

/** Two limiters are "close" when their deficits differ by less than this. */
const CLOSE_EPSILON = 0.05;

export function selectInsight(sessionId: string, means: MetricMean[]): Insight | null {
  const scored: Scored[] = [];
  for (const m of means) {
    const det = DETERMINANTS[m.key];
    if (!det) continue;
    scored.push({ det, deficit: deficitFor(det, m.mean), mean: m.mean, meanBand: m.meanBand });
  }
  const candidates = scored.filter((s) => s.deficit > 0);
  if (!candidates.length) return null;

  candidates.sort((a, b) => b.deficit - a.deficit);
  const top = candidates[0]!;
  const close = candidates.filter((c) => top.deficit - c.deficit < CLOSE_EPSILON);
  // Safer-and-easier tiebreak among close limiters.
  close.sort((a, b) => a.det.safetyEaseOrder - b.det.safetyEaseOrder);
  const chosen = close[0]!;
  const runnerUp = candidates.find((c) => c.det.key !== chosen.det.key);

  const [gainLo, gainHi] = chosen.det.gainPerDeficit;
  const rationale = buildRationale(chosen, runnerUp, close.length > 1);

  return {
    sessionId,
    determinantKey: chosen.det.key,
    estimatedGainLo: gainLo,
    estimatedGainHi: gainHi,
    rationale,
    drillId: chosen.det.drillId,
  };
}

function buildRationale(chosen: Scored, runnerUp: Scored | undefined, wasClose: boolean): string {
  const drill = DRILLS[chosen.det.drillId];
  const drillName = drill ? drill.name.toLowerCase() : chosen.det.key;
  if (wasClose && runnerUp) {
    return (
      `Two limiters were close — ${chosen.det.name.toLowerCase()} and ` +
      `${runnerUp.det.name.toLowerCase()}. The ${shortName(chosen.det)} comes first because ` +
      `it's safer and easier to change. One thing at a time; the rest waits on Improve.`
    );
  }
  return (
    `${chosen.det.name} is your biggest opportunity this session — ` +
    `${chosen.det.ref.replace(/^Faster bowlers: /, 'faster bowlers sit at ').replace(/^Typical band: /, 'the typical band is ')}. ` +
    `The ${drillName} drill works on exactly this.`
  );
}

function shortName(det: Determinant): string {
  const first = det.name.split(' at ')[0] ?? det.name;
  return first.toLowerCase();
}

/** The cue headline for a determinant (the imperative on the CueCard). */
export function cueFor(determinantKey: string): string {
  switch (determinantKey) {
    case 'knee':
      return 'Brace your front knee';
    case 'runup':
      return 'Hit the crease accelerating';
    case 'delay':
      return 'Let the arm come late';
    case 'trunk':
      return 'Drive forward, not sideways';
    default:
      return 'Work the drill';
  }
}

/** "+3–6 km/h estimated" — the gain is a range, never a point value. */
export function gainLabel(i: Insight): string {
  return `+${i.estimatedGainLo}–${i.estimatedGainHi} km/h estimated`;
}
