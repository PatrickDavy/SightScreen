import React from 'react';
export function Badge({ tone = 'neutral', children, style }) {
  const t = {
    neutral: { bg: 'var(--chalk)', c: 'var(--ink-2)', bc: 'var(--line-strong)' },
    good: { bg: 'var(--good-bg)', c: 'var(--turf-deep)', bc: 'var(--turf-soft)' },
    watch: { bg: 'var(--watch-bg)', c: 'var(--amber-deep)', bc: 'var(--amber-soft)' },
    over: { bg: 'var(--over-bg)', c: 'var(--cherry-deep)', bc: 'var(--cherry-soft)' },
    inverse: { bg: 'var(--ink)', c: 'var(--chalk)', bc: 'var(--ink)' },
  }[tone] || { bg: 'var(--chalk)', c: 'var(--ink-2)', bc: 'var(--line-strong)' };
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 20, padding: '0 7px', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'var(--text-2xs)', letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', lineHeight: 1, color: t.c, background: t.bg, border: `1px solid ${t.bc}`, borderRadius: 'var(--radius-1)', whiteSpace: 'nowrap', ...style }}>{children}</span>;
}
