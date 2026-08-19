# Releasing Sightscreen

Issue #76. The steps that are easy to forget are the ones that cause incidents:
a version code not bumped, a Data safety form left stale after an SDK was added,
source maps not uploaded so every crash report is unreadable.

## Versioning

- `expo.version` in `app/app.json` is the human version, e.g. `0.2.0`.
- `expo.android.versionCode` is an integer that **must increase on every upload
  to Play**, and can never be reused or lowered. Play rejects the build
  otherwise.
- Both are set explicitly rather than auto-incremented, so the value is visible
  in the diff and in review.

Bump `versionCode` by one for every build you upload, including a build that
only fixes the previous one.

## Before every release

- [ ] `versionCode` incremented, `version` updated if the change warrants it.
- [ ] `npm run typecheck` clean.
- [ ] `npm test` green — including the three invariant suites, which are product
      rules rather than unit tests: no measured number without its band
      (`bareNumber`), sentence case with no emoji or exclamation marks (`copy`),
      and the accessibility rules (`a11y`).
- [ ] Changelog / release notes written in the product's voice.
- [ ] **If any dependency changed:** regenerate `THIRD-PARTY.md`, and re-check
      the Play **Data safety** declaration. A new SDK can collect data the
      declaration does not mention, and a mismatch there gets apps removed.
- [ ] **If permissions changed:** re-run the audit in `docs/permissions.md`
      against the *merged* manifest, not just `app.json`.
- [ ] Privacy policy and terms still accurate about what the build actually
      does. They are drafts until reviewed (#48, #49).

## Building

```bash
cd app
eas build --profile production --platform android   # AAB for Play
eas build --profile preview --platform android      # APK for direct testing
eas build --profile development --platform android  # dev client
```

The development profile is the one that carries `expo-dev-client` and Vision
Camera. Expo Go cannot run this app's capture path at all.

## Uploading

- [ ] Upload the AAB to the open testing track.
- [ ] Confirm the upload key is the enrolled one (#15). Losing it is close to
      unrecoverable.
- [ ] Source maps uploaded, once crash reporting exists (#57). Without them
      every stack trace is unreadable and the crash reports are worthless.
- [ ] Review the **pre-launch report** before rolling out. It runs the build on
      real devices and finds things one dev phone never will — particularly
      relevant here, where the app does high-speed capture on unknown hardware.
- [ ] Staged rollout percentage set. Do not go to 100% on a first build.

## Watching a rollout

Halt if any of these move the wrong way:

- Crash-free session rate drops below the previous release.
- ANR rate rises.
- Capture failures rise in the instrumentation (#56) — this is the expensive
  failure mode, because a lost session is a spell the bowler cannot re-bowl.
- Reviews report wrong speeds. Treat a credibility complaint as a stop-the-line
  event, not a support ticket: the whole product rests on the numbers being
  trustworthy.

## Rolling back

Play does not let you un-publish a version's damage retroactively, so the
options are:

1. **Halt the staged rollout.** Immediate, stops further exposure. Do this
   first, ask questions second.
2. **Ship a fix forward** with a higher `versionCode`. This is the real fix, and
   it is why the staged rollout exists — to keep the blast radius small enough
   that a fix-forward is fast enough.

There is no downgrade. A user on the bad build stays there until they update, so
a fix-forward needs to be quick and it needs its own staged rollout.

## Credentials

Upload keystore, EAS credentials and any provider keys live outside this
repository. `app/.gitignore` excludes `*.jks`, `*.p8`, `*.p12` and `*.key` —
do not weaken that. Where they actually live, and who can reach them, should be
recorded somewhere that survives a laptop dying (#15).
