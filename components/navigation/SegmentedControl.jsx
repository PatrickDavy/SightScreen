import React from 'react';
export function SegmentedControl({ options = [], value, onChange, size = 'md', style }) {
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  const h = size === 'sm' ? 28 : 34;
  return (
    <span role="group" style={{ display: 'inline-flex', border: 'var(--border-strong)', borderRadius: 'var(--radius-1)', background: 'var(--paper)', overflow: 'hidden', ...style }}>
      {opts.map((o, i) => {
        const active = o.value === value;
        return (
          <button key={o.value} type="button" aria-pressed={active} onClick={() => onChange && onChange(o.value)}
            style={{ appearance: 'none', outline: 'none', cursor: 'pointer', height: h, padding: '0 12px',
              fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1,
              color: active ? 'var(--chalk)' : 'var(--ink-2)', background: active ? 'var(--ink)' : 'transparent',
              border: 'none', borderLeft: i ? '1.5px solid var(--ink)' : 'none',
              transition: 'background var(--dur-1) var(--ease-swift), color var(--dur-1) var(--ease-swift)' }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--chalk)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
            {o.label}
          </button>
        );
      })}
    </span>
  );
}
