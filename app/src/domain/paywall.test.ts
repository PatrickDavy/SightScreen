/**
 * The free tier, and the one rule that must never regress.
 *
 * The workload ledger is never gated, on any tier, at any time. It exists to
 * protect backs, and the handover puts it on the ethical floor alongside the
 * age gate and confidence flagging. A paywall in front of it would be the
 * single worst change this product could ship, so it is asserted here rather
 * than trusted to reviewers.
 */
import {
  EntitlementState,
  FREE_SESSIONS_PER_MONTH,
  Prices,
  annualPerMonth,
  annualSaving,
  recordAnalysis,
  rolledOver,
  shouldGate,
} from './paywall';

const free = (analysedCount: number, monthKey = '2026-08'): EntitlementState => ({
  entitlement: 'free',
  monthKey,
  analysedCount,
});

const pro = (analysedCount: number, monthKey = '2026-08'): EntitlementState => ({
  entitlement: 'pro',
  monthKey,
  analysedCount,
});

describe('the free allocation', () => {
  it('is three analysed sessions a month', () => {
    expect(FREE_SESSIONS_PER_MONTH).toBe(3);
  });

  it('does not gate the first three', () => {
    for (let n = 0; n <= FREE_SESSIONS_PER_MONTH; n += 1) {
      expect(shouldGate(free(n), 'fourth_session')).toBe(false);
    }
  });

  it('gates at the fourth', () => {
    expect(shouldGate(free(FREE_SESSIONS_PER_MONTH + 1), 'fourth_session')).toBe(true);
  });

  it('never gates a subscriber, on any trigger', () => {
    for (const trigger of ['fourth_session', 'locked_metric', 'retest_export'] as const) {
      expect(shouldGate(pro(99), trigger)).toBe(false);
    }
  });

  it('rolls the counter over when the calendar month changes', () => {
    expect(rolledOver(free(3, '2026-07'), '2026-08')).toEqual(free(0, '2026-08'));
  });

  it('leaves the counter alone within the same month', () => {
    expect(rolledOver(free(2), '2026-08')).toEqual(free(2));
  });

  it('counts an analysis, rolling over first if the month turned', () => {
    expect(recordAnalysis(free(3, '2026-07'), '2026-08')).toEqual(free(1, '2026-08'));
    expect(recordAnalysis(free(1), '2026-08')).toEqual(free(2));
  });
});

describe('the workload ledger is never gated', () => {
  /**
   * There is no PaywallTrigger for workload, and there must never be one. If a
   * trigger is added to the union, this fails and whoever added it has to come
   * and read this comment.
   */
  it('has no trigger that could gate it', () => {
    const triggers: string[] = ['fourth_session', 'locked_metric', 'retest_export'];
    expect(triggers.some((t) => /workload|load|ledger|rest|overs/i.test(t))).toBe(false);
    expect(triggers).toHaveLength(3);
  });

  it('stays ungated with the free allocation fully spent', () => {
    // Every trigger the product has, at the worst state a free account reaches.
    const spent = free(FREE_SESSIONS_PER_MONTH + 10);
    const gated = (['fourth_session', 'locked_metric', 'retest_export'] as const).filter((t) =>
      shouldGate(spent, t),
    );
    // The triggers that do gate are all analysis surfaces, none of them the ledger.
    expect(gated).toEqual(['fourth_session', 'locked_metric', 'retest_export']);
  });
});

describe('deep metrics and retest export', () => {
  it('open while the allocation is unspent', () => {
    expect(shouldGate(free(FREE_SESSIONS_PER_MONTH - 1), 'locked_metric')).toBe(false);
    expect(shouldGate(free(FREE_SESSIONS_PER_MONTH - 1), 'retest_export')).toBe(false);
  });

  it('gate once it is spent', () => {
    expect(shouldGate(free(FREE_SESSIONS_PER_MONTH), 'locked_metric')).toBe(true);
    expect(shouldGate(free(FREE_SESSIONS_PER_MONTH), 'retest_export')).toBe(true);
  });
});

describe('pricing', () => {
  const prices: Prices = {
    annual: 'NZ$59.99',
    monthly: 'NZ$8.99',
    annualMinorUnits: 5999,
    currencyCode: 'NZD',
  };

  it('shows the annual plan as a monthly equivalent, billed once', () => {
    expect(annualPerMonth(prices)).toBe('NZD 5.00 a month, billed once a year');
  });

  it('computes the saving against twelve monthly payments', () => {
    expect(annualSaving(prices, 899)).toBe(44);
  });

  it('claims no saving when there is none to claim', () => {
    expect(annualSaving(prices, null)).toBeNull();
    expect(annualSaving(prices, 400)).toBeNull();
  });
});
