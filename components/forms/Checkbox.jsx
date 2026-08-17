import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({ label, checked, onChange, disabled, style }) {
  const [h, setH] = React.useState(false);
  return (
    <label onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, fontFamily: 'var(--font-ui)', ...style }}>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, flex: 'none', marginTop: 1, background: checked ? 'var(--ink)' : 'var(--paper)', border: `1.5px solid ${checked ? 'var(--ink)' : h ? 'var(--ink)' : 'var(--line-strong)'}`, borderRadius: 3, color: 'var(--chalk)', transition: 'background var(--dur-1) var(--ease-swift), border-color var(--dur-1) var(--ease-swift)' }}>
        {checked ? <Icon name="check" size={12} strokeWidth={3.5} /> : null}
      </span>
      {label ? <span style={{ fontSize: 'var(--text-md)', lineHeight: 1.35 }}>{label}</span> : null}
    </label>
  );
}
