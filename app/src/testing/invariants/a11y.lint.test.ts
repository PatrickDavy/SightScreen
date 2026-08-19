/**
 * Accessibility invariants.
 *
 * The third of the mechanical rules, alongside bareNumber and copy. The
 * handover's accessibility requirements are unusual — 60 pt targets, values
 * announced as words, a session operable entirely by ear — because the user is
 * twenty metres from the phone in sunlight. Requirements that specific decay
 * quietly unless something checks them.
 *
 * These are stand-ins for judgements, not a substitute for TalkBack on a real
 * device. What they catch is regression: a component that used to announce and
 * silently stopped.
 */
import { collectSources, describeOffenders, scanSource } from '../sourceWalk';

import { MIN_TARGET } from '@/components/core/IconButton';

/** The signature readouts. Every one of these is read aloud to somebody. */
const DATA_COMPONENTS = [
  'components/data/Metric.tsx',
  'components/data/WorkloadMeter.tsx',
  'components/data/CueCard.tsx',
];

describe('measured values announce as words', () => {
  const sources = collectSources(['components', 'ui', 'screens']);

  it('has source to check', () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  it('gives every data component an accessibility label', () => {
    const offenders: { path: string; line: number; detail: string }[] = [];

    for (const path of DATA_COMPONENTS) {
      const file = sources.find((f) => f.path === path);
      if (!file) {
        offenders.push({ path, line: 0, detail: 'component not found — was it moved?' });
        continue;
      }
      if (!/accessibilityLabel/.test(file.source)) {
        offenders.push({ path, line: 0, detail: 'sets no accessibilityLabel' });
      }
    }

    expect(
      offenders.length === 0
        ? ''
        : `A measured value that cannot be heard is a measured value some people cannot read:\n${describeOffenders(offenders)}`,
    ).toBe('');
  });

  it('spells units out rather than leaving the glyph to be read character by character', () => {
    const metric = sources.find((f) => f.path === 'components/data/Metric.tsx');
    expect(metric).toBeDefined();
    // "116.2 plus or minus 2.3 kilometres per hour", not "116.2 ±2.3 km/h".
    expect(metric?.source).toContain('plus or minus');
    expect(metric?.source).toContain('kilometres per hour');
  });
});

describe('type scaling', () => {
  const sources = collectSources(['components', 'ui', 'screens']);

  /**
   * Turning font scaling off is how dynamic-type support is usually lost: it
   * fixes a layout bug and breaks the setting for everyone who needs it. The
   * recording counter is the one place a fixed size is the design, and it does
   * not disable scaling — it computes its own size from screen width.
   */
  it('never disables font scaling', () => {
    const offenders: { path: string; line: number; detail: string }[] = [];

    for (const file of sources) {
      file.source.split('\n').forEach((line, index) => {
        if (/allowFontScaling\s*=\s*\{?\s*false/.test(line)) {
          offenders.push({
            path: file.path,
            line: index + 1,
            detail: 'disables font scaling',
          });
        }
      });
    }

    expect(
      offenders.length === 0
        ? ''
        : `Dynamic type is a setting people rely on, not a layout hazard:\n${describeOffenders(offenders)}`,
    ).toBe('');
  });
});

describe('touch targets', () => {
  it('holds the outdoor minimum at 60 pt', () => {
    // Above both platforms' guidance, deliberately: standing, hot and hurried,
    // with a ball in the other hand.
    expect(MIN_TARGET).toBe(60);
  });
});
