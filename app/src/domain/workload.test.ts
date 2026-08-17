import { WorkloadEntry } from './types';
import {
  consecutiveDays,
  loadStatus,
  rampFlagged,
  rolling7DayOvers,
  STATUS_WORD,
  weekByDay,
  WEIGHTING,
} from './workload';
import { guidelineFor } from './guidelines';

const NOW = new Date(2026, 7, 17, 12).getTime(); // Mon 17 Aug 2026 local

const e = (date: string, deliveries: number, weighting = 1): WorkloadEntry => ({
  id: date + deliveries,
  bowlerId: 'b1',
  date,
  deliveries,
  source: 'captured',
  weighting,
  sessionId: null,
});

describe('workload', () => {
  it('weights match balls heavier and drill checks lighter than net', () => {
    expect(WEIGHTING.match).toBeGreaterThan(WEIGHTING.net);
    expect(WEIGHTING.drill).toBeLessThan(WEIGHTING.net);
  });

  it('sums the rolling 7 days inclusive of today, weighted', () => {
    const entries = [
      e('2026-08-11', 24), // day -6: in
      e('2026-08-10', 60), // day -7: out
      e('2026-08-17', 12, 1.25), // today, match-weighted → 15 balls
    ];
    // 24 + 15 = 39 balls = 6.5 overs
    expect(rolling7DayOvers(entries, NOW)).toBe(6.5);
  });

  it('buckets the current Monday-to-Sunday week by day', () => {
    const entries = [e('2026-08-17', 18), e('2026-08-23', 30), e('2026-08-16', 99)];
    const week = weekByDay(entries, NOW);
    expect(week).toHaveLength(7);
    expect(week[0]).toEqual({ date: '2026-08-17', balls: 18 });
    expect(week[6]).toEqual({ date: '2026-08-23', balls: 30 });
  });

  it('derives the plain status words against the guideline', () => {
    const g = guidelineFor(2010, 2026); // age 16 — U17, 21 overs/week
    expect(STATUS_WORD[loadStatus(10, g)]).toBe('Good to bowl');
    expect(STATUS_WORD[loadStatus(17, g)]).toBe('Bowl light');
    expect(STATUS_WORD[loadStatus(21, g)]).toBe('Rest today');
  });

  it('counts consecutive bowling days ending today', () => {
    const entries = [e('2026-08-17', 6), e('2026-08-16', 6), e('2026-08-15', 6), e('2026-08-13', 6)];
    expect(consecutiveDays(entries, NOW)).toBe(3);
  });

  it('flags a sudden ramp after a break', () => {
    expect(rampFlagged([8, 10, 9, 0, 0, 26])).toBe(true);
    expect(rampFlagged([8, 10, 9, 10, 11, 12])).toBe(false);
  });
});

describe('guidelines', () => {
  it('assigns bands by age and always carries the illustrative flag', () => {
    expect(guidelineFor(2010, 2026).label).toBe('U17');
    expect(guidelineFor(2008, 2026).label).toBe('U19');
    expect(guidelineFor(2000, 2026).label).toBe('Senior');
    expect(guidelineFor(2010, 2026).illustrative).toBe(true);
  });
});
