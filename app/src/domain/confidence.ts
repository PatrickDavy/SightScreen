/** Confidence rules — written once at inference, immutable, consequential:
 *  low-confidence deliveries stay visible in lists, are excluded from trends,
 *  and never feed an insight. */
import { Confidence } from './types';

/** Plausible release-speed window for any human bowler; estimates outside it
 *  are flagged low-confidence, dropped from trends and shown with raw video —
 *  never hidden. */
export const PLAUSIBLE_KMH: [number, number] = [40, 170];

export function plausibilityCheck(speedKmh: number): Confidence {
  return speedKmh >= PLAUSIBLE_KMH[0] && speedKmh <= PLAUSIBLE_KMH[1] ? 'ok' : 'low';
}

/** Final confidence for a delivery: engine confidence, plausibility and the
 *  session-wide placement-check override all reduce to 'low'. */
export function finalConfidence(
  engineConfidence: Confidence,
  speedKmh: number,
  sessionLowConfOverride: boolean,
): Confidence {
  if (sessionLowConfOverride) return 'low';
  if (plausibilityCheck(speedKmh) === 'low') return 'low';
  return engineConfidence;
}
