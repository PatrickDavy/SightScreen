import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({ label, hint, error, options = [], style, ...rest }) {
  const [f, setF] = React.useState(false);
  const bc = error ? 'var(--cherry)' : f ? 'var(--ink)' : 'var(--line-strong)';
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <label style={{ display: 'block', minWidth: 0, fontFamily: 'var(--font-ui)', ...style }}>
      {label ? <span style={{ display: 'block', marginBottom: 6, fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{label}</span> : null}
      <span style={{ position: 'relative', display: 'block' }}>
        <select {...rest} onFocus={e => { setF(true); rest.onFocus && rest.onFocus(e); }} onBlur={e => { setF(false); rest.onBlur && rest.onBlur(e); }}
          style={{ width: '100%', height: 40, padding: '0 34px 0 12px', appearance: 'none', WebkitAppearance: 'none', background: 'var(--paper)', border: `1.5px solid ${bc}`, borderRadius: 'var(--radius-1)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none', cursor: 'pointer', boxShadow: f ? '0 0 0 3px rgba(28,27,23,.1)' : 'none', transition: 'border-color var(--dur-1) var(--ease-swift)' }}>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--ink-2)', display: 'inline-flex' }}><Icon name="chevron-down" size={16} /></span>
      </span>
      {(error || hint) ? <span style={{ display: 'block', marginTop: 6, fontSize: 'var(--text-xs)', fontWeight: error ? 600 : 400, color: error ? 'var(--cherry)' : 'var(--ink-3)' }}>{error || hint}</span> : null}
    </label>
  );
}
