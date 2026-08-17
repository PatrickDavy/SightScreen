import React from 'react';
export function Switch({ label, checked, onChange, disabled, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, fontFamily: 'var(--font-ui)', ...style }}>
      <input type="checkbox" role="switch" checked={!!checked} disabled={disabled} onChange={e => onChange && onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span aria-hidden="true" style={{ position: 'relative', width: 40, height: 22, flex: 'none', background: checked ? 'var(--ink)' : 'var(--line-strong)', borderRadius: 'var(--radius-pill)', transition: 'background var(--dur-2) var(--ease-swift)' }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 18, height: 18, background: 'var(--paper)', borderRadius: '50%', boxShadow: '0 1px 2px rgba(28,27,23,.25)', transition: 'left var(--dur-2) var(--ease-swift)' }}></span>
      </span>
      {label ? <span style={{ fontSize: 'var(--text-md)' }}>{label}</span> : null}
    </label>
  );
}
