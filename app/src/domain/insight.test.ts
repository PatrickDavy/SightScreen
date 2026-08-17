import { deficitFor, selectInsight } from './insight';
import { DETERMINANTS } from './content/determinants';

describe('insight selection', () => {
  it('returns null when every determinant is inside its good band', () => {
    const i = selectInsight('s1', [
      { key: 'knee', mean: 160, meanBand: 5 },
      { key: 'runup', mean: 6, meanBand: 0.3 },
      { key: 'delay', mean: 0.12, meanBand: 0.02 },
      { key: 'trunk', mean: 35, meanBand: 6 },
    ]);
    expect(i).toBeNull();
  });

  it('picks the biggest normalised deficit', () => {
    const i = selectInsight('s1', [
      { key: 'knee', mean: 149, meanBand: 5 }, // tiny deficit
      { key: 'runup', mean: 3.5, meanBand: 0.3 }, // large deficit
    ]);
    expect(i?.determinantKey).toBe('runup');
    expect(i?.drillId).toBe('rhythm');
  });

  it('breaks close ties by the safer-easier order and says so', () => {
    // knee deficit: (150-148)/60 = 0.0333; runup deficit: (5.5-5.3)/5 = 0.04 — close.
    const i = selectInsight('s1', [
      { key: 'knee', mean: 148, meanBand: 5 },
      { key: 'runup', mean: 5.3, meanBand: 0.3 },
    ]);
    expect(i?.determinantKey).toBe('knee');
    expect(i?.rationale).toContain('Two limiters were close');
    expect(i?.rationale).toContain("safer and easier to change");
  });

  it('expresses the gain as a range, never a point', () => {
    const i = selectInsight('s1', [{ key: 'knee', mean: 140, meanBand: 5 }]);
    expect(i?.estimatedGainLo).toBeLessThan(i!.estimatedGainHi);
  });

  it('deficit is zero inside the band and grows outside it', () => {
    const knee = DETERMINANTS.knee!;
    expect(deficitFor(knee, 155)).toBe(0);
    expect(deficitFor(knee, 145)).toBeGreaterThan(0);
    expect(deficitFor(knee, 130)).toBeGreaterThan(deficitFor(knee, 145));
  });
});
