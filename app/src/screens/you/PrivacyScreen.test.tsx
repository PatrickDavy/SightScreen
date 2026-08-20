/**
 * S73 — data and privacy.
 *
 * The export button used to show "Export prepared — measurements as CSV, clips
 * as files" and write nothing at all. These tests exist so that cannot come
 * back: the assertion is not that a toast appeared, it is that files were
 * produced.
 */
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createFakeCapabilities } from '@/capabilities/index.fake';
import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { systemClock } from '@/domain/clock';
import { Bowler, Delivery, Session } from '@/domain/types';
import { ANALYTICS_KEY } from '@/app/boot';
import { analyticsEnabled, setAnalyticsEnabled, track } from '@/services/analytics';
import { setAnalytics } from '@/services/analytics';
import { renderScreen } from '@/testing/renderScreen';
import { useAppStore } from '@/store/useAppStore';

import { PrivacyScreen } from './PrivacyScreen';

const navigation = { goBack: jest.fn(), getParent: jest.fn(() => null) } as never;
const route = { key: 'Privacy', name: 'Privacy', params: undefined } as never;

const thisYear = new Date(systemClock.now()).getFullYear();

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

const session = (): Session => ({
  id: 's1',
  bowlerId: 'b1',
  type: 'net',
  venueId: null,
  startedAt: systemClock.now() - 3_600_000,
  endedAt: systemClock.now(),
  deviceModel: null,
  captureFps: 240,
  scaleUncertainty: null,
  thermalEvents: [],
  calibrationId: null,
  weighting: 1,
  status: 'complete',
  processedCount: 1,
  lowConfOverride: false,
  clipPath: null,
  simulated: true,
});

const delivery = (): Delivery => ({
  id: 'd1',
  sessionId: 's1',
  index: 0,
  speedKmh: 128.4,
  speedBandKmh: 4,
  confidence: 'ok',
  clipPath: null,
  frameCount: 26,
  events: null,
  createdAt: systemClock.now(),
});

function seeded(): Repos {
  const repos = createMemoryRepos();
  repos.bowler.save(bowler(1996));
  repos.sessions.insert(session());
  repos.deliveries.insert(delivery());
  repos.workload.insert({
    id: 'w1',
    bowlerId: 'b1',
    date: '2026-08-19',
    deliveries: 6,
    source: 'captured',
    weighting: 1,
    sessionId: 's1',
  });
  return repos;
}

async function setup(repos: Repos = seeded(), fakeOverrides = {}) {
  const exportLog: { folder: string; names: string[] }[] = [];
  const capabilities = createFakeCapabilities({ exportLog, ...fakeOverrides });
  const view = await renderScreen(<PrivacyScreen navigation={navigation} route={route} />, {
    repos,
    capabilities,
    navigation: false,
  });
  return { view, repos, exportLog };
}

const toasts = () => useAppStore.getState().toasts.map((t) => t.text);

describe('exporting your data', () => {
  beforeEach(() => jest.clearAllMocks());

  it('writes real files rather than claiming it did', async () => {
    const { view, exportLog } = await setup();

    fireEvent.press(view.getByTestId('export-my-data'));
    await waitFor(() => expect(exportLog).toHaveLength(1));

    expect(exportLog[0]?.names).toEqual([
      'README.txt',
      'sessions.csv',
      'deliveries.csv',
      'metrics.csv',
      'workload.csv',
    ]);
  });

  it('names the folder so repeated exports do not collide', async () => {
    const { view, exportLog } = await setup();
    fireEvent.press(view.getByTestId('export-my-data'));
    await waitFor(() => expect(exportLog).toHaveLength(1));
    expect(exportLog[0]?.folder).toMatch(/^sightscreen-export-/);
  });

  it('says what was written, including the counts', async () => {
    const { view, exportLog } = await setup();
    fireEvent.press(view.getByTestId('export-my-data'));
    await waitFor(() => expect(exportLog).toHaveLength(1));
    await waitFor(() => expect(toasts().join(' ')).toMatch(/1 deliveries, 1 sessions/));
  });

  it('says so plainly when the share sheet is unavailable, and still writes', async () => {
    const { view, exportLog } = await setup(seeded(), { sharingAvailable: false });
    fireEvent.press(view.getByTestId('export-my-data'));
    await waitFor(() => expect(exportLog).toHaveLength(1));
    await waitFor(() => expect(toasts().join(' ')).toMatch(/Sharing is unavailable/));
  });

  it('exports an empty account without pretending there was data', async () => {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler(1996));
    const { view, exportLog } = await setup(repos);

    fireEvent.press(view.getByTestId('export-my-data'));
    await waitFor(() => expect(exportLog).toHaveLength(1));
    await waitFor(() => expect(toasts().join(' ')).toMatch(/0 deliveries, 0 sessions/));
  });

  it('stays disabled for an under-18 account created before the gate', async () => {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler(thisYear - 15));
    const { view, exportLog } = await setup(repos);

    fireEvent.press(view.getByTestId('export-my-data'));
    expect(exportLog).toHaveLength(0);
    expect(view.getByText('Export is off for under-18 accounts.')).toBeTruthy();
  });
});

describe('analytics consent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAnalyticsEnabled(true);
  });

  afterAll(() => setAnalyticsEnabled(true));

  it('is on by default, while nothing leaves the device', async () => {
    const { view } = await setup();
    expect(view.getByText('Usage analytics')).toBeTruthy();
    expect(analyticsEnabled()).toBe(true);
  });

  it('says what is collected and what never is', async () => {
    const { view } = await setup();
    expect(view.getByText(/Never your video, never your pose data/)).toBeTruthy();
    expect(view.getByText(/nothing leaves this phone/)).toBeTruthy();
  });

  it('persists an opt-out so it survives a relaunch', async () => {
    const repos = seeded();
    const { view } = await setup(repos);

    fireEvent(view.getByText('Usage analytics'), 'onChange', false);
    await waitFor(() => expect(repos.settings.get(ANALYTICS_KEY)).toBe('off'));
  });

  it('stops events at the gate rather than at each call site', async () => {
    const events: string[] = [];
    setAnalytics({ track: (event) => events.push(event) });

    setAnalyticsEnabled(false);
    track('session_captured');
    expect(events).toEqual([]);

    setAnalyticsEnabled(true);
    track('session_captured');
    expect(events).toEqual(['session_captured']);

    setAnalytics({ track: () => {} });
  });
});
