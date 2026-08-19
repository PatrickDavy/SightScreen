# Pose model spike — desk findings and benchmark protocol

Issue #26. **This is the half of the spike that does not need a phone.**

It shortlists candidates, fixes the accuracy requirement the choice must meet,
records licences, and specifies a benchmark precise enough that someone with a
device and footage can execute it and fill in the numbers. It does **not**
choose a model, because #26 requires a decision backed by measurements on real
bowling footage and no measurement has been taken. #26 stays open.

Three things below matter more than the shortlist, and two of them correct the
issue as filed.

---

## 1. Two corrections to how #26 was framed

### The subject is at 8–10 m, not 20 m

#26 says the hardest constraint is tracking a bowler "at ~20 m, where the
subject occupies a small fraction of the frame". That is wrong, and it made the
problem look harder than it is.

The setup instruction in the app is explicit — `OnboardingScreen.tsx:339`:

> `8–10 M FROM THE PITCH · TRIPOD AT HIP HEIGHT`

Twenty metres is the **reading** distance, not the measuring distance: it is how
far the bowler is from the phone when standing at the top of their run-up, which
is why the recording screen is built the way it is. The camera sits side-on,
8–10 m from the crease, and that is where the joint angles are measured.

This splits the problem into two regimes with very different requirements:

| Regime | Distance | What is measured | Precision needed |
|---|---|---|---|
| **At the crease** | 8–10 m side-on | Front knee at release, trunk flexion, arm delay | Degrees |
| **Down the run-up** | out to ~20 m | Run-up speed | Metres per second, coarse |

Joint angles only have to work at 8–10 m. Run-up speed needs the far end, but it
is a velocity over a distance, not an angle — far more tolerant of a noisy
skeleton. Any model evaluation should score these separately; a model that is
excellent at the crease and mediocre at the mark is still a good choice.

### Inference is batch over a clip, not a live frame processor

`InferenceEngine.analyse()` in `src/capabilities/types.ts` takes an
`InferenceInput` carrying `clipPath` and `fromIndex`, reports progress, and
returns observations. Processing happens **after** the session, on a recorded
file, and is resumable — the S26 processing screen exists for exactly this.

Almost every React Native pose library on the market is built for the opposite
shape: a live camera frame processor at 30 fps. That has two consequences.

**It rules most of them out.** QuickPose, `react-native-mediapipe-pose`, the
ML Kit frame-processor recipes — all assume frames arriving from a live camera
preview. None of them offers "run this model over an MP4 already on disk".
Adopting one would mean either rewriting the capability contract to be live, or
using the library against its grain.

**It relaxes the real-time budget, which is a gift.** Nothing has to hit 30 fps.
What matters is total processing time for a session the bowler waits through.
This makes accuracy-per-frame worth paying for in a way live inference never
does — a model at 8 fps is fine here and useless in a live app.

The practical consequence: the integration problem is **decoding frames from a
recorded video file and feeding them to a model**, which is a different and
less well-trodden path than the frame-processor examples. Budget for it.

---

## 2. The scope gap: pose estimation does not measure ball speed

**No pose model tracks a cricket ball.** They detect human keypoints.

Ball speed is the headline number and the reason anyone opens the app. #29
assumes "ball tracked across frames between release and a defined reference
point", and `calibration.ts` already computes the metres-per-pixel scale it
needs. But nothing in #26's shortlist provides the tracking itself.

So the pipeline needs **two** models, not one:

1. **Pose** — for the four determinants.
2. **Small fast object detection and tracking** — for the ball.

The second is the harder research problem, and it is the one the product's
headline claim rests on. A cricket ball at 130 km/h crossing a frame at 240 fps
moves roughly 15 cm between frames, is a few pixels across at 8–10 m, and is
motion-blurred against grass and netting. The literature is consistent that
ball localisation is difficult precisely because the object is small, fast,
blurred and frequently occluded.

**Recommendation:** split #26 into two spikes. The pose model choice is
comparatively tractable; the ball tracker is a separate investigation with its
own go/no-go, and it should start first because it carries more risk. Right now
the backlog has no issue for it at all.

---

## 3. The accuracy problem, stated in the product's own numbers

This is the finding most likely to change the product, so it is worth being
precise about.

`src/domain/content/determinants.ts` sets the front knee's good band at **≥150°**
and `simulatedEngine.ts` places the canonical bowler at **148°** — a **2°**
deviation the app reports with a **±5°** band, and then builds an insight and a
drill around.

Against that, the published literature on markerless joint angles from video:

- Mean absolute error **below 5°** for lower-limb angles under good conditions,
  against marker-based motion capture.
- **Under 9°** across varied lighting; **under 11°** across varied clothing.
- Accuracy is **strongly dependent on camera placement** — hip and knee angles
  are accurate at one camera position and not another.

So the per-delivery error is roughly two to five times the deviation the product
wants to call out.

**Averaging helps, but only against the random part.** The insight is computed
from `sessionMeans`, so random error falls as √n — across 5 deliveries a 5° MAE
becomes about 2.2°, and across 30 about 0.9°. That is the argument for requiring
a minimum delivery count before an insight is offered, which the product does
not currently do.

**Averaging does not help against the systematic part**, and camera-placement
bias is systematic. A tripod 15° off square biases every delivery in the session
the same way, and no number of balls will average it out. This is the real
threat to the front-knee determinant, and it is also why the calibration step
(S22) and the placement checks (S21) are load-bearing for accuracy and not just
for framing.

**Three implications the benchmark must test, not assume:**

1. Whether the 2° discrimination survives at 8–10 m at all.
2. Whether the published band should widen — the product's honesty rules say the
   band must be the measured one, and 5° may be optimistic.
3. Whether a minimum delivery count is needed before an insight is shown.

If the answer to (1) is no, the honest response is not a better model. It is to
widen the good band, report the knee as a coarser signal, or drop it as a
determinant — and the product survives that, because the insight logic already
scores four determinants and picks between them.

---

## 4. Candidate shortlist

Scored against this app's constraints — batch over a clip on Android, 8–10 m
subject, degrees of precision, commercial licence, must not be enormous.

| Candidate | Licence | Why it is on the list | Why it might not win |
|---|---|---|---|
| **MediaPipe Pose (BlazePose)** | Apache-2.0 | The default for on-device work; 33 keypoints; mature Android runtime (~22–32 fps on a Pixel 5 natively); designed for exactly this class of device | ~78% COCO accuracy, below GPU-class models; two-stage detector→tracker assumes a reasonably large subject |
| **MoveNet Thunder** | Apache-2.0 | Higher accuracy than Lightning (~80.6% vs ~75.1%) and still fast; TFLite, so it drops into a batch pipeline cleanly | 17 keypoints only — check they cover trunk flexion and arm delay before committing |
| **RTMPose-m** | Apache-2.0 | State-of-the-art accuracy at 75.8% AP with 90+ fps on desktop CPU; batch processing means its cost is affordable here | Heaviest of the three on mobile; needs conversion and real measurement, not extrapolation from desktop numbers |
| **ML Kit Pose Detection** | Proprietary, free | Zero-friction on Android, Google-maintained | Live-camera oriented; least control; accuracy not independently published |

**Deliberately excluded:** OpenPose (licence prohibits commercial use without a
paid agreement — a hard stop, whatever its accuracy), and the React Native
wrapper libraries above, which are live-frame-processor shaped.

**Note for #55:** all three primary candidates are Apache-2.0 and safe for a
paid app. That is the pose-model half of the licensing question answered. The
ball tracker's licence remains open, and if the answer there turns out to be a
YOLO variant, check carefully — several are AGPL-3.0, which is a genuine problem
for a closed-source commercial app.

---

## 5. Benchmark protocol

Fill this in and #26 can close. Nothing here can be inferred from a desk.

### Footage needed

- **At least 3 bowlers** of different actions and paces.
- **At least 30 deliveries each**, so the √n argument can be tested rather than
  asserted.
- **Camera at 8–10 m side-on, hip height**, per the app's own setup instruction.
- Conditions spanning: bright sun, overcast, indoor nets, and dusk.
- **At least 3 phone models** across the range you intend to support.
- **Radar paired** on every delivery. This is shared with #33; run them together.
- **Hand-labelled events** on a subset — back-foot contact, front-foot contact,
  release — to score event detection independently of angles.

### Per candidate, measure

| Measure | Why |
|---|---|
| Per-frame inference time, per phone | Sets total processing time and thermal load |
| Total processing time for a 30-ball session | This is what the bowler waits through on S26 |
| Keypoint detection rate at 8–10 m | Silent failure to find the subject is the worst outcome |
| Keypoint detection rate at 15–20 m | Determines whether run-up speed is viable at all |
| Knee angle vs hand-labelled ground truth, MAE and **bias** | Bias is the part averaging cannot fix |
| Same for trunk flexion and arm delay | |
| Sensitivity to tripod misalignment: repeat at 0°, 5°, 10°, 15° off square | Quantifies the systematic error, and tells S21 how tight its level check must be |
| Battery drain and thermal state across a full session | Feeds #21 and #22 |
| Bundled model size | App size is a real install-rate cost |

### Go/no-go criteria, set before the numbers arrive

Deciding these in advance is the point — it is what stops a disappointing result
being reinterpreted as an acceptable one.

- **Go** if knee-angle MAE at 8–10 m is **≤3°** with bias **≤2°** at up to 5° of
  tripod misalignment, and a 30-ball session processes in **under 2 minutes**.
- **Qualified go** if MAE is 3–6°: proceed, but widen the published band to the
  measured value, require a minimum delivery count before an insight, and
  tighten the S21 level check.
- **No-go on the knee determinant** if MAE exceeds 6° or bias exceeds 4°. Report
  it as a coarse signal or drop it. The insight logic already picks among four
  determinants and degrades gracefully to three.
- **No-go on run-up speed** if the detection rate beyond 15 m falls below 80%.
- **Stop and re-scope** if no candidate processes a session in under 5 minutes on
  a mid-range phone. That is the point at which the session model changes shape
  — the handover already anticipates capture-now, process-overnight-on-charge as
  the fallback.

---

## 6. What I recommend before any of this runs

1. **File the ball-tracking spike.** It is missing from the backlog, it carries
   more risk than the pose choice, and the headline number depends on it.
2. **Run this benchmark inside #33's radar sessions.** Both need the same
   footage, the same bowlers and the same conditions. Collecting it twice would
   be a waste of the scarcest resource in the project.
3. **Expect the front knee to be the marginal determinant** and plan for the
   qualified-go branch, because on the published literature it is more likely
   than the clean go.

## Sources

- [BlazePose: On-device Real-time Body Pose tracking](https://arxiv.org/pdf/2006.10204)
- [On-device, Real-time Body Pose Tracking with MediaPipe BlazePose](https://research.google/blog/on-device-real-time-body-pose-tracking-with-mediapipe-blazepose/)
- [RTMPose: Real-Time Multi-Person Pose Estimation based on MMPose](https://arxiv.org/pdf/2303.07399)
- [Comparative Analysis of OpenPose, PoseNet, and MoveNet Models for Pose Estimation in Mobile Devices](https://www.iieta.org/journals/ts/paper/10.18280/ts.390111)
- [The Best Human Pose Estimation Model in 2026? For Real-Time on Mobile](https://medium.com/@fabrice_77308/the-best-human-pose-estimation-model-in-2026-db7f7cfe6dab)
- [OpenPose, MediaPipe, RTMPose, ViTPose — The Pose-Tracking Stack For Video In 2026](https://www.forasoft.com/learn/ai-for-video-engineering/articles-ai/openpose-mediapipe-rtmpose-pose-tracking)
- [Markerless joint angle estimation using MediaPipe with a rapid setup for joint moment calculation](https://link.springer.com/article/10.1007/s11042-026-21256-z)
- [Improving Gait Analysis Techniques with Markerless Pose Estimation Based on Smartphone Location](https://doi.org/10.3390/bioengineering11020141)
- [Exercise quantification from single camera view markerless 3D pose estimation](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10951609/)
- [Automated Wicket-Taking Delivery Segmentation and Trajectory-Based Dismissal-Zone Analysis in Cricket Videos Using OCR-Guided YOLOv8](https://arxiv.org/pdf/2510.18405)
- [QuickPose React Native](https://quickpose.ai/products/react-native/)
