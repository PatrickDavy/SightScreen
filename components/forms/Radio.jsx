import React from 'react';
export function Radio({ label, checked, onChange, name, value, disabled, style }) {
  const [h, setH] = React.useState(false);
  return (
    <label onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, fontFamily: 'var(--font-ui)', ...style }}>
      <input type="radio" name={name} value={value} checked={!!checked} disabled={disabled} onChange={() => onChange && onChange(value)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, flex: 'none', marginTop: 1, background: 'var(--paper)', border: `1.5px solid ${checked || h ? 'var(--ink)' : 'var(--line-strong)'}`, borderRadius: '50%', transition: 'border-color var(--dur-1) var(--ease-swift)' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--ink)', transform: checked ? 'scale(1)' : 'scale(0)', transition: 'transform var(--dur-1) var(--ease-swift)' }}></span>
      </span>
      {label ? <span style={{ fontSize: 'var(--text-md)', lineHeight: 1.35 }}>{label}</span> : null}
    </label>
  );
}
