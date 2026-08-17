/**
 * Handover invariant: no bare measured number.
 *
 * "Any measured value rendered without a band prop on Metric is a bug. Speeds
 * show as 128 ± 4 km/h, never 128.4 km/h."
 *
 * Metric warns at runtime when a finite value renders without a band, and
 * jest.setup escalates that warning to a failure — so every render test enforces
 * this for the paths it exercises. This test covers the paths no test renders,
 * by reading the source instead.
 */
import { collectSources, describeOffenders } from '../sourceWalk';

const SCANNED_DIRS = ['screens', 'ui'];

/**
 * Find each `<Metric …>` element and return its attribute text.
 *
 * Brace depth is tracked so that a prop containing `>` — an arrow function, a
 * comparison — cannot end the tag early.
 */
function metricElements(source: string): { attributes: string; line: number }[] {
  const found: { attributes: string; line: number }[] = [];
  const opener = /<Metric(?=[\s/>])/g;

  for (const match of source.matchAll(opener)) {
    const start = match.index + match[0].length;
    let depth = 0;
    let i = start;

    while (i < source.length) {
      const char = source[i];
      if (char === '{') depth += 1;
      else if (char === '}') depth -= 1;
      else if (char === '>' && depth === 0) break;
      i += 1;
    }

    found.push({
      attributes: source.slice(start, i),
      line: source.slice(0, match.index).split('\n').length,
    });
  }

  return found;
}

describe('no bare measured number', () => {
  const sources = collectSources(SCANNED_DIRS);

  it('has source to check', () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  it('never renders Metric without a band', () => {
    const offenders: { path: string; line: number; detail: string }[] = [];

    for (const file of sources) {
      for (const element of metricElements(file.source)) {
        if (/(^|\s)band(=|\s|$)/.test(element.attributes)) continue;
        offenders.push({
          path: file.path,
          line: element.line,
          detail: `<Metric${element.attributes.replace(/\s+/g, ' ').trimEnd()}> has no band`,
        });
      }
    }

    expect(
      offenders.length === 0
        ? ''
        : `Every measurement carries its uncertainty:\n${describeOffenders(offenders)}`,
    ).toBe('');
  });

  it('finds the Metric elements it is meant to be checking', () => {
    // Guards the scanner itself: if a refactor renamed the component or changed
    // how it is called, this test would otherwise pass by finding nothing.
    const total = sources.reduce((count, file) => count + metricElements(file.source).length, 0);
    expect(total).toBeGreaterThan(3);
  });

  it('spots a bandless Metric when there is one', () => {
    const bad = `<Metric label="Fastest ball" value={116.2} unit="km/h" />`;
    const elements = metricElements(bad);
    expect(elements).toHaveLength(1);
    expect(/(^|\s)band(=|\s|$)/.test(elements[0]!.attributes)).toBe(false);
  });

  it('is not fooled by a prop containing a greater-than sign', () => {
    const tricky = `<Metric label="X" value={a > b ? a : b} band={2} unit="km/h" />`;
    const elements = metricElements(tricky);
    expect(elements).toHaveLength(1);
    expect(/(^|\s)band(=|\s|$)/.test(elements[0]!.attributes)).toBe(true);
  });
});
