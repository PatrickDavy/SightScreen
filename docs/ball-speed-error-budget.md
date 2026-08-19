# Ball speed error budget, and the go/no-go thresholds for #78

Sets the thresholds for the ball-tracking spike (#78) before any measurement is
taken. Deciding them in advance is the point: it is what stops a disappointing
result being reinterpreted as an acceptable one.

The thresholds are derived, not chosen by feel. Two things in the code fix them.

---

## 1. What the product has already committed to

**The retest decides success by comparing a delta against a band.**
`src/domain/retest.ts`:

```ts
verified: Math.abs(speedDelta) > speedBand      // speedBand = √(b₁² + b₂²)
```

**The claimed benefit of the front-knee drill is 3–6 km/h.**
`src/domain/content/determinants.ts` — `gainPerDeficit: [3, 6]`.

Put together, those two decide the budget. For a session band `b`, two sessions
combine to `b√2`, so:

| To verify a gain of | Session band must be under |
|---|---|
| 3 km/h (bottom of the claim) | **2.12 km/h** |
| 4.5 km/h (midpoint) | 3.18 km/h |
| 6 km/h (top of the claim only) | 4.24 km/h |

If the band is wider than 4.24 km/h, the improve loop cannot verify its own
central claim — and `analytics.ts` calls that loop *"the single most important
funnel in the product"*.

## 2. Where the error actually comes from

Geometry from the app's own setup instruction — camera 8–10 m side-on, typical
phone horizontal FOV ~65°, 1920 px wide. A 9 m standoff gives a frame covering
**11.5 m**, so **6.0 mm per pixel**. A ball at 130 km/h travels **15 cm per
frame** at 240 fps.

### Calibration scale error — the dominant term

`sceneScale()` derives metres-per-unit from the **crease-to-stumps span, 1.22 m**
(`CREASE_TO_STUMPS_M`). Scale error propagates directly and proportionally into
speed: 1% scale error is 1% speed error.

| Calibration baseline | Tap ±3 px | Tap ±6 px | Tap ±10 px |
|---|---|---|---|
| **Crease→stumps, 1.22 m (current)** | 2.7 km/h | **5.4 km/h** | 9.0 km/h |
| Pitch width, 3.05 m | 1.1 km/h | 2.2 km/h | 3.6 km/h |
| Popping crease line, 3.66 m | 0.9 km/h | 1.8 km/h | 3.0 km/h |

A ±6 px tap is realistic for a hurried user in bright sun. On the current 1.22 m
baseline that alone is **5.4 km/h** — more than the entire budget, before the
tracker has contributed anything.

**This is the most important finding in the spike, and it is not about the
tracker at all.** The calibration baseline is short, and a short baseline is a
bad ruler. Calibrating against a longer visible reference cuts the error by
2.5–3× for free. Note the model already carries `PITCH_LENGTH_M = 20.12` on
`Calibration` without using it for the scale — but the full pitch does not fit
in an 11.5 m frame, so the realistic candidates are the pitch width or the
popping crease line.

### Tracking error — comparatively cheap

| Track length | Localisation ±2 px | ±4 px |
|---|---|---|
| 8 frames (1.20 m) | 1.8 km/h | 3.6 km/h |
| 13 frames (1.96 m) | 1.1 km/h | 2.2 km/h |
| 20 frames (3.01 m) | 0.7 km/h | 1.5 km/h |

Tracking over a longer baseline is the cheapest accuracy available, and it costs
only frames — which at 240 fps there are plenty of.

### Combined

Root sum of squares, since the terms are independent:

- **Current design, ±6 px taps, 13-frame track:** √(5.4² + 2.2²) = **5.8 km/h** → fails everything.
- **Longer baseline (3.66 m), ±6 px taps, 13-frame track:** √(1.8² + 2.2²) = **2.8 km/h** → verifies the midpoint, not the bottom.
- **Longer baseline, ±3 px taps, 20-frame track:** √(0.9² + 0.7²) = **1.1 km/h** → comfortable.

## 3. Go / no-go thresholds

Measured against radar, on the session-level band the retest actually uses.

### GO — band ≤ 2.0 km/h, bias ≤ 1.0 km/h

Combined retest band 2.83 km/h, under the 3 km/h bottom of the claimed drill
gain. The whole claim is verifiable. Ship the speed number with the measured
band.

### QUALIFIED GO — band 2.0–3.2 km/h

Combined 2.83–4.53 km/h. Only the upper half of the claimed gain is detectable.
Proceed, but all four of these, not a selection:

- Publish the measured band, not the modelled one.
- Narrow `gainPerDeficit` to what is actually detectable, or state the drill's
  benefit as a range that includes "no measurable change".
- Require a minimum delivery count before an insight or a retest verdict.
- Tighten the S21 level check and the S22 calibration UX, since calibration is
  the dominant term.

### NO-GO ON THE RETEST — band 3.2–5.0 km/h

The speed number is still worth showing; the retest is not. `compareRetest`
would return `verified: false` for most real improvements, which reads to a
bowler as "the drill did nothing" when the truth is "we cannot tell". That is
worse than not offering the feature. Defer S42 and say why.

### NO-GO ON THE SPEED NUMBER — band > 5.0 km/h

Beyond this the band exceeds a club bowler's own delivery-to-delivery spread, so
the reading says more about the measurement than about the bowler. The honest
responses are to narrow the supported conditions until the band comes down, or
not to show a speed. Both are better than a flattering number — the handover is
explicit, and a competitor has already taken the credibility damage.

### Independent of band: failure behaviour

- **Track success rate ≥ 90%** of deliveries in good conditions.
- **False reading rate ≈ 0.** A failed track must produce *no* reading, never a
  wrong one. `confidence.ts` already has `PLAUSIBLE_KMH = [40, 170]` and marks
  outliers low-confidence rather than hiding them; a plausible-but-wrong reading
  is the failure mode that bounds cannot catch, and it is the one that destroys
  trust.
- **Bias ≤ 1.0 km/h** across conditions. Bias is systematic and does not average
  out, so it is a harder constraint than spread.

## 4. Two code findings this surfaced

**`sceneScale()` uses a 1.22 m baseline** and is the dominant error term.
Changing it is cheap and worth doing before the benchmark runs, so the benchmark
measures the design you intend to ship. Belongs with #29.

**`avgBand` is the mean of per-delivery bands**, not the standard error of the
mean (`memoryRepos.ts`, `summarize`). For purely random error the session band
should shrink as `b/√n`; for systematic error it should not shrink at all. Since
calibration error is systematic *within* a session but independent *between*
sessions, neither the current formula nor a naive `/√n` is right, and the
correct treatment separates the two components. Worth resolving during #29 —
the benchmark will produce the data needed to decide it, and it directly moves
every threshold above.
