/** Contract tests run against BOTH repo implementations — the SQL one (on
 *  better-sqlite3, the same SQL that runs on device) and the memory one (web).
 *  Keeping them under one suite keeps the two implementations honest. */
import Database from 'better-sqlite3';

import { SqlAdapter, SqlValue } from '@/data/db/adapter';
import { Delivery, Session } from '@/domain/types';

import { createMemoryRepos } from './memoryRepos';
import { createSqlRepos } from './sqlRepos';
import { Repos } from './types';

function betterSqliteAdapter(): SqlAdapter {
  const db = new Database(':memory:');
  return {
    run(sql: string, params: SqlValue[] = []) {
      db.prepare(sql).run(...params);
    },
    all<T>(sql: string, params: SqlValue[] = []): T[] {
      return db.prepare(sql).all(...params) as T[];
    },
    transaction(fn: () => void) {
      db.transaction(fn)();
    },
  };
}

const mkSession = (id: string, over: Partial<Session> = {}): Session => ({
  id,
  bowlerId: 'b1',
  type: 'net',
  venueId: null,
  startedAt: 1000,
  endedAt: null,
  deviceModel: null,
  captureFps: 240,
  thermalEvents: [],
  calibrationId: null,
  weighting: 1,
  status: 'complete',
  processedCount: 0,
  lowConfOverride: false,
  clipPath: null,
  simulated: false,
  ...over,
});

const mkDelivery = (id: string, sessionId: string, over: Partial<Delivery> = {}): Delivery => ({
  id,
  sessionId,
  index: 1,
  speedKmh: 110,
  speedBandKmh: 2.2,
  confidence: 'ok',
  clipPath: null,
  frameCount: 24,
  events: null,
  createdAt: 1000,
  ...over,
});

describe.each([
  ['sql', () => createSqlRepos(betterSqliteAdapter())],
  ['memory', () => createMemoryRepos()],
])('Repos (%s)', (_name, make) => {
  let repos: Repos;
  beforeEach(() => {
    repos = make();
  });

  it('round-trips the bowler', () => {
    repos.bowler.save({
      id: 'b1',
      yob: 2009,
      arm: 'right',
      type: 'Pace',
      heightCm: 178,
      armSpanCm: 183,
      targetSpeedKmh: 120,
      fix: 'More pace',
      unit: 'km/h',
      guardianEmail: 'g@example.com',
      consentState: 'pending',
    });
    const b = repos.bowler.get();
    expect(b?.yob).toBe(2009);
    expect(b?.consentState).toBe('pending');
    repos.bowler.update({ consentState: 'granted' });
    expect(repos.bowler.get()?.consentState).toBe('granted');
  });

  it('summarises sessions with delivery aggregates, newest first', () => {
    repos.sessions.insert(mkSession('s1', { startedAt: 1000 }));
    repos.sessions.insert(mkSession('s2', { startedAt: 2000 }));
    repos.deliveries.insert(mkDelivery('d1', 's1', { index: 1, speedKmh: 110, speedBandKmh: 2 }));
    repos.deliveries.insert(mkDelivery('d2', 's1', { index: 2, speedKmh: 116.2, speedBandKmh: 2.3 }));
    const list = repos.sessions.listSummaries();
    expect(list.map((s) => s.session.id)).toEqual(['s2', 's1']);
    const s1 = list[1]!;
    expect(s1.balls).toBe(2);
    expect(s1.bestKmh).toBe(116.2);
    expect(s1.bestBandKmh).toBe(2.3);
    expect(s1.avgKmh).toBe(113.1);
  });

  it('excludes armed/recording/abandoned sessions from the list', () => {
    repos.sessions.insert(mkSession('s1', { status: 'recording' }));
    repos.sessions.insert(mkSession('s2', { status: 'abandoned' }));
    repos.sessions.insert(mkSession('s3', { status: 'ended' }));
    expect(repos.sessions.listSummaries().map((s) => s.session.id)).toEqual(['s3']);
  });

  it('finds resumable sessions and abandons orphans (recovery)', () => {
    repos.sessions.insert(mkSession('s1', { status: 'processing' }));
    repos.sessions.insert(mkSession('s2', { status: 'recording' }));
    expect(repos.sessions.findResumable().map((s) => s.id)).toEqual(['s1']);
    repos.sessions.markOrphansAbandoned();
    expect(repos.sessions.get('s2')?.status).toBe('abandoned');
  });

  it('updates session fields including thermal events and processed count', () => {
    repos.sessions.insert(mkSession('s1', { status: 'processing' }));
    repos.sessions.update('s1', {
      processedCount: 5,
      thermalEvents: ['serious@120s'],
      status: 'complete',
    });
    const s = repos.sessions.get('s1');
    expect(s?.processedCount).toBe(5);
    expect(s?.thermalEvents).toEqual(['serious@120s']);
    expect(s?.status).toBe('complete');
  });

  it('records whether a session was simulated, and never loses the flag', () => {
    // Without this the data cannot distinguish a synthesised speed from a
    // measured one, and neither can any screen reading it back.
    repos.sessions.insert(mkSession('s_sim', { simulated: true }));
    repos.sessions.insert(mkSession('s_real', { simulated: false }));

    expect(repos.sessions.get('s_sim')?.simulated).toBe(true);
    expect(repos.sessions.get('s_real')?.simulated).toBe(false);

    // ...and it survives an unrelated update.
    repos.sessions.update('s_sim', { status: 'complete', processedCount: 3 });
    expect(repos.sessions.get('s_sim')?.simulated).toBe(true);

    expect(repos.sessions.listSummaries().find((s) => s.session.id === 's_sim')?.session.simulated).toBe(
      true,
    );
  });

  it('excludes low-confidence deliveries from the trend but not from lists', () => {
    repos.sessions.insert(mkSession('s1'));
    repos.deliveries.insert(mkDelivery('d1', 's1', { index: 1, confidence: 'ok' }));
    repos.deliveries.insert(mkDelivery('d2', 's1', { index: 2, confidence: 'low' }));
    expect(repos.deliveries.listForSession('s1')).toHaveLength(2);
    expect(repos.deliveries.trendSpeeds()).toHaveLength(1);
  });

  it('trend only includes complete sessions', () => {
    repos.sessions.insert(mkSession('s1', { status: 'ended' }));
    repos.deliveries.insert(mkDelivery('d1', 's1'));
    expect(repos.deliveries.trendSpeeds()).toHaveLength(0);
  });

  it('computes per-session metric means over ok deliveries only', () => {
    repos.sessions.insert(mkSession('s1'));
    repos.deliveries.insert(mkDelivery('d1', 's1', { confidence: 'ok' }));
    repos.deliveries.insert(mkDelivery('d2', 's1', { index: 2, confidence: 'low' }));
    repos.metrics.insertMany([
      { deliveryId: 'd1', key: 'knee', value: 148, bandValue: 5, referenceLo: 150, referenceHi: 180 },
      { deliveryId: 'd2', key: 'knee', value: 100, bandValue: 20, referenceLo: 150, referenceHi: 180 },
    ]);
    const means = repos.metrics.sessionMeans('s1');
    expect(means).toEqual([{ key: 'knee', mean: 148, meanBand: 5 }]);
  });

  it('stores insights and returns the latest by session start', () => {
    repos.sessions.insert(mkSession('s1', { startedAt: 1000 }));
    repos.sessions.insert(mkSession('s2', { startedAt: 2000 }));
    repos.insights.save({
      sessionId: 's1',
      determinantKey: 'knee',
      estimatedGainLo: 3,
      estimatedGainHi: 6,
      rationale: 'r1',
      drillId: 'brace',
    });
    repos.insights.save({
      sessionId: 's2',
      determinantKey: 'runup',
      estimatedGainLo: 2,
      estimatedGainHi: 4,
      rationale: 'r2',
      drillId: 'rhythm',
    });
    expect(repos.insights.latest()?.determinantKey).toBe('runup');
    expect(repos.insights.forSession('s1')?.drillId).toBe('brace');
  });

  it('filters workload entries by date range inclusively', () => {
    const e = (id: string, date: string) => ({
      id,
      bowlerId: 'b1',
      date,
      deliveries: 24,
      source: 'captured' as const,
      weighting: 1,
      sessionId: null,
    });
    repos.workload.insert(e('w1', '2026-08-10'));
    repos.workload.insert(e('w2', '2026-08-16'));
    repos.workload.insert(e('w3', '2026-08-17'));
    expect(repos.workload.between('2026-08-11', '2026-08-17').map((x) => x.id)).toEqual([
      'w2',
      'w3',
    ]);
  });

  it('remembers calibration per venue fingerprint', () => {
    repos.calibrations.save({
      id: 'c1',
      venueFingerprint: 'fp1',
      creaseX: 0.3,
      creaseY: 0.6,
      stumpX: 0.7,
      stumpY: 0.62,
      pitchLengthM: 20.12,
      createdAt: 1000,
    });
    expect(repos.calibrations.byFingerprint('fp1')?.creaseX).toBe(0.3);
    expect(repos.calibrations.byFingerprint('other')).toBeNull();
  });

  it('stores retests and finds the latest per drill', () => {
    const r = (id: string, drillId: string, createdAt: number) => ({
      id,
      drillId,
      beforeSessionId: null,
      afterSessionId: null,
      metricDelta: 5,
      speedDelta: 2.8,
      speedBand: 1.4,
      verified: true,
      createdAt,
    });
    repos.retests.save(r('r1', 'brace', 1000));
    repos.retests.save(r('r2', 'brace', 2000));
    repos.retests.save(r('r3', 'rhythm', 1500));
    expect(repos.retests.latest()?.id).toBe('r2');
    expect(repos.retests.latestForDrill('rhythm')?.id).toBe('r3');
  });

  it('settings round-trip and deleteEverything wipes all tables', () => {
    repos.settings.set('unit', 'mph');
    expect(repos.settings.get('unit')).toBe('mph');
    repos.sessions.insert(mkSession('s1'));
    repos.deleteEverything();
    expect(repos.settings.get('unit')).toBeNull();
    expect(repos.sessions.listSummaries()).toHaveLength(0);
    expect(repos.bowler.get()).toBeNull();
  });
});
