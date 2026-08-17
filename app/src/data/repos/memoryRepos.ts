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

import { Repos } from './types';

export interface MemoryStore {
  bowler: Bowler | null;
  sessions: Session[];
  deliveries: Delivery[];
  metrics: MetricRow[];
  insights: Insight[];
  workload: WorkloadEntry[];
  calibrations: Calibration[];
  retests: Retest[];
  settings: Record<string, string>;
}

export function emptyStore(): MemoryStore {
  return {
    bowler: null,
    sessions: [],
    deliveries: [],
    metrics: [],
    insights: [],
    workload: [],
    calibrations: [],
    retests: [],
    settings: {},
  };
}

const round1 = (v: number) => Math.round(v * 10) / 10;

/** In-memory Repos — the web implementation (and a convenient test double).
 *  `onChange` lets the web entry point snapshot to localStorage. */
export function createMemoryRepos(store: MemoryStore = emptyStore(), onChange?: () => void): Repos {
  const changed = () => onChange?.();

  function summarize(session: Session): SessionSummary {
    const ds = store.deliveries.filter((d) => d.sessionId === session.id);
    if (!ds.length) {
      return { session, balls: 0, bestKmh: null, bestBandKmh: null, avgKmh: null, avgBandKmh: null, frames: null };
    }
    const best = ds.reduce((a, b) => (b.speedKmh > a.speedKmh ? b : a));
    const avg = ds.reduce((s, d) => s + d.speedKmh, 0) / ds.length;
    const avgBand = ds.reduce((s, d) => s + d.speedBandKmh, 0) / ds.length;
    return {
      session,
      balls: ds.length,
      bestKmh: round1(best.speedKmh),
      bestBandKmh: round1(best.speedBandKmh),
      avgKmh: round1(avg),
      avgBandKmh: round1(avgBand),
      frames: Math.max(...ds.map((d) => d.frameCount)),
    };
  }

  return {
    bowler: {
      get: () => store.bowler,
      save(b) {
        store.bowler = { ...b };
        changed();
      },
      update(patch) {
        if (!store.bowler) return;
        store.bowler = { ...store.bowler, ...patch };
        changed();
      },
    },
    sessions: {
      insert(s) {
        store.sessions.push({ ...s });
        changed();
      },
      update(id, patch) {
        const i = store.sessions.findIndex((s) => s.id === id);
        if (i < 0) return;
        store.sessions[i] = { ...store.sessions[i]!, ...patch };
        changed();
      },
      get: (id) => store.sessions.find((s) => s.id === id) ?? null,
      listSummaries() {
        return store.sessions
          .filter((s) => ['ended', 'processing', 'complete'].includes(s.status))
          .sort((a, b) => b.startedAt - a.startedAt)
          .map(summarize);
      },
      summary(id) {
        const s = store.sessions.find((x) => x.id === id);
        return s ? summarize(s) : null;
      },
      findResumable() {
        return store.sessions
          .filter((s) => s.status === 'ended' || s.status === 'processing')
          .sort((a, b) => b.startedAt - a.startedAt);
      },
      markOrphansAbandoned() {
        for (const s of store.sessions) {
          if (s.status === 'armed' || s.status === 'recording') s.status = 'abandoned';
        }
        changed();
      },
    },
    deliveries: {
      insert(d) {
        store.deliveries.push({ ...d });
        changed();
      },
      listForSession: (sessionId) =>
        store.deliveries.filter((d) => d.sessionId === sessionId).sort((a, b) => a.index - b.index),
      count: (sessionId) => store.deliveries.filter((d) => d.sessionId === sessionId).length,
      trendSpeeds() {
        const complete = new Map(
          store.sessions.filter((s) => s.status === 'complete').map((s) => [s.id, s]),
        );
        return store.deliveries
          .filter((d) => d.confidence === 'ok' && complete.has(d.sessionId))
          .map((d) => ({
            sessionId: d.sessionId,
            startedAt: complete.get(d.sessionId)!.startedAt,
            speedKmh: d.speedKmh,
          }))
          .sort((a, b) => a.startedAt - b.startedAt);
      },
    },
    metrics: {
      insertMany(rows) {
        for (const m of rows) {
          const i = store.metrics.findIndex(
            (x) => x.deliveryId === m.deliveryId && x.key === m.key,
          );
          if (i >= 0) store.metrics[i] = { ...m };
          else store.metrics.push({ ...m });
        }
        changed();
      },
      listForDelivery: (deliveryId) => store.metrics.filter((m) => m.deliveryId === deliveryId),
      sessionMeans(sessionId) {
        const okIds = new Set(
          store.deliveries
            .filter((d) => d.sessionId === sessionId && d.confidence === 'ok')
            .map((d) => d.id),
        );
        const byKey = new Map<string, { sum: number; bandSum: number; n: number }>();
        for (const m of store.metrics) {
          if (!okIds.has(m.deliveryId)) continue;
          const agg = byKey.get(m.key) ?? { sum: 0, bandSum: 0, n: 0 };
          agg.sum += m.value;
          agg.bandSum += m.bandValue;
          agg.n += 1;
          byKey.set(m.key, agg);
        }
        return [...byKey.entries()].map(([key, a]) => ({
          key,
          mean: a.sum / a.n,
          meanBand: a.bandSum / a.n,
        }));
      },
    },
    insights: {
      save(i) {
        const idx = store.insights.findIndex((x) => x.sessionId === i.sessionId);
        if (idx >= 0) store.insights[idx] = { ...i };
        else store.insights.push({ ...i });
        changed();
      },
      forSession: (sessionId) => store.insights.find((i) => i.sessionId === sessionId) ?? null,
      latest() {
        const byStart = new Map(store.sessions.map((s) => [s.id, s.startedAt]));
        return (
          [...store.insights].sort(
            (a, b) => (byStart.get(b.sessionId) ?? 0) - (byStart.get(a.sessionId) ?? 0),
          )[0] ?? null
        );
      },
    },
    workload: {
      insert(e) {
        store.workload.push({ ...e });
        changed();
      },
      between: (fromIso, toIso) =>
        store.workload
          .filter((e) => e.date >= fromIso && e.date <= toIso)
          .sort((a, b) => a.date.localeCompare(b.date)),
      all: () => [...store.workload].sort((a, b) => a.date.localeCompare(b.date)),
    },
    calibrations: {
      byFingerprint: (fp) => store.calibrations.find((c) => c.venueFingerprint === fp) ?? null,
      save(c) {
        const i = store.calibrations.findIndex((x) => x.venueFingerprint === c.venueFingerprint);
        if (i >= 0) store.calibrations[i] = { ...c };
        else store.calibrations.push({ ...c });
        changed();
      },
    },
    retests: {
      save(r) {
        const i = store.retests.findIndex((x) => x.id === r.id);
        if (i >= 0) store.retests[i] = { ...r };
        else store.retests.push({ ...r });
        changed();
      },
      latest: () => [...store.retests].sort((a, b) => b.createdAt - a.createdAt)[0] ?? null,
      latestForDrill: (drillId) =>
        [...store.retests]
          .filter((r) => r.drillId === drillId)
          .sort((a, b) => b.createdAt - a.createdAt)[0] ?? null,
    },
    settings: {
      get: (key) => store.settings[key] ?? null,
      set(key, value) {
        store.settings[key] = value;
        changed();
      },
    },
    deleteEverything() {
      Object.assign(store, emptyStore());
      changed();
    },
  };
}
