import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({ open, title, onClose, footer, width = 440, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 100 }}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: width, background: 'var(--paper)', borderRadius: 'var(--radius-2)', boxShadow: 'var(--shadow-2)', padding: 20, fontFamily: 'var(--font-ui)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, lineHeight: 1.25 }}>{title}</div>
          {onClose ? <IconButton name="x" label="Close" size="sm" onClick={onClose} style={{ margin: '-4px -6px 0 0' }} /> : null}
        </div>
        <div style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-body)', color: 'var(--ink-2)' }}>{children}</div>
        {footer ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>{footer}</div> : null}
      </div>
    </div>
  );
}
