/** Workload ledger arithmetic. The ledger is free forever — nothing in this
 *  module may ever be gated by entitlement. */
import { isoDate } from './clock';
import { Guideline } from './guidelines';
import { SessionType, WorkloadEntry } from './types';

/** Session-type weighting — match balls cost more, drill checks less.
 *  ILLUSTRATIVE constants; calibrate with sports-science input before launch. */
export const WEIGHTING: Record<SessionType, number> = {
  net: 1.0,
  match: 1.25,
  drill: 0.5,
};

export const BALLS_PER_OVER = 6;

export function ballsToOvers(balls: number): number {
  return Math.round((balls / BALLS_PER_OVER) * 10) / 10;
}

/** Weighted deliveries for an entry. */
export function weightedDeliveries(e: WorkloadEntry): number {
  return e.deliveries * e.weighting;
}

/** Rolling 7-day weighted overs ending at `now` (inclusive). The research ties
 *  injury risk to the 7-day peak more than any single day. */
export function rolling7DayOvers(entries: WorkloadEntry[], now: number): number {
  const from = isoDate(now - 6 * 86400_000);
  const to = isoDate(now);
  const balls = entries
    .filter((e) => e.date >= from && e.date <= to)
    .reduce((s, e) => s + weightedDeliveries(e), 0);
  return ballsToOvers(balls);
}

/** Weighted balls per day for the current week (Mon..Sun containing `now`). */
export function weekByDay(entries: WorkloadEntry[], now: number): { date: string; balls: number }[] {
  const d = new Date(now);
  const dow = (d.getDay() + 6) % 7; // 0 = Monday
  const monday = now - dow * 86400_000;
  return Array.from({ length: 7 }, (_, i) => {
    const date = isoDate(monday + i * 86400_000);
    const balls = entries
      .filter((e) => e.date === date)
      .reduce((s, e) => s + weightedDeliveries(e), 0);
    return { date, balls: Math.round(balls) };
  });
}

export type LoadStatus = 'good' | 'watch' | 'over';

/** Plain status against the rolling 7-day guideline. */
export function loadStatus(rollingOvers: number, guideline: Guideline): LoadStatus {
  const ratio = guideline.maxOversWeek > 0 ? rollingOvers / guideline.maxOversWeek : 0;
  return ratio >= 1 ? 'over' : ratio >= 0.8 ? 'watch' : 'good';
}

/** The S50 status words: Good to bowl / Bowl light / Rest today. */
export const STATUS_WORD: Record<LoadStatus, string> = {
  good: 'Good to bowl',
  watch: 'Bowl light',
  over: 'Rest today',
};

/** Consecutive bowling days ending today (for rest guidance copy). */
export function consecutiveDays(entries: WorkloadEntry[], now: number): number {
  let n = 0;
  for (let i = 0; ; i++) {
    const date = isoDate(now - i * 86400_000);
    const bowled = entries.some((e) => e.date === date && e.deliveries > 0);
    if (!bowled) break;
    n++;
  }
  return n;
}

/** Season ramp flag: current month's weighted overs vs the mean of the prior
 *  three non-zero months — sudden increases after a break are a documented
 *  risk factor. */
export function rampFlagged(monthlyOvers: number[]): boolean {
  if (monthlyOvers.length < 2) return false;
  const current = monthlyOvers[monthlyOvers.length - 1]!;
  const prior = monthlyOvers.slice(0, -1).filter((v) => v > 0).slice(-3);
  if (!prior.length) return current > 0;
  const mean = prior.reduce((s, v) => s + v, 0) / prior.length;
  return current > mean * 1.5;
}
