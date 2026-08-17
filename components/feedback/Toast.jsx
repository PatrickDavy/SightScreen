import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({ tone = 'neutral', children, onDismiss, style }) {
  const t = {
    neutral: { icon: 'info', c: 'var(--chalk)' },
    good: { icon: 'circle-check', c: 'var(--turf-soft)' },
    watch: { icon: 'triangle-alert', c: 'var(--amber-soft)' },
    over: { icon: 'octagon-alert', c: 'var(--cherry-soft)' },
  }[tone] || { icon: 'info', c: 'var(--chalk)' };
  return (
    <div role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, maxWidth: 420, padding: '10px 12px 10px 14px', background: 'var(--ink)', color: 'var(--chalk)', borderRadius: 'var(--radius-1)', boxShadow: 'var(--shadow-2)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.4, ...style }}>
      <Icon name={t.icon} size={17} color={t.c} />
      <span style={{ flex: 1 }}>{children}</span>
      {onDismiss ? (
        <button type="button" aria-label="Dismiss" onClick={onDismiss} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flex: 'none', background: 'transparent', border: 'none', color: 'var(--text-inverse-muted)', cursor: 'pointer', padding: 0 }}>
          <Icon name="x" size={14} />
        </button>
      ) : null}
    </div>
  );
}
