import React from 'react';
import { Icon } from './Icon.jsx';
export function Tag({ selected, onRemove, style, children, ...rest }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" {...rest} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: 'var(--text-sm)', lineHeight: 1,
        color: selected ? 'var(--chalk)' : 'var(--ink)', background: selected ? 'var(--ink)' : h ? 'var(--chalk)' : 'var(--paper)',
        border: `1px solid ${selected ? 'var(--ink)' : 'var(--line-strong)'}`, borderRadius: 'var(--radius-pill)',
        cursor: 'pointer', transition: 'background var(--dur-1) var(--ease-swift)', ...style }}>
      {children}
      {onRemove ? <span onClick={e => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-flex', marginRight: -4 }}><Icon name="x" size={13} /></span> : null}
    </button>
  );
}
