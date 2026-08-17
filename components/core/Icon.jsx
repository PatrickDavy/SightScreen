import React from 'react';
export function Icon({ name, size = 18, strokeWidth = 2, color, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    el.innerHTML = `<i data-lucide="${name}"></i>`;
    if (window.lucide) {
      window.lucide.createIcons();
      const svg = el.querySelector('svg');
      if (svg) { svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('stroke-width', strokeWidth); svg.style.display = 'block'; }
    }
  }, [name, size, strokeWidth]);
  return <span ref={ref} aria-hidden="true" style={{ display: 'inline-flex', width: size, height: size, flex: 'none', color, ...style }}></span>;
}
