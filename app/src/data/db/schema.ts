/** SQLite schema — mirrors the handover's minimum viable data model, plus
 *  session.status/processed_count for resumable processing and a settings
 *  key-value table. The local database is the primary store (offline-first);
 *  any server would be a replica. */
import { SqlAdapter } from './adapter';

export const SCHEMA_VERSION = 3;

const TABLES = [
  `CREATE TABLE IF NOT EXISTS bowler (
    id TEXT PRIMARY KEY,
    yob INTEGER NOT NULL,
    arm TEXT NOT NULL,
    type TEXT NOT NULL,
    height_cm INTEGER,
    arm_span_cm INTEGER,
    target_speed_kmh REAL,
    fix TEXT,
    unit TEXT NOT NULL DEFAULT 'km/h',
    guardian_email TEXT,
    consent_state TEXT NOT NULL DEFAULT 'none'
  )`,
  `CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    bowler_id TEXT NOT NULL,
    type TEXT NOT NULL,
    venue_id TEXT,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    device_model TEXT,
    capture_fps INTEGER,
    thermal_events TEXT NOT NULL DEFAULT '[]',
    calibration_id TEXT,
    weighting REAL NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK(status IN ('armed','recording','ended','processing','complete','abandoned')),
    processed_count INTEGER NOT NULL DEFAULT 0,
    low_conf_override INTEGER NOT NULL DEFAULT 0,
    clip_path TEXT,
    simulated INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS delivery (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    idx INTEGER NOT NULL,
    speed_kmh REAL NOT NULL,
    speed_band_kmh REAL NOT NULL,
    confidence TEXT NOT NULL CHECK(confidence IN ('ok','low')),
    clip_path TEXT,
    frame_count INTEGER NOT NULL DEFAULT 0,
    events TEXT,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS metric (
    delivery_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value REAL NOT NULL,
    band_value REAL NOT NULL,
    reference_lo REAL,
    reference_hi REAL,
    PRIMARY KEY (delivery_id, key)
  )`,
  `CREATE TABLE IF NOT EXISTS insight (
    session_id TEXT PRIMARY KEY,
    determinant_key TEXT NOT NULL,
    estimated_gain_lo REAL NOT NULL,
    estimated_gain_hi REAL NOT NULL,
    rationale TEXT NOT NULL,
    drill_id TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS workload_entry (
    id TEXT PRIMARY KEY,
    bowler_id TEXT NOT NULL,
    date TEXT NOT NULL,
    deliveries INTEGER NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('captured','manual')),
    weighting REAL NOT NULL DEFAULT 1,
    session_id TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS calibration (
    id TEXT PRIMARY KEY,
    venue_fingerprint TEXT NOT NULL UNIQUE,
    crease_x REAL NOT NULL,
    crease_y REAL NOT NULL,
    stump_x REAL NOT NULL,
    stump_y REAL NOT NULL,
    pitch_length_m REAL NOT NULL DEFAULT 20.12,
    reference_m REAL NOT NULL DEFAULT 1.22,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS retest (
    id TEXT PRIMARY KEY,
    drill_id TEXT NOT NULL,
    before_session_id TEXT,
    after_session_id TEXT,
    metric_delta REAL,
    speed_delta REAL NOT NULL,
    speed_band REAL NOT NULL,
    verified INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_delivery_session ON delivery(session_id, idx)`,
  `CREATE INDEX IF NOT EXISTS idx_workload_date ON workload_entry(date)`,
  `CREATE INDEX IF NOT EXISTS idx_session_status ON session(status)`,
];

/** True when `table` already has `column`. Cheaper than parsing the version. */
function hasColumn(db: SqlAdapter, table: string, column: string): boolean {
  try {
    return db
      .all<{ name: string }>(`PRAGMA table_info(${table})`)
      .some((row) => row.name === column);
  } catch {
    // The table does not exist yet; the CREATE above will include the column.
    return true;
  }
}

export function migrate(db: SqlAdapter): void {
  db.transaction(() => {
    for (const sql of TABLES) db.run(sql);

    // v1 → v2: session.simulated. Written as an idempotent column check rather
    // than a version comparison so it converges from any prior state.
    if (!hasColumn(db, 'session', 'simulated')) {
      db.run(`ALTER TABLE session ADD COLUMN simulated INTEGER NOT NULL DEFAULT 0`);
    }

    // v2 → v3: calibration.reference_m. Existing rows were all calibrated
    // against the crease-to-stumps span, so the default is that and it is
    // correct for them rather than merely convenient.
    if (!hasColumn(db, 'calibration', 'reference_m')) {
      db.run(`ALTER TABLE calibration ADD COLUMN reference_m REAL NOT NULL DEFAULT 1.22`);
    }

    db.run(`INSERT OR REPLACE INTO settings(key, value) VALUES ('schema_version', ?)`, [
      String(SCHEMA_VERSION),
    ]);
  });
}
