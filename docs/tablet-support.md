# Tablet support — excluded for v1

Issue #65. **Decision: Sightscreen is a phone app. Tablets are excluded from
the Play listing.**

## Why

The product is designed around a phone on a tripod, side-on to the pitch, 8–10 m
from the crease, with the bowler reading the screen from twenty metres at the
top of their run-up. Nobody has designed for a tablet in a cricket net, and
nobody has tested one.

Three specifics rather than a general feeling:

- **The setup instruction assumes a phone.** `OnboardingScreen` says
  `8–10 M FROM THE PITCH · TRIPOD AT HIP HEIGHT`. Tripod mounts for tablets are
  not a thing most club bowlers own.
- **The recording screen scales its counter from screen width.**
  `RecordStep.tsx` uses `COUNTER_RATIO = 190 / 390` against
  `useWindowDimensions()`, uncapped and deliberately so — an
  indoor-comfortable size is unreadable from the mark. On a 10-inch tablet that
  produces a counter several hundred points tall. It would not break, but it has
  never been looked at, and the screen it appears on is the one where a silent
  failure costs a bowler a whole spell.
- **High-speed capture is the constraint anyway.** 240 fps support is patchy
  across Android phones (#74); it is patchier still on tablets, whose cameras
  are generally the weakest component in the device.

Listing on tablets without tablet screenshots is also a Play listing-quality
flag, and producing honest tablet screenshots would mean testing a form factor
we have decided not to support. Excluding is the coherent choice.

## This is a Play Console operation, not a code change

Worth stating plainly, because the instinct is to look for a config flag and
there is not a useful one.

- **Expo has no Android tablet switch.** `ios.supportsTablet` exists and is
  already `false`, but that is iOS only and iOS is not in scope for this
  release. The Android block has no equivalent.
- **`<supports-screens android:xlargeScreens="false">` is not the answer.** It
  is legacy, modern Android largely ignores it for filtering, and adding a tag
  that does not do what it appears to do is worse than adding nothing.

The real mechanism is **Play Console → Release → Device catalogue → Device
exclusion rules**.

## Procedure

1. Play Console → your app → **Release → Device catalogue**.
2. **Device exclusion rules → Add rule**.
3. Exclude by **form factor**, or by **screen size** where form factor is not
   granular enough — the practical rule is to exclude devices whose smallest
   screen width is at or above 600 dp, which is Android's own tablet boundary.
4. Save, then check the **supported devices count** before and after. It should
   drop by a plausible number rather than collapsing; if it collapses, the rule
   is too broad and is catching large phones.
5. Confirm on the listing preview that no tablet screenshot slot is being
   flagged as missing.

Cannot be done before the developer account exists (#11) and the app entry has
been created.

## Revisiting

This is a v1 scope decision, not a permanent one. It should be reopened if
tablet cameras start sustaining 240 fps reliably, or if coach-side use turns out
to matter — a coach reviewing a squad's sessions on a tablet is a plausible
second-screen case, and it is a different product surface from capture. Neither
is true today.
