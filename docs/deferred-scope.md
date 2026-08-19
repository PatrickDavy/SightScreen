# Deferred screen scope for the beta — recommendation

Issue #75. The developer handover drew a scope line for the MVP. Two decisions
since have moved it — billing at launch, and 18+ only — so it is worth
re-confirming deliberately rather than inheriting.

**The decision is yours.** This is a recommendation with the reasoning shown.

| S-ID | Screen | Handover | Recommendation |
|---|---|---|---|
| S42 | Retest comparison | Deferred | **Reconsider — see below** |
| S43 | Drill library | Deferred | Stay deferred |
| S51 | Workload season view | Deferred | Stay deferred |
| S60, S61 | Pace and metric trends | Deferred | Stay deferred for the beta |
| S71 | Subscription | Deferred | **Built** — required once the app charges |
| S72 | Linked accounts / guardian view | Deferred | Out of scope entirely under 18+ |
| S80 | Paywall | Deferred | **Built** — required once the app charges |
| S90 | Share sheet, watermarked export | Deferred | Stay deferred |

## The one worth arguing about: S42, retest comparison

The retest is how the product's core loop closes. `src/domain/retest.ts` exists,
is tested, and computes the comparison already. `src/services/analytics.ts`
names `insight_viewed → drill_started → retest_completed` as *"the single most
important funnel in the product"*, and the handover lists "does the loop close?"
among the questions the beta exists to answer.

A beta that cannot close its own most important loop cannot answer its own most
important question. The domain work is done; what is missing is a screen.

**Recommendation:** build a minimal S42 for the beta. Not the full comparison
experience — just enough that a bowler who did the drill can see whether the
change cleared its own error band, and enough that `retest_completed` fires
against something real.

**Argument against, honestly:** it is scope, and the capture and inference work
in front of it is enormous. If the beta ships without real measurements there is
nothing to retest anyway, so this only becomes urgent once EPIC 3 lands.

## Why the others should stay deferred

**S60, S61 trends.** Trends need enough sessions to be worth drawing, and a beta
cohort will not have them in week one. They are also the natural home for
confidence filtering, which needs real confidence values from real inference
first. Better built once there is data to test them against.

**S51 season view.** Same reason, longer time horizon.

**S43 drill library.** The handover already prescribes one hand-authored drill
per determinant for the MVP. Four good drills beat a library of thin ones, and
breadth can wait for evidence that the loop works at all.

**S90 sharing.** Sharing raises questions this release should not be answering
yet: watermarking, what a shared measurement claims, and — once minors return —
the guardian controls around it. Also the fastest way to put an unvalidated
speed in front of a stranger.

**S72 guardian view.** Out of scope by definition while the app is 18+.

## If you want the shortest possible beta

Cut S42 as well and ship capture, review, the one insight, one drill per
determinant, and the workload ledger. That is a coherent product. It just cannot
tell you whether the drills work.
