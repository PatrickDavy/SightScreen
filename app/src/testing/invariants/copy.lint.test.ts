/**
 * Handover invariant: sentence case, no emoji, no exclamation marks.
 *
 * "Uppercase is reserved for small tracked eyebrow labels. No exclamation marks
 * in product copy." Voice is a good coach at the side of the net: enthusiasm is
 * expressed by the number, not the punctuation.
 *
 * Casing itself is not statically decidable, so the enforceable proxy is the
 * *mechanism* that produces uppercase — which is allowlisted to the components
 * whose job it is.
 */
import { collectSources, describeOffenders, jsxTextRuns, scanSource } from '../sourceWalk';

const SCANNED_DIRS = ['screens', 'ui', 'domain/content'];

/**
 * Files permitted to set an uppercase transform.
 *
 * SectionLabel is the eyebrow label. The capture steps are the distance-legible
 * screens, read at twenty metres, where the tracked caps are the design.
 */
const UPPERCASE_ALLOWED = [
  'ui/SectionLabel.tsx',
  'ui/CaptureBar.tsx',
  'screens/capture/steps/RecordStep.tsx',
];

/** Not copy: identifiers, style values, test ids and the like. */
function isProductCopy(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 4) return false;
  // Needs at least two words to be a sentence rather than a token.
  if (!/\s/.test(trimmed)) return false;
  // Style and layout values, e.g. "rgba(28,27,23,.55)" or "0 0 0 1px".
  if (/^[\d\s.,%#(){}-]+$/.test(trimmed)) return false;
  return true;
}

describe('product copy', () => {
  const sources = collectSources(SCANNED_DIRS);

  it('has source to check', () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  it('contains no emoji', () => {
    const offenders: { path: string; line: number; detail: string }[] = [];

    for (const file of sources) {
      const { literals } = scanSource(file.source);
      for (const literal of literals) {
        const match = literal.text.match(/\p{Extended_Pictographic}/u);
        if (match) {
          offenders.push({
            path: file.path,
            line: literal.line,
            detail: `contains ${JSON.stringify(match[0])}`,
          });
        }
      }
    }

    expect(
      offenders.length === 0 ? '' : `No emoji in product copy:\n${describeOffenders(offenders)}`,
    ).toBe('');
  });

  it('contains no exclamation marks', () => {
    const offenders: { path: string; line: number; detail: string }[] = [];

    for (const file of sources) {
      // String literals, which excludes `!==` and `!x` — those are operators
      // living in code, not copy.
      const { literals, code } = scanSource(file.source);
      for (const literal of literals) {
        if (literal.text.includes('!') && isProductCopy(literal.text)) {
          offenders.push({ path: file.path, line: literal.line, detail: literal.text.trim() });
        }
      }
      // ...and copy written directly between JSX tags, which only .tsx has.
      for (const run of file.path.endsWith('.tsx') ? jsxTextRuns(code) : []) {
        if (run.text.includes('!') && isProductCopy(run.text)) {
          offenders.push({ path: file.path, line: run.line, detail: run.text });
        }
      }
    }

    expect(
      offenders.length === 0
        ? ''
        : `Enthusiasm is the number's job, not the punctuation's:\n${describeOffenders(offenders)}`,
    ).toBe('');
  });

  it('only sets an uppercase transform where that is the component', () => {
    const offenders: { path: string; line: number; detail: string }[] = [];

    for (const file of sources) {
      if (UPPERCASE_ALLOWED.includes(file.path)) continue;
      const { code } = scanSource(file.source);
      // The quote body is blanked by the scanner, so match the property alone.
      code.split('\n').forEach((line, index) => {
        if (/textTransform\s*:/.test(line)) {
          offenders.push({
            path: file.path,
            line: index + 1,
            detail: 'sets textTransform outside the eyebrow-label components',
          });
        }
      });
    }

    expect(
      offenders.length === 0
        ? ''
        : `Uppercase is reserved for small tracked eyebrow labels:\n${describeOffenders(offenders)}`,
    ).toBe('');
  });

  it('recognises the offences it is looking for', () => {
    // Guards the scanner: a rule that can never fire is not a rule.
    const bad = scanSource(`const a = 'Unleash your inner express pace';\nconst b = "Go on!";`);
    expect(bad.literals).toHaveLength(2);
    expect(bad.literals.some((l) => l.text.includes('!'))).toBe(true);

    const comment = scanSource(`// an arrow ↗ in a comment is not copy\nconst x = 1;`);
    expect(comment.literals).toHaveLength(0);
    expect(/\p{Extended_Pictographic}/u.test(comment.code)).toBe(false);
  });
});
