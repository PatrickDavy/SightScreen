/**
 * Free tier: three analysed sessions a month, the full speed log, the complete
 * workload ledger. The ledger is never gated, on any tier, at any time.
 * The wall sits at the fourth analysed session of a calendar month, never
 * earlier, never inside first run.
 */
export type Entitlement = 'free' | 'pro';
export type PaywallTrigger = 'fourth_session' | 'locked_metric' | 'retest_export';

export const FREE_SESSIONS_PER_MONTH = 3;

export interface EntitlementState {
  entitlement: Entitlement;
  monthKey: string;
  analysedCount: number;
}

/** Roll the counter over when the calendar month changes. */
export function rolledOver(state: EntitlementState, currentMonthKey: string): EntitlementState {
  if (state.monthKey === currentMonthKey) return state;
  return { ...state, monthKey: currentMonthKey, analysedCount: 0 };
}

/** Record one completed analysis; returns the new state. */
export function recordAnalysis(state: EntitlementState, currentMonthKey: string): EntitlementState {
  const s = rolledOver(state, currentMonthKey);
  return { ...s, analysedCount: s.analysedCount + 1 };
}

/** Should the paywall show for this trigger? Workload paths never call this. */
export function shouldGate(state: EntitlementState, trigger: PaywallTrigger): boolean {
  if (state.entitlement === 'pro') return false;
  switch (trigger) {
    case 'fourth_session':
      return state.analysedCount > FREE_SESSIONS_PER_MONTH;
    case 'locked_metric':
    case 'retest_export':
      return state.analysedCount >= FREE_SESSIONS_PER_MONTH;
  }
}

/**
 * Prices as Play reports them, already formatted and localised.
 *
 * These used to be hardcoded pounds sterling. That was wrong twice over: the
 * launch territories are New Zealand and Australia, and a displayed price that
 * does not match what Play actually charges is a policy problem regardless of
 * currency. Prices belong to the store, not to this file.
 *
 * `null` is a legitimate state — offline, or before a billing library exists —
 * and the paywall must then show no price at all rather than a plausible one.
 * The product's rule about never printing a number it is not sure of applies to
 * money as much as to speed.
 */
export interface Prices {
  /** Formatted annual price as Play reports it, e.g. "NZ$59.99". */
  annual: string;
  /** Formatted monthly price as Play reports it. */
  monthly: string;
  /** Annual price in minor units, for the per-month equivalent. */
  annualMinorUnits: number;
  /** ISO 4217, e.g. "NZD". */
  currencyCode: string;
}

/**
 * The monthly equivalent of the annual plan, for the "billed once" line.
 *
 * Annual retention runs roughly 2.5x monthly, so the handover's instruction is
 * to push annual by making it obviously better value — never by manufacturing
 * urgency. There is no countdown timer anywhere in this flow by design.
 */
export function annualPerMonth(prices: Prices): string {
  const perMonth = prices.annualMinorUnits / 12 / 100;
  return `${prices.currencyCode} ${perMonth.toFixed(2)} a month, billed once a year`;
}

/** Savings against twelve monthly payments, or null when it cannot be computed. */
export function annualSaving(prices: Prices, monthlyMinorUnits: number | null): number | null {
  if (monthlyMinorUnits == null || monthlyMinorUnits <= 0) return null;
  const twelveMonths = monthlyMinorUnits * 12;
  if (twelveMonths <= prices.annualMinorUnits) return null;
  return Math.round(((twelveMonths - prices.annualMinorUnits) / twelveMonths) * 100);
}
