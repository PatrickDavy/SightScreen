/**
 * Upgrading an existing database.
 *
 * `migrate()` runs `CREATE TABLE IF NOT EXISTS` first, so a fresh install picks
 * up every column and the interesting path — a database that already exists
 * without the new column — is never exercised by the ordinary tests. That path
 * is the one that runs on the phone of somebody who already has the app, and it
 * is where a schema change breaks real data rather than a fixture.
 */
import Database from 'better-sqlite3';

import { SqlAdapter, SqlValue } from './adapter';
import { SCHEMA_VERSION, migrate } from './schema';

function adapter(db: Database.Database): SqlAdapter {
  return {
    run: (sql, params: SqlValue[] = []) => {
      db.prepare(sql).run(...params);
    },
    all: <T>(sql: string, params: SqlValue[] = []) => db.prepare(sql).all(...params) as T[],
    transaction: (fn) => db.transaction(fn)(),
  };
}

function columns(db: Database.Database, table: string): string[] {
  return (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).map(
    (r) => r.name,
  );
}

describe('migrating a database that predates the change', () => {
  it('adds calibration.reference_m to an existing table', () => {
    const db = new Database(':memory:');
    // The v2 calibration table, without reference_m.
    db.prepare(
      `CREATE TABLE calibration (
        id TEXT PRIMARY KEY,
        venue_fingerprint TEXT NOT NULL UNIQUE,
        crease_x REAL NOT NULL,
        crease_y REAL NOT NULL,
        stump_x REAL NOT NULL,
        stump_y REAL NOT NULL,
        pitch_length_m REAL NOT NULL DEFAULT 20.12,
        created_at INTEGER NOT NULL
      )`,
    ).run();
    db.prepare(
      `INSERT INTO calibration VALUES ('c1','v1:10,10:12,10',0.5,0.5,0.6,0.5,20.12,1000)`,
    ).run();

    expect(columns(db, 'calibration')).not.toContain('reference_m');

    migrate(adapter(db));

    expect(columns(db, 'calibration')).toContain('reference_m');
  });

  it('defaults existing venues to the span they were actually calibrated against', () => {
    const db = new Database(':memory:');
    db.prepare(
      `CREATE TABLE calibration (
        id TEXT PRIMARY KEY,
        venue_fingerprint TEXT NOT NULL UNIQUE,
        crease_x REAL NOT NULL,
        crease_y REAL NOT NULL,
        stump_x REAL NOT NULL,
        stump_y REAL NOT NULL,
        pitch_length_m REAL NOT NULL DEFAULT 20.12,
        created_at INTEGER NOT NULL
      )`,
    ).run();
    db.prepare(
      `INSERT INTO calibration VALUES ('c1','v1:10,10:12,10',0.5,0.5,0.6,0.5,20.12,1000)`,
    ).run();

    migrate(adapter(db));

    // Every pre-existing venue was calibrated on the crease-to-stumps span, so
    // 1.22 is correct for them rather than merely a convenient default. Getting
    // this wrong would rescale every remembered venue's speeds silently.
    const row = db.prepare(`SELECT reference_m FROM calibration WHERE id = 'c1'`).get() as {
      reference_m: number;
    };
    expect(row.reference_m).toBeCloseTo(1.22);
  });

  it('adds session.scale_uncertainty to an existing table', () => {
    const db = new Database(':memory:');
    db.prepare(
      `CREATE TABLE session (
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
        status TEXT NOT NULL,
        processed_count INTEGER NOT NULL DEFAULT 0,
        low_conf_override INTEGER NOT NULL DEFAULT 0,
        clip_path TEXT,
        simulated INTEGER NOT NULL DEFAULT 0
      )`,
    ).run();
    db.prepare(
      `INSERT INTO session (id, bowler_id, type, started_at, status)
       VALUES ('s1','b1','net',1000,'complete')`,
    ).run();

    migrate(adapter(db));

    expect(columns(db, 'session')).toContain('scale_uncertainty');
    // Nullable and left null: a session captured before this was recorded does
    // not know its calibration quality, and inventing one would be worse than
    // admitting it. sessionMeanBandKmh reads null as uncalibrated and says so.
    const row = db.prepare(`SELECT scale_uncertainty FROM session WHERE id='s1'`).get() as {
      scale_uncertainty: number | null;
    };
    expect(row.scale_uncertainty).toBeNull();
  });

  it('is idempotent — running it twice changes nothing', () => {
    const db = new Database(':memory:');
    migrate(adapter(db));
    const first = columns(db, 'calibration');
    expect(() => migrate(adapter(db))).not.toThrow();
    expect(columns(db, 'calibration')).toEqual(first);
  });

  it('records the schema version it converged to', () => {
    const db = new Database(':memory:');
    migrate(adapter(db));
    const row = db
      .prepare(`SELECT value FROM settings WHERE key = 'schema_version'`)
      .get() as { value: string };
    expect(Number(row.value)).toBe(SCHEMA_VERSION);
  });
});
