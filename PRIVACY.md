# Privacy policy — DRAFT

> **This is a draft, not a published policy, and it is not legal advice.**
> It was written from the codebase so that a lawyer has something factual to
> mark up instead of a blank page. It must be reviewed before publication, and
> it must be hosted at a stable public URL before the Play listing can be
> submitted (issue #48). Nothing here has been checked against the NZ Privacy
> Act 2020 or the Australian Privacy Principles by anyone qualified (#52).

**Last updated:** draft, 19 August 2026
**Applies to:** Sightscreen for Android, open testing

---

## The short version

Your video is captured on your phone, analysed on your phone, and stays on your
phone. It is not uploaded, and there is no server to upload it to.

## What the app stores, and where

Everything below lives in a local SQLite database and the app's own private file
storage on your device. None of it is transmitted.

| Data | What it is | Why |
|---|---|---|
| Your profile | Year of birth, bowling arm and type, height, arm span, target speed, units | The age gate sets your workload guideline; height and arm span inform the analysis |
| Sessions | When you bowled, session type, capture settings, thermal events | Your history, and the context an error band depends on |
| Deliveries | Ball speed with its error band, confidence, frame count, event positions | The measurements themselves |
| Metrics | The measured determinants per delivery, with their bands | The one thing to change, and the evidence for it |
| Workload ledger | Deliveries bowled per day, captured and hand-entered | Bowling-load guidance |
| Video clips | The footage you record | The analysis is computed from it |
| Settings | Units, notifications, analytics preference, subscription state | Your preferences |

**Year of birth** deserves a note. It is asked as "when were you born?", never
"are you over 18?", because the latter teaches people to lie. It sets your
workload guideline, and it is why accounts are limited to 18 and over in this
release.

## What leaves your device

At the time of writing: **nothing**. There is no networking code in the app.

That will change, and this policy must be updated in the same release:

- **Usage analytics.** Instrumentation exists, is switched on by default, and
  can be turned off under Data and privacy. No analytics provider is connected
  yet, so nothing is currently sent. When one is (#56), the app will report
  which screens you reach and where capture fails. It will never send video,
  pose data, or a measurement.
- **Crash reports.** Not implemented (#57).
- **Purchases.** Subscriptions run through Google Play. When billing is
  implemented (#35), Play receives your purchase; Sightscreen receives whether
  you have an active subscription. Google's own privacy policy governs the
  payment itself.

## Your video

Video is the most personal thing this app touches, so it gets its own rules.

- Captured only while a session is recording, and only from the camera you
  point at yourself.
- Analysed on-device. It is not sent anywhere for processing.
- Stored in the app's private storage, not your camera roll or shared media.
- Deleted when you delete a session, and when you delete everything.
- Removed entirely when you uninstall the app.

If other people are visible in your footage — anyone else in the net — that
footage stays on your phone as well. You are responsible for what you then
choose to share.

## Your choices

- **Export everything.** Data and privacy → Export my data writes your complete
  record as CSV files and hands them to the share sheet. This is a real export
  of real data, not a summary.
- **Delete everything.** Data and privacy → the delete action removes every
  session, measurement, clip and setting. There is no cloud copy, so there is
  no undo, and the app says so before you confirm.
- **Turn off analytics.** Data and privacy → Usage analytics.
- **Uninstall.** Takes everything with it.

## Age

Sightscreen is for people aged 18 and over in this release. Onboarding refuses
an under-18 year of birth and no account is created.

This is a retreat from the product's intent, and it is temporary. The workload
ledger exists to protect the backs of young fast bowlers, and readmitting them
requires guardian consent that can actually be delivered and recorded — which
does not exist yet. Rather than admit minors under a consent mechanism that does
not work, this release does not admit them.

## Contact

**To be completed before publication.** A named contact who can answer an access
or deletion request is required under both the NZ Privacy Act and the Australian
Privacy Principles.

## Changes

Material changes will be reflected here with a new date. Because this app is in
open testing, expect this document to change as analytics, crash reporting and
billing are connected.
