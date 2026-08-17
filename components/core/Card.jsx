import React from 'react';
export function Card({ title, action, raised, pad = 16, style, children, ...rest }) {
  return (
    <div {...rest} style={{ background: 'var(--surface-card)', border: 'var(--border-hair)', borderRadius: 'var(--radius-2)', boxShadow: raised ? 'var(--shadow-1)' : 'none', padding: pad, ...style }}>
      {(title || action) ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', lineHeight: 1.3 }}>{title}</div>
          {action || null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
