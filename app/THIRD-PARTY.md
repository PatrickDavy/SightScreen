# Third-party components

Sightscreen itself is proprietary (see `LICENSE`). It is built on open-source
components, listed here with the licences under which they are used. All are
permissive and all permit distribution in a commercial, closed-source app.

Generated from installed package metadata on 19 August 2026. Regenerate whenever
a dependency is added — the release checklist in `RELEASING.md` says so.

## Summary

Of 42 direct dependencies: 35 MIT, 3 MIT AND OFL-1.1 (the fonts), 1 ISC, 1
Apache-2.0, 1 BSD-2-Clause. Nothing copyleft. Nothing restricting commercial use.

## Fonts

Bundled as static files via `expo-font`, not fetched at runtime. All three are
under the SIL Open Font License 1.1, which permits embedding in a commercial
application without a licence purchase.

| Font | Package | Version | Licence |
|---|---|---|---|
| Barlow | `@expo-google-fonts/barlow` | 0.4.1 | MIT AND OFL-1.1 |
| Barlow Condensed | `@expo-google-fonts/barlow-condensed` | 0.4.1 | MIT AND OFL-1.1 |
| IBM Plex Mono | `@expo-google-fonts/ibm-plex-mono` | 0.4.1 | MIT AND OFL-1.1 |

These are substitutes. `readme.md` records that no licensed brand fonts were
supplied. If brand fonts are licensed later, their terms will differ and this
table must be revisited.

## Icons

| Component | Package | Version | Licence |
|---|---|---|---|
| Lucide | `lucide-react-native` | 1.31.0 | ISC |

Bundled as SVG components, not fetched from a CDN. ISC is permissive and
requires the copyright notice be retained, which this file does.

## Framework and libraries

| Component | Version | Licence |
|---|---|---|
| Expo | 57.0.13 | MIT |
| React Native | 0.86.2 | MIT |
| React Navigation | 7.3.16 | MIT |
| React Native Vision Camera | 5.2.2 | MIT |
| React Native SVG | 15.15.4 | MIT |
| React Native Screens | 4.26.2 | MIT |
| React Native Safe Area Context | 5.7.0 | MIT |
| React Native Gesture Handler | 2.32.0 | MIT |
| Zustand | 5.0.15 | MIT |

Build-time only, not shipped in the binary: TypeScript (Apache-2.0),
`@expo/ngrok` (BSD-2-Clause), Jest and the testing libraries (MIT).

## Not yet chosen

**The pose model.** No model has been selected — that is the spike in issue #26.
Model licences vary considerably and some restrict commercial use outright, so
the licence must be checked *before* a model is bundled, not after. This is the
open half of issue #55.
