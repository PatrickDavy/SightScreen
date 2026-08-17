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

export const PRICE = {
  annual: '£34.99 a year',
  annualSub: '£2.92 a month, billed once',
  monthly: '£5.99 a month',
} as const;
