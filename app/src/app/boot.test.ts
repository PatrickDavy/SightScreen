import { createMemoryRepos } from '@/data/repos/memoryRepos';
import { Repos } from '@/data/repos/types';
import { Bowler, Session } from '@/domain/types';

import { ENTITLEMENT_KEY, runBoot } from './boot';

// 17 Aug 2026, matching the specification's own date.
const NOW = new Date('2026-08-17T12:00:00').getTime();
const clock = { now: () => NOW };

const bowler = (yob: number, over: Partial<Bowler> = {}): Bowler => ({
  id: 'b1',
  yob,
  arm: 'right',
  type: 'Pace',
  heightCm: 178,
  armSpanCm: 183,
  targetSpeedKmh: 120,
  fix: null,
  unit: 'km/h',
  guardianEmail: null,
  consentState: 'none',
  ...over,
});

const session = (id: string, status: Session['status']): Session => ({
  id,
  bowlerId: 'b1',
  type: 'net',
  venueId: null,
  startedAt: NOW - 60_000,
  endedAt: null,
  deviceModel: null,
  captureFps: 240,
  scaleUncertainty: null,
  thermalEvents: [],
  calibrationId: null,
  weighting: 1,
  status,
  processedCount: 0,
  lowConfOverride: false,
  clipPath: null,
  simulated: true,
});

function repos(): Repos {
  return createMemoryRepos();
}

describe('runBoot', () => {
  it('sends a first run to onboarding', () => {
    const result = runBoot({ repos: repos(), clock });
    expect(result.initialRoute).toBe('Onboarding');
    expect(result.bowler).toBeNull();
  });

  it('sends a returning adult to the tabs, landing on Home', () => {
    const r = repos();
    r.bowler.save(bowler(1996));
    const result = runBoot({ repos: r, clock });
    expect(result.initialRoute).toBe('Tabs');
    expect(result.initialTab).toBe('HomeTab');
  });

  it('lands an under-18 account on the workload surface', () => {
    const r = repos();
    r.bowler.save(bowler(2010));
    expect(runBoot({ repos: r, clock }).initialTab).toBe('LoadTab');
  });

  it('abandons sessions a crash left mid-spell', () => {
    const r = repos();
    r.sessions.insert(session('s_armed', 'armed'));
    r.sessions.insert(session('s_recording', 'recording'));

    runBoot({ repos: r, clock });

    expect(r.sessions.get('s_armed')?.status).toBe('abandoned');
    expect(r.sessions.get('s_recording')?.status).toBe('abandoned');
  });

  it('offers to resume a session whose processing was interrupted', () => {
    const r = repos();
    r.sessions.insert(session('s_ended', 'ended'));
    expect(runBoot({ repos: r, clock }).resumeSessionId).toBe('s_ended');
  });

  it('does not offer to resume a completed session', () => {
    const r = repos();
    r.sessions.insert({ ...session('s_done', 'complete'), endedAt: NOW });
    expect(runBoot({ repos: r, clock }).resumeSessionId).toBeNull();
  });

  it('starts a free bowler on a clean allowance', () => {
    const result = runBoot({ repos: repos(), clock });
    expect(result.entitlement).toEqual({
      entitlement: 'free',
      monthKey: '2026-08',
      analysedCount: 0,
    });
  });

  it('rolls the analysis allowance over when the month turns', () => {
    const r = repos();
    r.settings.set(
      ENTITLEMENT_KEY,
      JSON.stringify({ entitlement: 'free', monthKey: '2026-07', analysedCount: 3 }),
    );

    const result = runBoot({ repos: r, clock });

    expect(result.entitlement.analysedCount).toBe(0);
    expect(result.entitlement.monthKey).toBe('2026-08');
    // ...and the reset is persisted, not just returned.
    expect(JSON.parse(r.settings.get(ENTITLEMENT_KEY) ?? '{}').analysedCount).toBe(0);
  });

  it('keeps the count within the same month', () => {
    const r = repos();
    r.settings.set(
      ENTITLEMENT_KEY,
      JSON.stringify({ entitlement: 'free', monthKey: '2026-08', analysedCount: 2 }),
    );
    expect(runBoot({ repos: r, clock }).entitlement.analysedCount).toBe(2);
  });

  it('boots on a clean allowance rather than crashing on a corrupt setting', () => {
    const r = repos();
    r.settings.set(ENTITLEMENT_KEY, 'not json');
    expect(runBoot({ repos: r, clock }).entitlement.analysedCount).toBe(0);
  });
});
