import React from 'react';
import { Icon } from './Icon.jsx';
const ibSizes = { sm: { d: 28, ic: 15 }, md: { d: 36, ic: 18 }, lg: { d: 44, ic: 20 } };
export function IconButton({ name, label, variant = 'ghost', size = 'md', disabled, style, ...rest }) {
  const [st, setSt] = React.useState({ h: 0, p: 0, f: 0 });
  const s = ibSizes[size] || ibSizes.md;
  const looks = {
    ghost: { bg: st.h || st.p ? 'rgba(28,27,23,.08)' : 'transparent', c: 'var(--ink)', bc: 'transparent' },
    primary: { bg: st.p ? 'var(--ink-deep)' : st.h ? '#000000' : 'var(--ink)', c: 'var(--chalk)', bc: 'transparent' },
    secondary: { bg: st.p ? 'var(--line)' : st.h ? 'var(--chalk)' : 'var(--paper)', c: 'var(--ink)', bc: 'var(--ink)' },
  };
  const l = looks[variant] || looks.ghost;
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} {...rest}
      onMouseEnter={() => setSt(v => ({ ...v, h: 1 }))} onMouseLeave={() => setSt(v => ({ ...v, h: 0, p: 0 }))}
      onMouseDown={() => setSt(v => ({ ...v, p: 1 }))} onMouseUp={() => setSt(v => ({ ...v, p: 0 }))}
      onFocus={() => setSt(v => ({ ...v, f: 1 }))} onBlur={() => setSt(v => ({ ...v, f: 0 }))}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: s.d, height: s.d, flex: 'none',
        color: disabled ? 'var(--ink-3)' : l.c, background: disabled ? 'var(--line)' : l.bg,
        border: `1.5px solid ${disabled ? 'transparent' : l.bc}`, borderRadius: 'var(--radius-1)',
        cursor: disabled ? 'not-allowed' : 'pointer', transform: st.p && !disabled ? 'translateY(1px)' : 'none',
        transition: 'background var(--dur-1) var(--ease-swift)', boxShadow: st.f ? 'var(--focus-ring)' : 'none', outline: 'none', ...style }}>
      <Icon name={name} size={s.ic} />
    </button>
  );
}
