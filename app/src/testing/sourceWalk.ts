/**
 * Source scanning for the two invariant tests.
 *
 * These rules are mechanical stand-ins for judgements a reviewer would make, so
 * they need to look at the right text: product copy, not comments, and not
 * operators that merely contain the same character. Hence a small character
 * scanner rather than regexes over raw source.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const SRC_ROOT = join(__dirname, '..');

export interface SourceFile {
  /** Path relative to src/, e.g. "screens/capture/steps/RecordStep.tsx". */
  path: string;
  source: string;
}

/** Every .ts/.tsx file under the given src-relative directories, tests aside. */
export function collectSources(dirs: string[]): SourceFile[] {
  const files: SourceFile[] = [];

  const walk = (absolute: string) => {
    for (const entry of readdirSync(absolute)) {
      const child = join(absolute, entry);
      if (statSync(child).isDirectory()) {
        walk(child);
        continue;
      }
      if (!/\.tsx?$/.test(entry)) continue;
      if (/\.(test|lint\.test)\.tsx?$/.test(entry)) continue;
      files.push({
        path: relative(SRC_ROOT, child).split(/[\\/]/).join('/'),
        source: readFileSync(child, 'utf8'),
      });
    }
  };

  for (const dir of dirs) walk(join(SRC_ROOT, dir));
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

export interface ScannedSource {
  /** The file with every comment blanked out, line structure preserved. */
  code: string;
  /** Every string/template literal body, with the line it started on. */
  literals: { text: string; line: number }[];
}

/**
 * Walk the source once, separating comments from code from string literals.
 *
 * Deliberately simple: it does not parse JSX or regex literals, which is why
 * `code` is only used for coarse checks (does this file set an uppercase
 * transform) and never for anything needing real syntax.
 */
export function scanSource(source: string): ScannedSource {
  const code: string[] = [];
  const literals: { text: string; line: number }[] = [];

  let i = 0;
  let line = 1;

  const push = (char: string) => {
    code.push(char === '\n' ? '\n' : char);
  };

  while (i < source.length) {
    const char = source[i]!;
    const next = source[i + 1];

    if (char === '\n') {
      line += 1;
      push('\n');
      i += 1;
      continue;
    }

    // Line comment
    if (char === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i += 1;
      continue;
    }

    // Block comment
    if (char === '/' && next === '*') {
      i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') {
          line += 1;
          push('\n');
        }
        i += 1;
      }
      i += 2;
      continue;
    }

    // String or template literal
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      const startLine = line;
      let text = '';
      i += 1;
      while (i < source.length) {
        const c = source[i]!;
        if (c === '\\') {
          text += source[i + 1] ?? '';
          i += 2;
          continue;
        }
        if (c === quote) {
          i += 1;
          break;
        }
        if (c === '\n') line += 1;
        text += c;
        i += 1;
      }
      literals.push({ text, line: startLine });
      // Keep a placeholder so `code` still reflects structure.
      push(' ');
      continue;
    }

    push(char);
    i += 1;
  }

  return { code: code.join(''), literals };
}

/**
 * Copy written directly between JSX tags, rather than passed as a prop.
 *
 * Takes the comment-free, literal-free `code` from scanSource, so it sees JSX
 * text but not comments or string props. Two shapes matter, because both appear
 * throughout the screens:
 *
 *   <Text>Tap anywhere to end</Text>          — text between tags on one line
 *   <Text>                                     — a prose paragraph wrapped
 *     No deliveries detected. Most likely a
 *     framing problem.
 *   </Text>
 *
 * The second is found by elimination: a line with no tag, assignment, call or
 * statement punctuation, but two or more words, is prose. Style properties can
 * slip through that net, which is harmless — they are then simply checked too.
 */
export function jsxTextRuns(code: string): { text: string; line: number }[] {
  const runs: { text: string; line: number }[] = [];

  code.split('\n').forEach((raw, index) => {
    const line = index + 1;
    // JSX expression containers are code, not copy.
    const stripped = raw.replace(/\{[^{}]*\}/g, ' ');

    const between = [...stripped.matchAll(/>([^<>]+)</g)];
    if (between.length > 0) {
      for (const match of between) {
        const text = match[1]?.trim();
        if (text) runs.push({ text, line });
      }
      return;
    }

    // A wrapped prose line: no tag, assignment, call, statement end, index,
    // ternary or property. That last group is what keeps a TypeScript non-null
    // assertion — `RESEARCH.knee!` — from reading as an exclamation mark.
    if (/[<>=;()[\]?:]/.test(stripped)) return;
    const text = stripped.trim();
    if (/[A-Za-z]{2,}/.test(text) && /\s/.test(text)) runs.push({ text, line });
  });

  return runs;
}

/** Formats offenders as "path:line — detail" for a readable failure. */
export function describeOffenders(
  offenders: { path: string; line: number; detail: string }[],
): string {
  return offenders.map((o) => `  ${o.path}:${o.line} — ${o.detail}`).join('\n');
}
