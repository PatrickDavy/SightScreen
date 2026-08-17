# Sightscreen design system

Sightscreen measures a cricket fast bowler's action from a single phone video and tells them **the one thing to change to bowl quicker**. Named for the screen behind the bowler's arm — the thing that makes something too fast to see suddenly legible. Built for club and junior quicks in a net: phone on a tripod twenty metres away, sun out, hands holding a ball. Honest and evidence-led: every number shows its error band, and the workload limits that protect young backs are never behind a paywall.

**Sources:** none attached — this system was authored from the company description only. No codebase, Figma file, decks, or brand assets were provided. If any exist, attach them and this system should be reconciled against them.

**Products:** one — the Sightscreen mobile app (capture → result → workload). No marketing site exists yet; if one is needed, build it from these foundations.

**No logo exists.** No mark was provided and none has been invented. Wherever a logo would go, set the wordmark SIGHTSCREEN in Barlow Condensed 700, uppercase. Flagged for the brand owner.

**Fonts are Google-Fonts substitutes** (no binaries provided): Barlow Condensed (display), Barlow (UI/body), IBM Plex Mono (data). Loaded via Google Fonts import in `tokens/fonts.css`. Attach licensed files to replace.

## Content fundamentals

Voice: a good coach at the side of the net. Plain, direct, second person ("you"), British English (metres, analyse). Never hype, never hedge into mush.

- **Sentence case everywhere** — buttons, labels, headings. Uppercase is reserved for small tracked eyebrow labels (BALL SPEED, THE ONE THING).
- **No emoji. No exclamation marks.** Enthusiasm is expressed by the number, not punctuation.
- **Every measurement carries its uncertainty**, set in mono: `116.2 ±2.3 km/h · from 26 frames`. Never print a bare number the model isn't sure of.
- **One cue at a time.** The product's promise is singular: "Brace your front knee", not a list of five fixes. Cues are short imperatives.
- **Show the evidence**: "Your knee flexes to 38° ±5° at front-foot contact. Bowlers a band quicker hold it under 20°."
- **Honest failure states**: "Too shaky to read. Prop the phone on something solid and go again." Blame the setup, not the user; say exactly what to do.
- **Workload copy is protective and unmissable**: "That's 6 overs today. One more spell puts you over the U17 guideline." Never soften a limit; never gate it behind payment.
- Units: km/h default with mph toggle; degrees for angles; overs/balls for workload.
- Counter-example (never write this): "Unleash your inner express pace! 🚀"

## Visual foundations

The organising idea is the sightscreen itself: a flat, high-contrast rectangle whose only job is to make something fast legible. Information does the design work; decoration is absent.

- **Color**: warm chalk app background `--chalk #F2F0E9`, white cards, near-black ink `#1C1B17`. One accent: cherry `#B02A19` (ball leather) — reserved for the one thing, recording, alarms and links; it must stay rare to stay loud. Turf green = good/within band, amber = watch, cherry = over. Primary buttons are **ink**, not cherry.
- **Type**: Barlow Condensed 600–700 for headlines and big readouts (line-height ~1.05); Barlow 400–600 for UI and body; IBM Plex Mono for every measured value, error band, timestamp and footnote. Caps labels are 11–12px, 600–700, letter-spacing .07em.
- **Spacing**: 4px base scale (`--sp-1..9`: 4→64). Screens breathe at 16–24; dense data rows at 8–12.
- **Backgrounds**: flat solids only. No gradients, no textures, no patterns, no photography baked into chrome. Camera/video areas are ink blocks.
- **Borders**: hairline `1px --line` for dividers and card edges; strong `1.5px ink` for interactive outlines (the "crease line"). Borders do the separating work shadows would elsewhere.
- **Shadows**: near-none. Cards are flat with hairline borders (sunlight legibility); `--shadow-1` only for raised cards, `--shadow-2` only for dialogs/toasts. No inner shadows.
- **Corner radii**: 4px controls, 8px cards, pill only for tags. Rectangles stay honest — nothing bubbly.
- **Motion**: quick and matter-of-fact. 120–320ms, `--ease-swift` (fast out), fades and small translates only. No bounces, no springs, no parallax.
- **Hover**: backgrounds darken one step (ink→black, paper→chalk); links deepen to `--cherry-deep`. **Press**: 1px translate down, background one step darker again. **Focus**: `--focus-ring` (white gap + cherry ring).
- **Transparency/blur**: none, except the dialog overlay `rgba(28,27,23,.55)` — unblurred. Crisp or absent.
- **Imagery**: user-shot net video is the only imagery — daylight, grass, whatever the phone saw. Never stylised; UI never tints it.
- **Signature motifs**: (1) the **error band** — every reading is value ± band in mono, optionally over a track showing the interval; (2) the **framing rectangle** — a chalk 1.5px rectangle marking where the bowler should stand, echoed in empty states; (3) **graduation ticks** on meters, like a rule.
- **Cards**: white, 1px `--line` border, 8px radius, flat, 16px padding. The inverse (ink) card is reserved for the one thing — the single loudest object on any screen.

## Iconography

- **Icon set**: [Lucide](https://lucide.dev) via CDN (`https://unpkg.com/lucide@latest`) — a substitution, chosen for its even 2px stroke and instrument feel; no icon assets were provided. Rendered through the `Icon` component (wraps `lucide.createIcons`). Stroke 2, sizes 16/18/20; color inherits `currentColor`.
- No icon font, no emoji, no unicode glyphs as icons. Icons never appear without a text label except in `IconButton` (which requires an aria label).
- Common vocabulary: video, list, shield (workload), settings, chevron-right, x, check, alert-triangle, info, clock, target, ruler.
- No logos, illustrations or photos exist in the brand yet; nothing was copied into `assets/` because there was nothing to copy.

## Components

Standard set (no source inventory existed, so a standard kit was authored, sized to the brand): Button, IconButton, Badge, Tag, Card, Icon (`components/core`); Input, Select, Checkbox, Radio, Switch (`components/forms`); Tabs, SegmentedControl (`components/navigation`); Dialog, Toast, Tooltip (`components/feedback`); Metric, WorkloadMeter, CueCard (`components/data`).

**Intentional additions** beyond the standard set:
- `Icon` — wrapper for the Lucide CDN set.
- `SegmentedControl` — unit (km/h·mph) and mode toggles are core to the product.
- `Metric` — the signature readout: value + error band + optional range track. Nothing in the product prints a number without it.
- `WorkloadMeter` — overs bowled vs age-group guideline; always free, so always plain.
- `CueCard` — the one thing to change; the only ink-inverse card in the system.

## Index

- `styles.css` — global entry; imports everything under `tokens/`.
- `tokens/` — colors, typography, spacing, borders, motion, base element styles, fonts.
- `components/<group>/` — JSX primitives, each with `.d.ts` + `.prompt.md` + a specimen card.
- `guidelines/` — foundation specimen cards (colors, type, spacing, motion, brand motifs, icons).
- `ui_kits/app/` — the Sightscreen app: interactive `index.html` (Sessions → Record → Result → Workload) composed from the components.
- `thumbnail.html` — project tile. `SKILL.md` — agent skill entry.
