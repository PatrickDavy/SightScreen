import { SqlAdapter, SqlValue } from '@/data/db/adapter';
import { migrate } from '@/data/db/schema';
import {
  Bowler,
  Calibration,
  Confidence,
  Delivery,
  Insight,
  MetricRow,
  Retest,
  Session,
  SessionStatus,
  SessionSummary,
  WorkloadEntry,
} from '@/domain/types';

import { sessionMeanBandKmh } from '@/domain/speedBand';

import { Repos } from './types';

type Row = Record<string, SqlValue>;

const num = (v: SqlValue | undefined): number => Number(v);
const numOrNull = (v: SqlValue | undefined): number | null => (v == null ? null : Number(v));
const str = (v: SqlValue | undefined): string => String(v);
const strOrNull = (v: SqlValue | undefined): string | null => (v == null ? null : String(v));

function rowToBowler(r: Row): Bowler {
  return {
    id: str(r.id),
    yob: num(r.yob),
    arm: str(r.arm) as Bowler['arm'],
    type: str(r.type) as Bowler['type'],
    heightCm: numOrNull(r.height_cm),
    armSpanCm: numOrNull(r.arm_span_cm),
    targetSpeedKmh: numOrNull(r.target_speed_kmh),
    fix: strOrNull(r.fix),
    unit: str(r.unit) as Bowler['unit'],
    guardianEmail: strOrNull(r.guardian_email),
    consentState: str(r.consent_state) as Bowler['consentState'],
  };
}

function rowToSession(r: Row): Session {
  return {
    id: str(r.id),
    bowlerId: str(r.bowler_id),
    type: str(r.type) as Session['type'],
    venueId: strOrNull(r.venue_id),
    startedAt: num(r.started_at),
    endedAt: numOrNull(r.ended_at),
    deviceModel: strOrNull(r.device_model),
    captureFps: numOrNull(r.capture_fps),
    scaleUncertainty: numOrNull(r.scale_uncertainty),
    thermalEvents: JSON.parse(str(r.thermal_events ?? '[]')) as string[],
    calibrationId: strOrNull(r.calibration_id),
    weighting: num(r.weighting),
    status: str(r.status) as SessionStatus,
    processedCount: num(r.processed_count),
    lowConfOverride: num(r.low_conf_override) === 1,
    clipPath: strOrNull(r.clip_path),
    simulated: num(r.simulated) === 1,
  };
}

function rowToDelivery(r: Row): Delivery {
  return {
    id: str(r.id),
    sessionId: str(r.session_id),
    index: num(r.idx),
    speedKmh: num(r.speed_kmh),
    speedBandKmh: num(r.speed_band_kmh),
    confidence: str(r.confidence) as Confidence,
    clipPath: strOrNull(r.clip_path),
    frameCount: num(r.frame_count),
    events: r.events == null ? null : (JSON.parse(str(r.events)) as Delivery['events']),
    createdAt: num(r.created_at),
  };
}

function rowToWorkload(r: Row): WorkloadEntry {
  return {
    id: str(r.id),
    bowlerId: str(r.bowler_id),
    date: str(r.date),
    deliveries: num(r.deliveries),
    source: str(r.source) as WorkloadEntry['source'],
    weighting: num(r.weighting),
    sessionId: strOrNull(r.session_id),
  };
}

const SESSION_FIELD_MAP: Record<string, string> = {
  bowlerId: 'bowler_id',
  type: 'type',
  venueId: 'venue_id',
  startedAt: 'started_at',
  endedAt: 'ended_at',
  deviceModel: 'device_model',
  captureFps: 'capture_fps',
  scaleUncertainty: 'scale_uncertainty',
  thermalEvents: 'thermal_events',
  calibrationId: 'calibration_id',
  weighting: 'weighting',
  status: 'status',
  processedCount: 'processed_count',
  lowConfOverride: 'low_conf_override',
  clipPath: 'clip_path',
  simulated: 'simulated',
};

export function createSqlRepos(db: SqlAdapter): Repos {
  migrate(db);

  function summarize(session: Session): SessionSummary {
    const rows = db.all<Row>(
      `SELECT COUNT(*) AS balls, MAX(speed_kmh) AS best, AVG(speed_kmh) AS avg, MAX(frame_count) AS frames
       FROM delivery WHERE session_id = ?`,
      [session.id],
    );
    const r = rows[0] ?? { balls: 0, best: null, avg: null, frames: null };
    const balls = num(r.balls ?? 0);
    const bestRow = db.all<Row>(
      `SELECT speed_band_kmh FROM delivery WHERE session_id = ? ORDER BY speed_kmh DESC LIMIT 1`,
      [session.id],
    )[0];
    const avgKmh = balls ? round1(num(r.avg)) : null;
    return {
      session,
      balls,
      bestKmh: balls ? round1(num(r.best)) : null,
      bestBandKmh: balls && bestRow ? round1(num(bestRow.speed_band_kmh)) : null,
      avgKmh,
      // The band on a mean, not the mean of the bands. See sessionMeanBandKmh.
      avgBandKmh:
        avgKmh == null
          ? null
          : round1(sessionMeanBandKmh(avgKmh, session.scaleUncertainty, balls)),
      frames: r.frames == null ? null : num(r.frames),
    };
  }

  return {
    bowler: {
      get() {
        const r = db.all<Row>(`SELECT * FROM bowler LIMIT 1`)[0];
        return r ? rowToBowler(r) : null;
      },
      save(b) {
        db.run(
          `INSERT OR REPLACE INTO bowler
           (id, yob, arm, type, height_cm, arm_span_cm, target_speed_kmh, fix, unit, guardian_email, consent_state)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
          [
            b.id,
            b.yob,
            b.arm,
            b.type,
            b.heightCm,
            b.armSpanCm,
            b.targetSpeedKmh,
            b.fix,
            b.unit,
            b.guardianEmail,
            b.consentState,
          ],
        );
      },
      update(patch) {
        const existing = db.all<Row>(`SELECT * FROM bowler LIMIT 1`)[0];
        if (!existing) return;
        const merged = { ...rowToBowler(existing), ...patch };
        this.save(merged);
      },
    },

    sessions: {
      insert(s) {
        db.run(
          `INSERT INTO session
           (id, bowler_id, type, venue_id, started_at, ended_at, device_model, capture_fps, scale_uncertainty,
            thermal_events, calibration_id, weighting, status, processed_count, low_conf_override,
            clip_path, simulated)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            s.id,
            s.bowlerId,
            s.type,
            s.venueId,
            s.startedAt,
            s.endedAt,
            s.deviceModel,
            s.captureFps,
            s.scaleUncertainty,
            JSON.stringify(s.thermalEvents),
            s.calibrationId,
            s.weighting,
            s.status,
            s.processedCount,
            s.lowConfOverride ? 1 : 0,
            s.clipPath,
            s.simulated ? 1 : 0,
          ],
        );
      },
      update(id, patch) {
        const sets: string[] = [];
        const params: SqlValue[] = [];
        for (const [k, v] of Object.entries(patch)) {
          const col = SESSION_FIELD_MAP[k];
          if (!col) continue;
          sets.push(`${col} = ?`);
          if (k === 'thermalEvents') params.push(JSON.stringify(v));
          else if (k === 'lowConfOverride' || k === 'simulated') params.push(v ? 1 : 0);
          else params.push(v as SqlValue);
        }
        if (!sets.length) return;
        params.push(id);
        db.run(`UPDATE session SET ${sets.join(', ')} WHERE id = ?`, params);
      },
      get(id) {
        const r = db.all<Row>(`SELECT * FROM session WHERE id = ?`, [id])[0];
        return r ? rowToSession(r) : null;
      },
      listSummaries() {
        return db
          .all<Row>(
            `SELECT * FROM session WHERE status IN ('ended','processing','complete')
             ORDER BY started_at DESC`,
          )
          .map((r) => summarize(rowToSession(r)));
      },
      summary(id) {
        const s = this.get(id);
        return s ? summarize(s) : null;
      },
      findResumable() {
        return db
          .all<Row>(
            `SELECT * FROM session WHERE status IN ('ended','processing') ORDER BY started_at DESC`,
          )
          .map(rowToSession);
      },
      markOrphansAbandoned() {
        db.run(`UPDATE session SET status = 'abandoned' WHERE status IN ('armed','recording')`);
      },
    },

    deliveries: {
      insert(d) {
        db.run(
          `INSERT INTO delivery
           (id, session_id, idx, speed_kmh, speed_band_kmh, confidence, clip_path, frame_count, events, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            d.id,
            d.sessionId,
            d.index,
            d.speedKmh,
            d.speedBandKmh,
            d.confidence,
            d.clipPath,
            d.frameCount,
            d.events ? JSON.stringify(d.events) : null,
            d.createdAt,
          ],
        );
      },
      listForSession(sessionId) {
        return db
          .all<Row>(`SELECT * FROM delivery WHERE session_id = ? ORDER BY idx ASC`, [sessionId])
          .map(rowToDelivery);
      },
      count(sessionId) {
        const r = db.all<Row>(`SELECT COUNT(*) AS c FROM delivery WHERE session_id = ?`, [
          sessionId,
        ])[0];
        return r ? num(r.c) : 0;
      },
      trendSpeeds() {
        // Low-confidence deliveries stay visible in lists but sit outside the trend.
        return db
          .all<Row>(
            `SELECT d.session_id AS sessionId, s.started_at AS startedAt, d.speed_kmh AS speedKmh
             FROM delivery d JOIN session s ON s.id = d.session_id
             WHERE d.confidence = 'ok' AND s.status = 'complete'
             ORDER BY s.started_at ASC, d.idx ASC`,
          )
          .map((r) => ({
            sessionId: str(r.sessionId),
            startedAt: num(r.startedAt),
            speedKmh: num(r.speedKmh),
          }));
      },
    },

    metrics: {
      insertMany(rows) {
        db.transaction(() => {
          for (const m of rows) {
            db.run(
              `INSERT OR REPLACE INTO metric (delivery_id, key, value, band_value, reference_lo, reference_hi)
               VALUES (?,?,?,?,?,?)`,
              [m.deliveryId, m.key, m.value, m.bandValue, m.referenceLo, m.referenceHi],
            );
          }
        });
      },
      listForDelivery(deliveryId) {
        return db
          .all<Row>(`SELECT * FROM metric WHERE delivery_id = ?`, [deliveryId])
          .map((r) => ({
            deliveryId: str(r.delivery_id),
            key: str(r.key),
            value: num(r.value),
            bandValue: num(r.band_value),
            referenceLo: numOrNull(r.reference_lo),
            referenceHi: numOrNull(r.reference_hi),
          }));
      },
      sessionMeans(sessionId) {
        return db
          .all<Row>(
            `SELECT m.key AS key, AVG(m.value) AS mean, AVG(m.band_value) AS meanBand
             FROM metric m JOIN delivery d ON d.id = m.delivery_id
             WHERE d.session_id = ? AND d.confidence = 'ok'
             GROUP BY m.key`,
            [sessionId],
          )
          .map((r) => ({ key: str(r.key), mean: num(r.mean), meanBand: num(r.meanBand) }));
      },
    },

    insights: {
      save(i) {
        db.run(
          `INSERT OR REPLACE INTO insight
           (session_id, determinant_key, estimated_gain_lo, estimated_gain_hi, rationale, drill_id)
           VALUES (?,?,?,?,?,?)`,
          [i.sessionId, i.determinantKey, i.estimatedGainLo, i.estimatedGainHi, i.rationale, i.drillId],
        );
      },
      forSession(sessionId) {
        const r = db.all<Row>(`SELECT * FROM insight WHERE session_id = ?`, [sessionId])[0];
        return r ? rowToInsight(r) : null;
      },
      latest() {
        const r = db.all<Row>(
          `SELECT i.* FROM insight i JOIN session s ON s.id = i.session_id
           ORDER BY s.started_at DESC LIMIT 1`,
        )[0];
        return r ? rowToInsight(r) : null;
      },
    },

    workload: {
      insert(e) {
        db.run(
          `INSERT INTO workload_entry (id, bowler_id, date, deliveries, source, weighting, session_id)
           VALUES (?,?,?,?,?,?,?)`,
          [e.id, e.bowlerId, e.date, e.deliveries, e.source, e.weighting, e.sessionId],
        );
      },
      between(fromIso, toIso) {
        return db
          .all<Row>(
            `SELECT * FROM workload_entry WHERE date >= ? AND date <= ? ORDER BY date ASC`,
            [fromIso, toIso],
          )
          .map(rowToWorkload);
      },
      all() {
        return db.all<Row>(`SELECT * FROM workload_entry ORDER BY date ASC`).map(rowToWorkload);
      },
    },

    calibrations: {
      byFingerprint(fp) {
        const r = db.all<Row>(`SELECT * FROM calibration WHERE venue_fingerprint = ?`, [fp])[0];
        if (!r) return null;
        return {
          id: str(r.id),
          venueFingerprint: str(r.venue_fingerprint),
          creaseX: num(r.crease_x),
          creaseY: num(r.crease_y),
          stumpX: num(r.stump_x),
          stumpY: num(r.stump_y),
          pitchLengthM: num(r.pitch_length_m),
          referenceM: num(r.reference_m),
          createdAt: num(r.created_at),
        };
      },
      save(c) {
        db.run(
          `INSERT OR REPLACE INTO calibration
           (id, venue_fingerprint, crease_x, crease_y, stump_x, stump_y, pitch_length_m, reference_m, created_at)
           VALUES (?,?,?,?,?,?,?,?,?)`,
          [
            c.id,
            c.venueFingerprint,
            c.creaseX,
            c.creaseY,
            c.stumpX,
            c.stumpY,
            c.pitchLengthM,
            c.referenceM,
            c.createdAt,
          ],
        );
      },
    },

    retests: {
      save(r) {
        db.run(
          `INSERT OR REPLACE INTO retest
           (id, drill_id, before_session_id, after_session_id, metric_delta, speed_delta, speed_band, verified, created_at)
           VALUES (?,?,?,?,?,?,?,?,?)`,
          [
            r.id,
            r.drillId,
            r.beforeSessionId,
            r.afterSessionId,
            r.metricDelta,
            r.speedDelta,
            r.speedBand,
            r.verified ? 1 : 0,
            r.createdAt,
          ],
        );
      },
      latest() {
        const r = db.all<Row>(`SELECT * FROM retest ORDER BY created_at DESC LIMIT 1`)[0];
        return r ? rowToRetest(r) : null;
      },
      latestForDrill(drillId) {
        const r = db.all<Row>(
          `SELECT * FROM retest WHERE drill_id = ? ORDER BY created_at DESC LIMIT 1`,
          [drillId],
        )[0];
        return r ? rowToRetest(r) : null;
      },
    },

    settings: {
      get(key) {
        const r = db.all<Row>(`SELECT value FROM settings WHERE key = ?`, [key])[0];
        return r ? str(r.value) : null;
      },
      set(key, value) {
        db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?,?)`, [key, value]);
      },
    },

    deleteEverything() {
      db.transaction(() => {
        for (const t of [
          'bowler',
          'session',
          'delivery',
          'metric',
          'insight',
          'workload_entry',
          'calibration',
          'retest',
          'settings',
        ]) {
          db.run(`DELETE FROM ${t}`);
        }
      });
    },
  };
}

function rowToInsight(r: Row): Insight {
  return {
    sessionId: str(r.session_id),
    determinantKey: str(r.determinant_key),
    estimatedGainLo: num(r.estimated_gain_lo),
    estimatedGainHi: num(r.estimated_gain_hi),
    rationale: str(r.rationale),
    drillId: str(r.drill_id),
  };
}

function rowToRetest(r: Row): Retest {
  return {
    id: str(r.id),
    drillId: str(r.drill_id),
    beforeSessionId: strOrNull(r.before_session_id),
    afterSessionId: strOrNull(r.after_session_id),
    metricDelta: numOrNull(r.metric_delta),
    speedDelta: num(r.speed_delta),
    speedBand: num(r.speed_band),
    verified: num(r.verified) === 1,
    createdAt: num(r.created_at),
  };
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}
