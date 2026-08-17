import React from 'react';
import { Icon } from './Icon.jsx';
const btnSizes = { sm: { h: 32, fs: 13, px: 12, ic: 15 }, md: { h: 40, fs: 15, px: 16, ic: 17 }, lg: { h: 48, fs: 16, px: 20, ic: 18 } };
export function Button({ variant = 'primary', size = 'md', icon, disabled, full, style, children, ...rest }) {
  const [st, setSt] = React.useState({ h: 0, p: 0, f: 0 });
  const s = btnSizes[size] || btnSizes.md;
  const looks = {
    primary: { bg: st.p ? 'var(--ink-deep)' : st.h ? '#000000' : 'var(--ink)', c: 'var(--chalk)', bc: 'transparent' },
    secondary: { bg: st.p ? 'var(--line)' : st.h ? 'var(--chalk)' : 'var(--paper)', c: 'var(--ink)', bc: 'var(--ink)' },
    ghost: { bg: st.h || st.p ? 'rgba(28,27,23,.08)' : 'transparent', c: 'var(--ink)', bc: 'transparent' },
    danger: { bg: st.p ? '#701A0F' : st.h ? 'var(--cherry-deep)' : 'var(--cherry)', c: '#FFFFFF', bc: 'transparent' },
  };
  const l = looks[variant] || looks.primary;
  return (
    <button type="button" disabled={disabled} {...rest}
      onMouseEnter={() => setSt(v => ({ ...v, h: 1 }))} onMouseLeave={() => setSt(v => ({ ...v, h: 0, p: 0 }))}
      onMouseDown={() => setSt(v => ({ ...v, p: 1 }))} onMouseUp={() => setSt(v => ({ ...v, p: 0 }))}
      onFocus={() => setSt(v => ({ ...v, f: 1 }))} onBlur={() => setSt(v => ({ ...v, f: 0 }))}
      style={{ display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: 8,
        height: s.h, padding: `0 ${s.px}px`, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: s.fs, lineHeight: 1,
        color: disabled ? 'var(--ink-3)' : l.c, background: disabled ? 'var(--line)' : l.bg,
        border: `1.5px solid ${disabled ? 'transparent' : l.bc}`, borderRadius: 'var(--radius-1)',
        cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
        transform: st.p && !disabled ? 'translateY(1px)' : 'none',
        transition: 'background var(--dur-1) var(--ease-swift), color var(--dur-1) var(--ease-swift)',
        boxShadow: st.f ? 'var(--focus-ring)' : 'none', outline: 'none', ...style }}>
      {icon ? <Icon name={icon} size={s.ic} /> : null}{children}
    </button>
  );
}
