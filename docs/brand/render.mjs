import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';

// Design system tokens — readme.md. Flat solids only, no gradients.
export const INK = '#1C1B17';
export const CHALK = '#F2F0E9';
export const CHERRY = '#B02A19';
export const PAPER = '#FFFFFF';
export const MUTED = '#7D786C';

const FONT = new URL('./BarlowCondensed700.ttf', import.meta.url).pathname;

export function render(name, svg, width) {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Barlow Condensed' },
  });
  const png = r.render().asPng();
  writeFileSync(new URL(`./${name}`, import.meta.url), png);
  return png.length;
}
