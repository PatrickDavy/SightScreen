# Sightscreen app prototype — screen-flow spec v0.1

Complete interactive prototype of the app specified in `uploads/screen-flow-specification.md`, built entirely from Sightscreen design-system components. 390×844.

**Coverage** — every screen in the S-inventory:

| Flow | Screens |
|---|---|
| F1 Onboarding | S01 welcome · S02 age gate (year of birth ≤2008 → adult path, ≥2009 → junior) · S03 guardian consent · S04 profile · S05 goals · S06 permission priming · S07 setup tutorial |
| F2 Capture | S20 session type · S21 placement checklist · S22 two-tap calibration · S23 arm/ready · S24 countdown + distance-legible recording (green/amber, delivery counter, audio tone, optional spoken speed) · S25 session ended · S26 processing |
| F3 Review | S30 session review · S31 delivery detail with event scrubber · S32 metric explainer · S33 the one insight |
| F4 Improve | S40 improve home · S41 drill detail · S42 retest comparison · S43 drill library |
| F5 Progress | S60 pace trend · S61 metric trends (tabs within Progress) |
| F6 Load | S50 week view · S51 season view · S52 rest guidance |
| F7 Junior mode | Structural: workload becomes the home surface, sharing off, guardian link in S72 |
| F8 Money | S71 subscription · S80 paywall (fires on the 4th analysis of the month, annual-first, no timer) |
| Cross-cutting | S10 home · S11 history · S70 settings · S72 linked accounts · S73 data controls · S90 share sheet |

**Try this:** reset the prototype (You → Reset) → pick birth year 2009 to see junior mode → tutorial → Bowl → mark crease + stumps → arm → watch the green recording screen count deliveries with tones, and the amber out-of-frame alert at ~13 s → tap to end → process → review → the one insight → drill → "Retest in your next session". Recording a 4th analysis in the month triggers the paywall.

**Fakes and shortcuts:** the countdown is shortened to 5 s regardless of the setting; deliveries arrive every 3.8 s on a timer; speeds are synthesised; video areas are ink blocks (no footage); calibration remembers per-run only. Workload guideline numbers (21 overs/week) are illustrative placeholders, not quoted CA/ECB directives. Audio uses WebAudio + speech synthesis and needs a user gesture first (any tap counts).
