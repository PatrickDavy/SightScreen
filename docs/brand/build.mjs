import { render, INK, CHALK, CHERRY } from './render.mjs';

/**
 * A graduation rule — the design system's third signature motif, "like a rule".
 * Drawn with a baseline so it reads as an instrument scale rather than as a row
 * of floating marks.
 */
function rule({ x, y, w, count, len, colour, weight, opacity = 1 }) {
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${weight}" fill="${colour}" opacity="${opacity}"/>`;
  for (let i = 0; i <= count; i += 1) {
    const tx = x + (w / count) * i;
    const l = i % 5 === 0 ? len : len * 0.5;
    out += `<rect x="${tx - weight / 2}" y="${y}" width="${weight}" height="${l}" fill="${colour}" opacity="${opacity}"/>`;
  }
  return out;
}

const S = 512;

/* Store icon — the sightscreen, with the wordmark's own letter inside it. */
const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${INK}"/>
  <rect x="96" y="96" width="320" height="320" fill="none" stroke="${CHALK}" stroke-width="10"/>
  <text x="${S / 2}" y="${S / 2}" fill="${CHALK}" font-family="Barlow Condensed" font-weight="700"
        font-size="300" text-anchor="middle" dominant-baseline="central" letter-spacing="4">S</text>
</svg>`;

/* Adaptive foreground — same mark, sized into Android's 66% safe zone so the
   system mask cannot clip it, on a transparent ground. */
const adaptiveFg = `
<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
  <rect x="150" y="150" width="132" height="132" fill="none" stroke="${CHALK}" stroke-width="7"/>
  <text x="216" y="216" fill="${CHALK}" font-family="Barlow Condensed" font-weight="700"
        font-size="124" text-anchor="middle" dominant-baseline="central" letter-spacing="2">S</text>
</svg>`;

const adaptiveBg = `
<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
  <rect width="432" height="432" fill="${INK}"/>
</svg>`;

/* Feature graphic. Play crops the edges and overlays UI, so everything
   load-bearing sits in the middle. Sentence case on the tagline: the design
   system reserves uppercase for small tracked eyebrow labels, and a 40 px line
   is not one. The wordmark stays uppercase because the wordmark is uppercase.
   No accuracy claim anywhere — the radar validation has not run. */
const FW = 1024, FH = 500;
const feature = `
<svg xmlns="http://www.w3.org/2000/svg" width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}">
  <rect width="${FW}" height="${FH}" fill="${INK}"/>
  <rect x="60" y="48" width="904" height="404" fill="none" stroke="${CHALK}" stroke-width="3" opacity="0.3"/>
  <text x="${FW / 2}" y="226" fill="${CHALK}" font-family="Barlow Condensed" font-weight="700"
        font-size="136" text-anchor="middle" letter-spacing="6">SIGHTSCREEN</text>
  <rect x="${FW / 2 - 200}" y="258" width="400" height="4" fill="${CHERRY}"/>
  <text x="${FW / 2}" y="324" fill="${CHALK}" font-family="Barlow Condensed" font-weight="700"
        font-size="46" text-anchor="middle" opacity="0.85">One phone video. One thing to change.</text>
  ${rule({ x: 362, y: 376, w: 300, count: 10, len: 20, colour: CHALK, weight: 3, opacity: 0.5 })}
</svg>`;

for (const [name, svg, w] of [
  ['store-icon-512.png', icon, 512],
  ['adaptive-foreground-432.png', adaptiveFg, 432],
  ['adaptive-background-432.png', adaptiveBg, 432],
  ['feature-graphic-1024x500.png', feature, 1024],
]) {
  console.log(name.padEnd(30), render(name, svg, w).toLocaleString(), 'bytes');
}
