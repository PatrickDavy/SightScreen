import React from 'react';
const mSizes = { sm: { v: 26, u: 12 }, md: { v: 40, u: 14 }, lg: { v: 64, u: 17 } };
export function Metric({ label, value, unit, band, sample, size = 'md', range, tone, style }) {
  const s = mSizes[size] || mSizes.md;
  const num = typeof value === 'number' ? value : parseFloat(value);
  let bar = null;
  if (range && isFinite(num)) {
    const { min = 0, max = 100, good } = range;
    const pct = x => Math.max(0, Math.min(100, ((x - min) / (max - min)) * 100));
    const b = typeof band === 'number' ? band : parseFloat(band) || 0;
    bar = (
      <div style={{ position: 'relative', height: 6, background: 'var(--band-track)', borderRadius: 3, marginTop: 10 }}>
        {good ? <div style={{ position: 'absolute', top: 0, bottom: 0, left: pct(good[0]) + '%', width: (pct(good[1]) - pct(good[0])) + '%', background: 'var(--turf-soft)', opacity: .55, borderRadius: 3 }}></div> : null}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: pct(num - b) + '%', width: Math.max(pct(num + b) - pct(num - b), 1.5) + '%', background: 'var(--band-fill)', borderRadius: 3 }}></div>
        <div style={{ position: 'absolute', top: -3, bottom: -3, left: `calc(${pct(num)}% - 1px)`, width: 2, background: tone || 'var(--cherry)' }}></div>
      </div>
    );
  }
  return (
    <div style={{ fontFamily: 'var(--font-ui)', minWidth: 0, ...style }}>
      {label ? <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: 4 }}>{label}</div> : null}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: s.v, lineHeight: 'var(--leading-tight)', color: tone || 'var(--ink)', fontVariantNumeric: 'tabular-nums', letterSpacing: '.01em' }}>{value}</span>
        {unit ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: s.u, fontWeight: 500, color: 'var(--ink-2)' }}>{unit}</span> : null}
      </div>
      {(band != null || sample) ? (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-3)', marginTop: 2 }}>
          {band != null ? `±${band}` : ''}{band != null && unit ? ` ${unit}` : ''}{band != null && sample ? ' · ' : ''}{sample || ''}
        </div>
      ) : null}
      {bar}
    </div>
  );
}
