/**
 * The capability seam — everything the UI needs from the device, behind
 * interfaces.
 *
 * Two of these (CaptureEngine, InferenceEngine) are the native seam: real
 * 240 fps capture and on-device pose inference need AVFoundation/Camera2 and a
 * Core ML/TFLite model. Until those land, the simulated implementations drive
 * the whole flow, and `kind` tells the UI which it is so a simulated number is
 * never displayed as if it were measured.
 */
import { Clock } from '@/domain/clock';
import { SceneScale } from '@/domain/calibration';
import { DeviceHeadroom } from '@/domain/capacity';
import { Confidence, DeliveryEvents } from '@/domain/types';

/** Matches the four files in assets/audio/. */
export type CueName = 'delivery' | 'alert' | 'end' | 'done';

export type ThermalState = 'nominal' | 'fair' | 'serious' | 'critical';

export type Unsubscribe = () => void;

export interface CueAudio {
  /** Preload every cue. Call on S23 so the first delivery tone is not late. */
  prepare(): Promise<void>;
  /** Fire and forget — must not await, must not block the recording loop. */
  play(cue: CueName): void;
  release(): void;
}

export interface Speech {
  /** "128" spoken as "1 2 8" — the spec's "one two eight". */
  speakDigits(digits: string): void;
  /** A whole sentence, e.g. the amber reason said aloud. */
  speakSentence(text: string): void;
  stop(): void;
}

export interface DeviceSensors {
  /** Feeds estimateCapacity() for the S23 pre-flight. */
  getHeadroom(): Promise<DeviceHeadroom>;
  /** No Expo module exposes thermal state; the real one is native. */
  subscribeThermal(cb: (state: ThermalState) => void): Unsubscribe;
  /** Absolute tilt from level, in degrees. S21 passes at 3° or less. */
  subscribeLevel(cb: (tiltDeg: number) => void): Unsubscribe;
  subscribeOrientation(cb: (o: 'portrait' | 'landscape') => void): Unsubscribe;
}

export interface ScreenControl {
  /** Keep-awake on, full brightness, landscape lock — for capture only. */
  beginCaptureMode(): Promise<void>;
  endCaptureMode(): Promise<void>;
}

export interface RecorderProbe {
  supported: boolean;
  maxFps: number;
  /** Enough light for high-speed capture; false fails the S21 light check. */
  lightOk: boolean;
}

export interface Recorder {
  requestPermission(): Promise<'granted' | 'denied' | 'unavailable'>;
  probe(): Promise<RecorderProbe>;
}

/**
 * One analysed delivery.
 *
 * `engineConfidence` is the model's own view and is NOT what gets stored:
 * finalConfidence(engineConfidence, speedKmh, session.lowConfOverride) decides
 * that, once, at persistence time, and it is immutable thereafter.
 */
export interface DeliveryObservation {
  /** 1-based, matching Delivery.index. */
  index: number;
  /** Milliseconds since recording started. */
  atMs: number;
  speedKmh: number;
  speedBandKmh: number;
  engineConfidence: Confidence;
  frameCount: number;
  events: DeliveryEvents | null;
  clipPath: string | null;
  /** Keys are determinant keys (see domain/content/determinants.ts). */
  metrics: { key: string; value: number; bandValue: number }[];
}

export type ProblemReason = 'out-of-frame' | 'no-detection' | 'overheating' | 'storage-low';

export type CaptureSignal =
  | { kind: 'delivery'; observation: DeliveryObservation }
  /** Amber. `spoken` is said aloud — a silent failure costs the whole spell. */
  | { kind: 'problem'; reason: ProblemReason; spoken: string }
  | { kind: 'resolved' }
  /** Thermal degrade: drop the capture rate rather than stopping. */
  | { kind: 'fps-changed'; fps: number };

export interface CaptureConfig {
  sessionId: string;
  /** From sceneScale(crease, stumps); null when the user skipped calibration. */
  scale: SceneScale | null;
  targetFps: number;
  clock: Clock;
}

export interface CaptureHandle {
  stop(): Promise<{ clipPath: string | null; observations: DeliveryObservation[] }>;
}

export interface CaptureEngine {
  /** Must reach the UI: a simulated speed may never look measured. */
  readonly kind: 'simulated' | 'native';
  start(cfg: CaptureConfig, onSignal: (s: CaptureSignal) => void): Promise<CaptureHandle>;
}

export interface InferenceInput {
  sessionId: string;
  clipPath: string | null;
  observations: DeliveryObservation[];
  /** Resume point — deliveries below this index are already persisted. */
  fromIndex: number;
}

export interface InferenceEngine {
  readonly kind: 'simulated' | 'native';
  analyse(
    input: InferenceInput,
    onProgress: (done: number, total: number) => void,
  ): Promise<DeliveryObservation[]>;
}

export interface Capabilities {
  audio: CueAudio;
  speech: Speech;
  sensors: DeviceSensors;
  screen: ScreenControl;
  recorder: Recorder;
  capture: CaptureEngine;
  inference: InferenceEngine;
}
