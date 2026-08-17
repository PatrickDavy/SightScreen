import {
  Bowler,
  Calibration,
  Delivery,
  Insight,
  MetricRow,
  Retest,
  Session,
  SessionSummary,
  WorkloadEntry,
} from '@/domain/types';

/** Repository surface — implemented over SQLite on device/jest and over an
 *  in-memory store on web. A shared contract test keeps both honest. */
export interface Repos {
  bowler: {
    get(): Bowler | null;
    save(b: Bowler): void;
    update(patch: Partial<Bowler>): void;
  };
  sessions: {
    insert(s: Session): void;
    update(id: string, patch: Partial<Session>): void;
    get(id: string): Session | null;
    /** Newest first, with delivery aggregates. Excludes armed/recording/abandoned. */
    listSummaries(): SessionSummary[];
    summary(id: string): SessionSummary | null;
    /** Sessions interrupted mid-flight: status ended or processing (recovery). */
    findResumable(): Session[];
    /** Orphans left armed/recording by a crash — footage kept, session closed. */
    markOrphansAbandoned(): void;
  };
  deliveries: {
    /** Confidence is written here, once, and is immutable thereafter. */
    insert(d: Delivery): void;
    listForSession(sessionId: string): Delivery[];
    count(sessionId: string): number;
    /** Trend feed: ok-confidence deliveries of complete sessions, oldest first. */
    trendSpeeds(): { sessionId: string; startedAt: number; speedKmh: number }[];
  };
  metrics: {
    insertMany(rows: MetricRow[]): void;
    listForDelivery(deliveryId: string): MetricRow[];
    /** Mean value per metric key across ok-confidence deliveries of a session. */
    sessionMeans(sessionId: string): { key: string; mean: number; meanBand: number }[];
  };
  insights: {
    save(i: Insight): void;
    forSession(sessionId: string): Insight | null;
    latest(): Insight | null;
  };
  workload: {
    insert(e: WorkloadEntry): void;
    /** Entries with date in [fromIso, toIso], inclusive. */
    between(fromIso: string, toIso: string): WorkloadEntry[];
    all(): WorkloadEntry[];
  };
  calibrations: {
    byFingerprint(fp: string): Calibration | null;
    save(c: Calibration): void;
  };
  retests: {
    save(r: Retest): void;
    latest(): Retest | null;
    latestForDrill(drillId: string): Retest | null;
  };
  settings: {
    get(key: string): string | null;
    set(key: string, value: string): void;
  };
  /** S73 "Delete everything" — every session, measurement and setting. */
  deleteEverything(): void;
}
