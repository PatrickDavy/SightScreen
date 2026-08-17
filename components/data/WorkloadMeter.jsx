import React from 'react';
import { Badge } from '../core/Badge.jsx';
export function WorkloadMeter({ label = 'This week', used = 0, limit = 1, unit = 'overs', guideline, style }) {
  const ratio = limit > 0 ? used / limit : 0;
  const tone = ratio >= 1 ? 'over' : ratio >= .8 ? 'watch' : 'good';
  const fill = { good: 'var(--turf)', watch: 'var(--amber)', over: 'var(--cherry)' }[tone];
  const word = { good: 'Within limit', watch: 'Near limit', over: 'Over limit' }[tone];
  return (
    <div style={{ fontFamily: 'var(--font-ui)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-2)' }}><b style={{ fontWeight: 600, color: 'var(--ink)' }}>{used}</b> / {limit} {unit}</span>
      </div>
      <div style={{ position: 'relative', height: 16, background: 'var(--paper)', border: 'var(--border-strong)', borderRadius: 'var(--radius-1)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: Math.min(ratio, 1) * 100 + '%', background: fill, transition: 'width var(--dur-3) var(--ease-swift)' }}></div>
        {[25, 50, 75].map(t => <div key={t} style={{ position: 'absolute', top: 0, bottom: 0, left: t + '%', width: 1, background: 'rgba(28,27,23,.22)' }}></div>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--ink-3)' }}>{guideline || ''}</span>
        <Badge tone={tone}>{word}</Badge>
      </div>
    </div>
  );
}
