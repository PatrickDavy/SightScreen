/**
 * Launch sequence, as a pure function so it can be tested without a renderer.
 *
 * Three things have to happen before the first screen draws: sessions a crash
 * left mid-flight are closed or queued for resume (captured footage is never
 * lost), the free-analysis allowance is rolled over if the month turned, and
 * the bowler's age decides where the app lands.
 */
import { Clock, monthKey, systemClock } from '@/domain/clock';
import { EntitlementState, rolledOver } from '@/domain/paywall';
import { juniorPolicy } from '@/domain/juniorPolicy';
import { Bowler } from '@/domain/types';
import { Repos } from '@/data/repos/types';

export const ENTITLEMENT_KEY = 'entitlement';

export interface BootResult {
  repos: Repos;
  bowler: Bowler | null;
  entitlement: EntitlementState;
  /** A session left `ended` or `processing`; processing resumes from here. */
  resumeSessionId: string | null;
  initialRoute: 'Tabs' | 'Onboarding';
  /** Under-18 accounts land on the workload surface, not Home. */
  initialTab: 'HomeTab' | 'LoadTab';
}

function readEntitlement(repos: Repos, now: number): EntitlementState {
  const fallback: EntitlementState = {
    entitlement: 'free',
    monthKey: monthKey(now),
    analysedCount: 0,
  };
  const raw = repos.settings.get(ENTITLEMENT_KEY);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<EntitlementState>;
    return {
      entitlement: parsed.entitlement === 'pro' ? 'pro' : 'free',
      monthKey: typeof parsed.monthKey === 'string' ? parsed.monthKey : fallback.monthKey,
      analysedCount: typeof parsed.analysedCount === 'number' ? parsed.analysedCount : 0,
    };
  } catch {
    // A corrupt setting must not stop the app booting.
    return fallback;
  }
}

export function runBoot({
  repos,
  clock = systemClock,
}: {
  repos: Repos;
  clock?: Clock;
}): BootResult {
  const now = clock.now();

  // A crash during a spell leaves a session `armed` or `recording`. Close those
  // — the footage is kept, the session is not left pretending to be live.
  repos.sessions.markOrphansAbandoned();

  // Anything `ended` or `processing` still owes the bowler its analysis.
  const resumable = repos.sessions.findResumable();

  const entitlement = rolledOver(readEntitlement(repos, now), monthKey(now));
  repos.settings.set(ENTITLEMENT_KEY, JSON.stringify(entitlement));

  const bowler = repos.bowler.get();
  const policy = bowler
    ? juniorPolicy(bowler.yob, bowler.consentState, new Date(now).getFullYear())
    : null;

  return {
    repos,
    bowler,
    entitlement,
    resumeSessionId: resumable[0]?.id ?? null,
    initialRoute: bowler ? 'Tabs' : 'Onboarding',
    initialTab: policy?.landingTab === 'load' ? 'LoadTab' : 'HomeTab',
  };
}
