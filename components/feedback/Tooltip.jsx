import React from 'react';
export function Tooltip({ label, children, style }) {
  const [v, setV] = React.useState(false);
  return (
    <span onMouseEnter={() => setV(true)} onMouseLeave={() => setV(false)} onFocus={() => setV(true)} onBlur={() => setV(false)}
      style={{ position: 'relative', display: 'inline-flex', ...style }}>
      {children}
      <span role="tooltip" style={{ position: 'absolute', bottom: 'calc(100% + 7px)', left: '50%', transform: `translateX(-50%) translateY(${v ? 0 : 3}px)`, background: 'var(--ink)', color: 'var(--chalk)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', fontWeight: 500, lineHeight: 1.35, padding: '5px 9px', borderRadius: 'var(--radius-1)', whiteSpace: 'nowrap', pointerEvents: 'none', opacity: v ? 1 : 0, transition: 'opacity var(--dur-1) var(--ease-swift), transform var(--dur-1) var(--ease-swift)', zIndex: 50 }}>{label}</span>
    </span>
  );
}
