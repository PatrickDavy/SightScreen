import { MINIMUM_AGE, ageAt, meetsMinimumAge } from './accountAge';
import { isJunior } from './juniorPolicy';

const NOW_YEAR = 2026;

describe('the minimum account age', () => {
  it('admits an adult', () => {
    expect(meetsMinimumAge(1996, NOW_YEAR)).toBe(true);
  });

  it('turns away someone under 18', () => {
    expect(meetsMinimumAge(2012, NOW_YEAR)).toBe(false);
  });

  it('admits exactly at the boundary, and turns away one year under it', () => {
    expect(meetsMinimumAge(NOW_YEAR - MINIMUM_AGE, NOW_YEAR)).toBe(true);
    expect(meetsMinimumAge(NOW_YEAR - MINIMUM_AGE + 1, NOW_YEAR)).toBe(false);
  });

  it('agrees with isJunior, so the gate and the guideline banding cannot drift', () => {
    for (let age = 8; age <= 30; age += 1) {
      const yob = NOW_YEAR - age;
      expect(meetsMinimumAge(yob, NOW_YEAR)).toBe(!isJunior(yob, NOW_YEAR));
    }
  });

  it('reports the age the bowler turns this year', () => {
    expect(ageAt(2000, NOW_YEAR)).toBe(26);
  });
});
