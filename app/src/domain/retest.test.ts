import { combineBands, compareRetest, deltaSentence } from './retest';

describe('retest verification', () => {
  it('verifies only when the delta exceeds the combined band', () => {
    const real = compareRetest(
      { speedKmh: 111, bandKmh: 1.0, metricValue: 148 },
      { speedKmh: 113.8, bandKmh: 1.0, metricValue: 153 },
    );
    expect(real.speedDelta).toBe(2.8);
    expect(real.verified).toBe(true);
    expect(real.metricDelta).toBe(5);

    const level = compareRetest({ speedKmh: 111, bandKmh: 2.5 }, { speedKmh: 112, bandKmh: 2.5 });
    expect(level.verified).toBe(false);
  });

  it('combines bands as root sum of squares', () => {
    expect(combineBands(3, 4)).toBe(5);
  });

  it('writes the honest sentence either way', () => {
    expect(deltaSentence(1.3, 2.3, 'km/h')).toContain('treat it as level');
    expect(deltaSentence(2.8, 1.4, 'km/h')).toContain('the change is real');
  });
});
