# Brand assets — drafts

Issues #60, #61, #62. **Drafts for approval, not final.**

The design system records that no logo exists and that a mark was never
provided: *"Wherever a logo would go, set the wordmark SIGHTSCREEN in Barlow
Condensed 700, uppercase. Flagged for the brand owner."* These are built from
that instruction rather than from an invented mark.

## Files

| File | Size | For |
|---|---|---|
| `store-icon-512.png` | 512×512 | Play Console hi-res icon (#61) |
| `feature-graphic-1024x500.png` | 1024×500 | Play Console feature graphic (#62) |
| `adaptive-foreground-432.png` | 432×432 | Candidate for `app/assets/` — **not yet adopted** |
| `adaptive-background-432.png` | 432×432 | Candidate for `app/assets/` — **not yet adopted** |
| `icon-sizes.png` | — | Contact sheet: the three candidates at 192 / 96 / 48 px |

## The icon, and why it is not the full wordmark

The literal reading of "use the wordmark" is SIGHTSCREEN stacked on ink. It is
legible at 512 and at 192, and it is a grey smudge at 48 — which is where app
icons actually live, on a home screen among thirty others. `icon-sizes.png` was
rendered specifically to make that comparison rather than argue about it.

What shipped instead is the brand's own organising idea rendered literally: the
sightscreen, *"a flat, high-contrast rectangle whose only job is to make
something fast legible"*, with the wordmark's own letter inside it. It uses the
wordmark's typeface and its framing-rectangle motif, and it survives 48 px.

A single letter is a compromise, and it is worth saying so plainly: it is
generic, and it is not a mark anyone will recognise before they know the brand.
If a real mark is ever commissioned, this is what it replaces.

## Rules these follow

From `readme.md`, the design system:

- Flat solids only. No gradients, no textures, no patterns.
- Ink `#1C1B17`, chalk `#F2F0E9`. Cherry `#B02A19` used once, as a rule under
  the wordmark — it must stay rare to stay loud.
- Barlow Condensed 700, the display face, uppercase for the wordmark.
- The framing rectangle and the graduation rule are two of the three signature
  motifs. The third, the error band, is deliberately absent: it carries a
  number, and no number here could be honest until the radar validation (#33)
  has run.
- The tagline is sentence case. Uppercase is reserved for small tracked eyebrow
  labels, and a 46 px line is not one.

**No accuracy claim appears anywhere in these assets**, for the same reason the
store copy carries none (#53, `docs/store-listing.md`).

## Deliberate deviations

The framing rectangle is drawn at 10 px on a 512 icon rather than the system's
hairline 1.5 px. Scaled faithfully it would vanish by 96 px. Icons are viewed
small and the motif has to survive that; the app itself keeps the hairline.

## Regenerating

Sources are `build.mjs` and `render.mjs` — SVG, so the masters are text and
diffable. Rendering needs a rasteriser and the licensed OFL font, neither of
which belongs in the app's dependencies:

```bash
mkdir -p /tmp/brand && cd /tmp/brand
npm init -y && npm i @resvg/resvg-js
cp <repo>/docs/brand/{build,render}.mjs .
cp <repo>/app/node_modules/@expo-google-fonts/barlow-condensed/700Bold/BarlowCondensed_700Bold.ttf BarlowCondensed700.ttf
node build.mjs
```

Barlow Condensed is OFL-1.1, which permits this use. See `app/THIRD-PARTY.md`.

## Still open

- **#60** — whether to commission a real mark, or ship this.
- Adopting the adaptive icons means replacing the existing files in
  `app/assets/`, which is a separate change and has not been made.
- Screenshots (#63) remain blocked on the real pipeline: the alternative is
  putting synthesised speeds in a store listing.
