import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function CueCard({ eyebrow = 'The one thing', cue, gain, detail, actionLabel, onAction, style }) {
  const [h, setH] = React.useState(false);
  return (
    <div style={{ background: 'var(--surface-inverse)', color: 'var(--text-inverse)', borderRadius: 'var(--radius-2)', padding: '20px 20px 18px', fontFamily: 'var(--font-ui)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-2xs)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--cherry-soft)' }}>
        <Icon name="target" size={13} strokeWidth={2.5} />{eyebrow}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.08, marginTop: 10 }}>{cue}</div>
      {gain ? <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--turf-soft)', marginTop: 6 }}>{gain}</div> : null}
      {detail ? <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5, color: 'var(--text-inverse-muted)', marginTop: 10 }}>{detail}</div> : null}
      {actionLabel ? (
        <button type="button" onClick={onAction} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, height: 36, padding: '0 14px', background: h ? 'rgba(242,240,233,.14)' : 'transparent', color: 'var(--chalk)', border: '1.5px solid var(--chalk)', borderRadius: 'var(--radius-1)', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 'var(--text-sm)', lineHeight: 1, cursor: 'pointer', transition: 'background var(--dur-1) var(--ease-swift)' }}>
          <Icon name="play" size={15} />{actionLabel}
        </button>
      ) : null}
    </div>
  );
}
