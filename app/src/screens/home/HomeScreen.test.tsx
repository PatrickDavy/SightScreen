/**
 * S10 and the improve loop. The load-bearing assertion here is the card order:
 * for an under-18 account workload comes first and pace second, which is the
 * flow spec's junior rule made visible.
 */
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createSimulatedEngines } from '@/capabilities/simulatedEngine';
import type { DeliveryObservation } from '@/capabilities/types';
import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { isoDate, systemClock } from '@/domain/clock';
import { newId } from '@/domain/ids';
import { Bowler } from '@/domain/types';
import { WEIGHTING } from '@/domain/workload';
import { endSession, processSession, startSession } from '@/services/persistSession';
import { renderScreen } from '@/testing/renderScreen';

import { DrillScreen } from '@/screens/improve/DrillScreen';
import { ImproveScreen } from '@/screens/improve/ImproveScreen';

import { HistoryScreen } from './HistoryScreen';
import { HomeScreen } from './HomeScreen';

const navigate = jest.fn();
const rootNavigate = jest.fn();
const navigation = {
  navigate,
  goBack: jest.fn(),
  // These screens address the root navigator by id rather than by walking
  // parents, so the double is a plain object rather than a whole tree.
  getParent: () => ({ navigate: rootNavigate }),
} as never;
const route = (params?: Record<string, unknown>) =>
  ({ key: 'k', name: 'n', params }) as never;

const flush = () => waitFor(() => undefined);
type View = Awaited<ReturnType<typeof renderScreen>>;

async function press(element: ReturnType<View['getByText']>) {
  fireEvent.press(element);
  await flush();
}

const bowler = (yob: number): Bowler => ({
  id: 'b1',
  yob,
  arm: 'right',
  type: 'Pace',
  heightCm: 178,
  armSpanCm: 183,
  targetSpeedKmh: 130,
  fix: null,
  unit: 'km/h',
  guardianEmail: null,
  consentState: 'none',
});

const observation = (index: number): DeliveryObservation => ({
  index,
  atMs: index * 3800,
  speedKmh: 110 + index,
  speedBandKmh: 2.3,
  engineConfidence: 'ok',
  frameCount: 26,
  events: { bfc: 0.22, ffc: 0.46, release: 0.58 },
  clipPath: null,
  metrics: [
    { key: 'knee', value: 148, bandValue: 5 },
    { key: 'runup', value: 5.2, bandValue: 0.3 },
    { key: 'delay', value: 0.14, bandValue: 0.02 },
    { key: 'trunk', value: 38, bandValue: 6 },
  ],
});

const { inference } = createSimulatedEngines({ processingStepMs: 0 });

async function seedSession(repos: Repos) {
  const { session } = startSession({
    repos,
    bowlerId: 'b1',
    sessionType: 'net',
    overrodeChecks: false,
    captureFps: 240,
    simulated: true,
  });
  endSession({
    repos,
    sessionId: session.id,
    bowlerId: 'b1',
    clipPath: null,
    observations: [observation(1), observation(2), observation(3)],
    thermalEvents: [],
    captureFps: 240,
  });
  await processSession({ repos, sessionId: session.id, inference });
  return session.id;
}

function addLoad(repos: Repos, overs: number) {
  const now = systemClock.now();
  repos.workload.insert({
    id: newId('wl', now),
    bowlerId: 'b1',
    date: isoDate(now),
    deliveries: overs * 6,
    source: 'manual',
    weighting: WEIGHTING.net,
    sessionId: null,
  });
}

async function setupHome(yob = 1996, seed?: (repos: Repos) => Promise<unknown> | void) {
  const repos = createMemoryRepos();
  repos.bowler.save(bowler(yob));
  await seed?.(repos);
  const view = await renderScreen(<HomeScreen navigation={navigation} route={route()} />, {
    repos,
    navigation: false,
  });
  await flush();
  return { view, repos };
}

const thisYear = new Date(systemClock.now()).getFullYear();

describe('S10 home', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows what a first session will produce rather than an empty shrug', async () => {
    const { view } = await setupHome();
    expect(view.getByText('Your first session is one spell away')).toBeTruthy();
    expect(view.getByText('Bowl a session')).toBeTruthy();
  });

  it('leads with current pace and its band once there is a session', async () => {
    const { view } = await setupHome(1996, seedSession);
    expect(view.getByText('Current pace')).toBeTruthy();
    // Once in the headline, once on its row in recent sessions.
    expect(view.getAllByText('113').length).toBeGreaterThan(0);
    expect(view.getAllByText(/±2\.3 km\/h/).length).toBeGreaterThan(0);
  });

  it('puts pace before workload for an adult', async () => {
    const { view } = await setupHome(1996, async (r) => {
      await seedSession(r);
      addLoad(r, 6);
    });

    const pace = view.getByText('Current pace');
    const load = view.getByText('This week');
    const order = view.getAllByText(/Current pace|This week/).map((n) => n.props.children);
    expect(pace).toBeTruthy();
    expect(load).toBeTruthy();
    expect(order[0]).toBe('Current pace');
  });

  it('puts workload before pace for an under-18 account', async () => {
    const { view } = await setupHome(thisYear - 15, async (r) => {
      await seedSession(r);
      addLoad(r, 6);
    });

    // Safety first, structurally — not a different colour on the same layout.
    const order = view.getAllByText(/Current pace|This week/).map((n) => n.props.children);
    expect(order[0]).toBe('This week');
  });

  it('badges an under-18 account with its age band', async () => {
    const { view } = await setupHome(thisYear - 15);
    expect(view.getByText('U17 account')).toBeTruthy();
  });

  it('points at the next drill once there is an insight', async () => {
    const { view } = await setupHome(1996, seedSession);
    expect(view.getByText('Brace your front knee, then retest')).toBeTruthy();
  });

  it('says when the pace on show was simulated', async () => {
    const { view } = await setupHome(1996, seedSession);
    expect(view.getByText(/Simulated analysis/)).toBeTruthy();
  });

  it('lists recent sessions and opens their review', async () => {
    const { view, repos } = await setupHome(1996, seedSession);
    const sessionId = repos.sessions.listSummaries()[0]!.session.id;

    await press(view.getByText('Net session'));
    expect(navigate).toHaveBeenCalledWith('Review', { sessionId });
  });
});

describe('S11 history', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists every session with its fastest ball and band', async () => {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler(1996));
    await seedSession(repos);

    const view = await renderScreen(
      <HistoryScreen navigation={navigation} route={route()} />,
      { repos, navigation: false },
    );
    await flush();

    expect(view.getByText('Net session')).toBeTruthy();
    expect(view.getByText(/±2\.3 km\/h/)).toBeTruthy();
  });
});

describe('S40 improve', () => {
  beforeEach(() => jest.clearAllMocks());

  async function setupImprove(seed = true) {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler(1996));
    if (seed) await seedSession(repos);
    const view = await renderScreen(
      <ImproveScreen navigation={navigation} route={route()} />,
      { repos, navigation: false },
    );
    await flush();
    return { view, repos };
  }

  it('explains that a session comes first when there is nothing to work on', async () => {
    const { view } = await setupImprove(false);
    expect(view.getByText('A session comes first')).toBeTruthy();
  });

  it('shows one focus, with why it was chosen', async () => {
    const { view } = await setupImprove();
    expect(view.getByText('Current focus')).toBeTruthy();
    expect(view.getByText('Brace your front knee')).toBeTruthy();
    expect(view.getByText(/safer and easier to change/)).toBeTruthy();
  });

  it('closes the loop by pre-configuring a drill check', async () => {
    const { view } = await setupImprove();
    await press(view.getByText('Retest — bowl a drill check'));
    // Not a normal spell the bowler hopes to compare against.
    expect(rootNavigate).toHaveBeenCalledWith('Capture', { type: 'drill' });
  });
});

describe('S41 drill detail', () => {
  beforeEach(() => jest.clearAllMocks());

  async function setupDrill() {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler(1996));
    const view = await renderScreen(
      <DrillScreen navigation={navigation} route={route({ drillId: 'brace' })} />,
      { repos, navigation: false },
    );
    await flush();
    return { view };
  }

  it('gives the cues, the reps and what should feel different', async () => {
    const { view } = await setupDrill();

    expect(view.getByText('Front-leg brace')).toBeTruthy();
    expect(view.getByText('Land heel-first, toes to the sky')).toBeTruthy();
    expect(view.getByText('3 × 6 balls, short run')).toBeTruthy();
    // The part most drill libraries leave out.
    expect(view.getByText('What should feel different')).toBeTruthy();
    expect(view.getByText(/The front leg lands like a pole, not a spring/)).toBeTruthy();
  });

  it('ends by setting up the retest', async () => {
    const { view } = await setupDrill();
    await press(view.getByText('Retest this in your next session'));
    expect(rootNavigate).toHaveBeenCalledWith('Capture', { type: 'drill' });
  });
});
