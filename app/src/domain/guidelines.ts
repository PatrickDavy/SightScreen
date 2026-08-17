/**
 * Age-group workload guidelines.
 *
 * ILLUSTRATIVE PLACEHOLDERS — the handover is explicit: replace with the real
 * Cricket Australia 1-3-5 / 2-4-6 figures and ECB territory equivalents,
 * sourced and dated, before any user sees them. The `illustrative` flag must
 * survive to the UI as a mono footnote so nobody mistakes these for sourced
 * medical guidance.
 */

export interface Guideline {
  /** Age band label shown to the user. */
  label: string;
  /** Max deliveries per spell (CA "1st" number is spells/day; simplified here). */
  maxPerSpell: number;
  /** Max overs per day. */
  maxOversDay: number;
  /** Max overs across a rolling 7 days. */
  maxOversWeek: number;
  source: string;
  dated: string;
  illustrative: boolean;
}

/** Derive the age band from year of birth at a reference time. */
export function guidelineFor(yob: number, nowYear: number): Guideline {
  const age = nowYear - yob;
  if (age < 17) {
    return {
      label: 'U17',
      maxPerSpell: 30, // ≈5 overs
      maxOversDay: 7,
      maxOversWeek: 21,
      source: 'Cricket Australia 1-3-5 pattern',
      dated: 'placeholder',
      illustrative: true,
    };
  }
  if (age < 20) {
    return {
      label: 'U19',
      maxPerSpell: 36, // ≈6 overs
      maxOversDay: 9,
      maxOversWeek: 27,
      source: 'Cricket Australia 2-4-6 pattern',
      dated: 'placeholder',
      illustrative: true,
    };
  }
  return {
    label: 'Senior',
    maxPerSpell: 48,
    maxOversDay: 12,
    maxOversWeek: 36,
    source: 'senior guideline',
    dated: 'placeholder',
    illustrative: true,
  };
}

/** Footnote text: "U17 guideline · illustrative". */
export function guidelineFootnote(g: Guideline): string {
  return `${g.label} guideline${g.illustrative ? ' · illustrative figures' : ''}`;
}
