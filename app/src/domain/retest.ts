/** Retest verification — the change is real only when it is bigger than its
 *  error band; otherwise "treat it as level". */
import { round1 } from './units';

export interface RetestResult {
  speedDelta: number;
  /** Combined uncertainty of the two compared measurements. */
  speedBand: number;
  metricDelta: number | null;
  verified: boolean;
}

/** Combine two independent bands (root sum of squares). */
export function combineBands(a: number, b: number): number {
  return round1(Math.sqrt(a * a + b * b));
}

export function compareRetest(
  before: { speedKmh: number; bandKmh: number; metricValue?: number },
  after: { speedKmh: number; bandKmh: number; metricValue?: number },
): RetestResult {
  const speedDelta = round1(after.speedKmh - before.speedKmh);
  const speedBand = combineBands(before.bandKmh, after.bandKmh);
  const metricDelta =
    before.metricValue != null && after.metricValue != null
      ? round1(after.metricValue - before.metricValue)
      : null;
  return {
    speedDelta,
    speedBand,
    metricDelta,
    verified: Math.abs(speedDelta) > speedBand,
  };
}

/** "within the ± band, so treat it as level" vs "bigger than its error band —
 *  this one's real". */
export function deltaSentence(delta: number, band: number, unit: string): string {
  const sign = delta >= 0 ? '+' : '';
  if (Math.abs(delta) > band) {
    return `${sign}${delta} ${unit} vs last session — bigger than the ±${band} band, so the change is real.`;
  }
  return `${sign}${delta} ${unit} vs last session — within the ±${band} band, so treat it as level.`;
}
