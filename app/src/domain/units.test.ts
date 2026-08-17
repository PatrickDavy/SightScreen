import { formatSpeedWithBand, spokenSpeed, toDisplay } from './units';

describe('units', () => {
  it('converts km/h to mph at ×0.621371, rounded to 1 dp', () => {
    expect(toDisplay(116.2, 'mph')).toBe(72.2);
    expect(toDisplay(116.2, 'km/h')).toBe(116.2);
  });
  it('formats a speed with its band, never a bare number', () => {
    expect(formatSpeedWithBand(128, 4, 'km/h')).toBe('128 ±4 km/h');
    expect(formatSpeedWithBand(128, 4, 'mph')).toBe('79.5 ±2.5 mph');
  });
  it('speaks whole numbers in the chosen unit', () => {
    expect(spokenSpeed(112.4, 'km/h')).toBe('112');
    expect(spokenSpeed(112.4, 'mph')).toBe('70');
  });
});
