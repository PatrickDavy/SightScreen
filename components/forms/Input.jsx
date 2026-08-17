import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Input({ label, hint, error, icon, suffix, style, inputStyle, ...rest }) {
  const [f, setF] = React.useState(false);
  const bc = error ? 'var(--cherry)' : f ? 'var(--ink)' : 'var(--line-strong)';
  return (
    <label style={{ display: 'block', minWidth: 0, fontFamily: 'var(--font-ui)', ...style }}>
      {label ? <span style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{label}</span> : null}
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', background: 'var(--paper)', border: `1.5px solid ${bc}`, borderRadius: 'var(--radius-1)', boxShadow: f ? (error ? '0 0 0 3px var(--over-bg)' : '0 0 0 3px rgba(28,27,23,.1)') : 'none', transition: 'border-color var(--dur-1) var(--ease-swift), box-shadow var(--dur-1) var(--ease-swift)' }}>
        {icon ? <Icon name={icon} size={16} color="var(--ink-3)" /> : null}
        <input {...rest} onFocus={e => { setF(true); rest.onFocus && rest.onFocus(e); }} onBlur={e => { setF(false); rest.onBlur && rest.onBlur(e); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-md)', color: 'var(--ink)', padding: 0, ...inputStyle }} />
        {suffix ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-3)', flex: 'none' }}>{suffix}</span> : null}
      </span>
      {(error || hint) ? <span style={{ display: 'block', marginTop: 6, fontSize: 'var(--text-xs)', fontWeight: error ? 600 : 400, color: error ? 'var(--cherry)' : 'var(--ink-3)' }}>{error || hint}</span> : null}
    </label>
  );
}
