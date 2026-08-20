/** Core domain types — mirror the handover's minimum viable schema. */

export type Arm = 'right' | 'left';
export type BowlingType = 'Pace' | 'Fast-medium' | 'Medium' | 'Spin';
export type Unit = 'km/h' | 'mph';
export type ConsentState = 'none' | 'pending' | 'granted';
export type SessionType = 'net' | 'match' | 'drill';
/** Written once at inference and immutable thereafter. */
export type Confidence = 'ok' | 'low';
export type SessionStatus =
  | 'armed'
  | 'recording'
  | 'ended'
  | 'processing'
  | 'complete'
  | 'abandoned';

export interface Bowler {
  id: string;
  /** Year of birth — the age gate asks only the year. */
  yob: number;
  arm: Arm;
  type: BowlingType;
  heightCm: number | null;
  armSpanCm: number | null;
  targetSpeedKmh: number | null;
  /** What they want to fix (goal framing). */
  fix: string | null;
  unit: Unit;
  guardianEmail: string | null;
  consentState: ConsentState;
}

export interface Session {
  id: string;
  bowlerId: string;
  type: SessionType;
  venueId: string | null;
  startedAt: number;
  endedAt: number | null;
  deviceModel: string | null;
  captureFps: number | null;
  /**
   * Fractional uncertainty of the scene scale this session was captured under,
   * or null when it was never calibrated.
   *
   * A session property, like captureFps, because one calibration scales every
   * ball in the spell. That is exactly why it is recorded rather than derived
   * per delivery: it is the correlated part of the speed error, the part that
   * averaging cannot reduce, and the session band is meaningless without it.
   */
  scaleUncertainty: number | null;
  thermalEvents: string[];
  calibrationId: string | null;
  weighting: number;
  status: SessionStatus;
  processedCount: number;
  /** True when a failing placement check was overridden — every delivery in the
   *  session is then marked low confidence rather than hidden. */
  lowConfOverride: boolean;
  clipPath: string | null;
  /**
   * True when the readings came from the simulated engine rather than a real
   * capture and pose pass. Recorded rather than inferred at read time, because
   * a synthesised speed must never be displayed as if it were measured — and
   * once the data is written, the UI has no other way to tell.
   */
  simulated: boolean;
}

export interface DeliveryEvents {
  bfc: number;
  ffc: number;
  release: number;
}

export interface Delivery {
  id: string;
  sessionId: string;
  index: number;
  speedKmh: number;
  speedBandKmh: number;
  confidence: Confidence;
  clipPath: string | null;
  frameCount: number;
  /** Normalised positions (0..1) of back-foot contact, front-foot contact, release. */
  events: DeliveryEvents | null;
  createdAt: number;
}

export interface MetricRow {
  deliveryId: string;
  key: string;
  value: number;
  bandValue: number;
  referenceLo: number | null;
  referenceHi: number | null;
}

export interface Insight {
  sessionId: string;
  determinantKey: string;
  estimatedGainLo: number;
  estimatedGainHi: number;
  rationale: string;
  drillId: string;
}

export interface WorkloadEntry {
  id: string;
  bowlerId: string;
  /** ISO date yyyy-mm-dd (local). */
  date: string;
  deliveries: number;
  source: 'captured' | 'manual';
  weighting: number;
  sessionId: string | null;
}

export interface Calibration {
  id: string;
  venueFingerprint: string;
  creaseX: number;
  creaseY: number;
  stumpX: number;
  stumpY: number;
  pitchLengthM: number;
  /**
   * The real-world separation the two marks were taken to be, in metres.
   *
   * Persisted because the taps alone do not say what they measured. A venue
   * calibrated against the return crease and replayed as crease-to-stumps would
   * scale every speed by exactly two, and nothing downstream could tell.
   */
  referenceM: number;
  createdAt: number;
}

export interface Retest {
  id: string;
  drillId: string;
  beforeSessionId: string | null;
  afterSessionId: string | null;
  metricDelta: number | null;
  speedDelta: number;
  speedBand: number;
  verified: boolean;
  createdAt: number;
}

/** Session aggregates computed from its ok+low deliveries at read time. */
export interface SessionSummary {
  session: Session;
  balls: number;
  bestKmh: number | null;
  bestBandKmh: number | null;
  avgKmh: number | null;
  avgBandKmh: number | null;
  frames: number | null;
}
