import React from 'react';
export function Tabs({ items = [], value, onChange, style }) {
  const list = items.map(i => (typeof i === 'string' ? { id: i, label: i } : i));
  return (
    <div role="tablist" style={{ display: 'flex', gap: 20, borderBottom: 'var(--border-hair)', fontFamily: 'var(--font-ui)', ...style }}>
      {list.map(it => {
        const active = it.id === value;
        return (
          <button key={it.id} role="tab" aria-selected={active} type="button" onClick={() => onChange && onChange(it.id)}
            style={{ appearance: 'none', background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: '10px 2px', marginBottom: -1,
              fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '.02em', lineHeight: 1,
              color: active ? 'var(--ink)' : 'var(--ink-3)', borderBottom: `2px solid ${active ? 'var(--ink)' : 'transparent'}`,
              transition: 'color var(--dur-1) var(--ease-swift), border-color var(--dur-1) var(--ease-swift)' }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink-2)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--ink-3)'; }}>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
