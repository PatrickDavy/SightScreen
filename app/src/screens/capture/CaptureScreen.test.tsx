/**
 * The capture spine end to end: S20 → S26, through the real screen, the real
 * reducer and the real write pipeline, with only the device faked.
 *
 * This is the most important test in the app. Capture is the flow whose
 * failures cannot be undone — a lost spell cannot be re-bowled — so what is
 * asserted here is mostly not the markup but what ends up in the database.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createFakeCapabilities, type FakeOptions } from '@/capabilities/index.fake';
import type { CueName } from '@/capabilities/types';
import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { Bowler, SessionType } from '@/domain/types';
import { WEIGHTING } from '@/domain/workload';
import { renderScreen } from '@/testing/renderScreen';

import { CaptureScreen } from './CaptureScreen';

const bowler: Bowler = {
  id: 'b1',
  yob: 1996,
  arm: 'right',
  type: 'Pace',
  heightCm: 178,
  armSpanCm: 183,
  targetSpeedKmh: 130,
  fix: null,
  unit: 'km/h',
  guardianEmail: null,
  consentState: 'none',
};

const navigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
} as unknown as Parameters<typeof CaptureScreen>[0]['navigation'];

/**
 * React 19 does not flush a state update synchronously, so every interaction
 * needs settling before the tree can be asserted on. This goes through
 * `waitFor` rather than a bare `act`: the library keeps its own act scope open
 * across an async render, and nesting one inside it is unsupported.
 */
async function flush() {
  await waitFor(() => undefined);
}

/** Whatever the library's queries hand back, without naming its internals. */
type Element = ReturnType<typeof screen.getByText>;

async function press(element: Element) {
  fireEvent.press(element);
  await flush();
}

/** One tick per DELIVERY_MS, so `advance(3)` is three deliveries. */
const DELIVERY_MS = 1000;

async function advanceDeliveries(count: number) {
  jest.advanceTimersByTime(count * DELIVERY_MS);
  await flush();
}

async function advanceMs(ms: number) {
  jest.advanceTimersByTime(ms);
  await flush();
}

interface SetupOptions {
  repos?: Repos;
  calibrated?: boolean;
  routeParams?: { type?: SessionType; resumeSessionId?: string };
  fakes?: FakeOptions;
}

async function setup(options: SetupOptions = {}) {
  const repos = options.repos ?? createMemoryRepos();
  repos.bowler.save(bowler);
  if (options.calibrated) repos.settings.set('lastCalibrationId', 'set');

  const cueLog: CueName[] = [];
  const speechLog: string[] = [];
  const capabilities = createFakeCapabilities({
    // A whole second per delivery, so a stray timer advance inside waitFor
    // cannot smuggle in an extra ball and make a count assertion flaky.
    intervalMs: DELIVERY_MS,
    problemAtMs: 10_000_000,
    resolveAtMs: 20_000_000,
    processingStepMs: 10,
    cueLog,
    speechLog,
    ...options.fakes,
  });

  const route = {
    key: 'Capture',
    name: 'Capture',
    params: options.routeParams ?? {},
  } as unknown as Parameters<typeof CaptureScreen>[0]['route'];

  const rendered = await renderScreen(
    <CaptureScreen navigation={navigation} route={route} />,
    { repos, capabilities, navigation: false },
  );
  // Let the battery and camera probes settle.
  await flush();

  return { ...rendered, repos, cueLog, speechLog };
}

/** Walks S20 → S23 for a venue that is already calibrated. */
async function reachReady(options: SetupOptions = {}) {
  const ctx = await setup({ calibrated: true, ...options });
  await press(screen.getByText('Continue')); // S20 → S21
  await press(screen.getByText('Continue')); // S21 → S23
  return ctx;
}

/** Arms, skips the countdown, records `deliveries` balls, then stops. */
async function bowlSpell(deliveries: number, options: SetupOptions = {}) {
  const ctx = await reachReady(options);
  await press(screen.getByTestId('arm-button'));
  await press(screen.getByLabelText(/Tap to start now/));
  await advanceDeliveries(deliveries);
  await press(screen.getByLabelText(/Tap anywhere to end/));
  return ctx;
}

async function processSpell() {
  await press(screen.getByTestId('process-button'));
  await advanceMs(2000);
}

describe('capture spine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterEach(() => jest.useRealTimers());

  it('opens on the session type picker with the three kinds of spell', async () => {
    await setup({ calibrated: true });
    expect(screen.getByText('Net session')).toBeTruthy();
    expect(screen.getByText('Match spell')).toBeTruthy();
    expect(screen.getByText('Drill check')).toBeTruthy();
  });

  it('shows the placement checks, passing when the setup is sound', async () => {
    await setup({ calibrated: true });
    await press(screen.getByText('Continue'));

    expect(screen.getByLabelText('Landscape orientation: ready')).toBeTruthy();
    expect(screen.getByLabelText('Device level: ready')).toBeTruthy();
    expect(screen.getByLabelText('Crease and stumps visible: ready')).toBeTruthy();
    expect(screen.getByLabelText('Light for 240 fps: ready')).toBeTruthy();
  });

  it('tells a tilted phone exactly what to do about it', async () => {
    await setup({ calibrated: true, fakes: { tiltDeg: 11 } });
    await press(screen.getByText('Continue'));

    expect(screen.getByLabelText('Device level: needs attention')).toBeTruthy();
    // Blame the setup, never the bowler, and say what to do about it.
    expect(screen.getByText('Tilt it back to level, or speeds will read low.')).toBeTruthy();
    expect(
      screen.getByText(/affected deliveries get marked low-confidence rather than hidden/),
    ).toBeTruthy();
  });

  it('offers calibration when the venue is not yet known', async () => {
    await setup({ calibrated: false });
    await press(screen.getByText('Continue'));

    expect(screen.getByText('Mark crease and stumps')).toBeTruthy();
    expect(screen.getByText('Continue anyway')).toBeTruthy();
  });

  it('takes two taps to calibrate, and says which is which', async () => {
    await setup({ calibrated: false });
    await press(screen.getByText('Continue'));
    await press(screen.getByText('Mark crease and stumps'));

    const target = screen.getByTestId('calibration-target');
    fireEvent(target, 'layout', { nativeEvent: { layout: { width: 300, height: 300 } } });
    await flush();

    expect(screen.getByText('TAP THE POPPING CREASE LINE')).toBeTruthy();

    fireEvent.press(target, { nativeEvent: { locationX: 150, locationY: 220 } });
    await flush();
    expect(screen.getByText('NOW TAP THE BASE OF THE STUMPS')).toBeTruthy();

    fireEvent.press(target, { nativeEvent: { locationX: 158, locationY: 130 } });
    await flush();
    expect(screen.getByText('PITCH GEOMETRY LOCKED · 22 YD · 1.22 M CREASE')).toBeTruthy();
  });

  it('shows the capacity pre-flight before arming', async () => {
    await reachReady();
    expect(screen.getByText(/Room for about \d+ deliveries at 62% battery/)).toBeTruthy();
    expect(screen.getByText('Arm and walk away')).toBeTruthy();
  });

  it('counts deliveries on the recording screen and sounds each one', async () => {
    const { cueLog } = await reachReady();

    await press(screen.getByTestId('arm-button'));
    await press(screen.getByLabelText(/Tap to start now/));
    await advanceDeliveries(3);

    expect(screen.getByText('RECORDING')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    // Audio is the primary channel: it works when the screen does not.
    expect(cueLog.filter((c) => c === 'delivery')).toHaveLength(3);
  });

  it('announces a problem aloud as well as turning the screen amber', async () => {
    const { cueLog, speechLog } = await reachReady({
      fakes: { problemAtMs: 2500, resolveAtMs: 10_000_000 },
    });

    await press(screen.getByTestId('arm-button'));
    await press(screen.getByLabelText(/Tap to start now/));
    await advanceMs(3000);

    expect(speechLog).toContain("Can't see the bowler");
    expect(cueLog).toContain('alert');
    expect(screen.getByText(/SAID ALOUD TOO/)).toBeTruthy();
  });

  it('summarises the spell the moment the bowler picks the phone up', async () => {
    await bowlSpell(4);

    expect(screen.getByText('Deliveries')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
    // Never a bare number: fastest and average both carry a band.
    expect(screen.getByText('Fastest')).toBeTruthy();
    expect(screen.getByText('Average')).toBeTruthy();
    expect(screen.getByText(/Added to workload: .* overs · net weighting/)).toBeTruthy();
  });

  it('says plainly that simulated speeds are not measurements', async () => {
    await bowlSpell(2);
    expect(screen.getByText(/these speeds are synthesised, not measured from video/)).toBeTruthy();
  });

  it('adds the spell to the workload ledger before any analysis runs', async () => {
    const { repos } = await bowlSpell(6);

    const entries = repos.workload.all();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      deliveries: 6,
      source: 'captured',
      weighting: WEIGHTING.net,
    });
    // A bowled spell counts even though nothing has been analysed yet.
    expect(repos.deliveries.count(entries[0]!.sessionId!)).toBe(0);
  });

  it('weights a match spell heavier than a net session', async () => {
    const { repos } = await bowlSpell(6, { routeParams: { type: 'match' } });
    expect(repos.workload.all()[0]?.weighting).toBe(WEIGHTING.match);
  });

  it('offers another go, and counts nothing, when no delivery was detected', async () => {
    const { repos } = await bowlSpell(0);

    expect(screen.getByText(/No deliveries detected/)).toBeTruthy();
    expect(screen.getByText(/Nothing was counted against your workload/)).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
    expect(repos.workload.all()).toHaveLength(0);
  });

  it('processes the session into deliveries, an insight and a review', async () => {
    const { repos, cueLog } = await bowlSpell(5);
    await processSpell();

    const summaries = repos.sessions.listSummaries();
    expect(summaries).toHaveLength(1);
    const session = summaries[0]!.session;

    expect(session.status).toBe('complete');
    expect(session.simulated).toBe(true);
    expect(repos.deliveries.listForSession(session.id)).toHaveLength(5);

    // The one thing to change — never a list.
    const insight = repos.insights.forSession(session.id);
    expect(insight?.determinantKey).toBe('knee');
    expect(insight?.drillId).toBe('brace');

    expect(cueLog).toContain('done');
    expect(navigation.navigate).toHaveBeenCalledWith('Tabs', {
      screen: 'HomeTab',
      params: { screen: 'Review', params: { sessionId: session.id } },
    });
  });

  it('stores every delivery with a band and a frame count', async () => {
    const { repos } = await bowlSpell(3);
    await processSpell();

    const session = repos.sessions.listSummaries()[0]!.session;
    for (const delivery of repos.deliveries.listForSession(session.id)) {
      expect(delivery.speedBandKmh).toBeGreaterThan(0);
      expect(delivery.frameCount).toBeGreaterThan(0);
    }
  });

  it('marks every delivery low-confidence when a check was overridden', async () => {
    // A phone leaning well past the 3° tolerance.
    const { repos } = await bowlSpell(3, { fakes: { tiltDeg: 12 } });
    await processSpell();

    const session = repos.sessions.listSummaries()[0]!.session;
    expect(session.lowConfOverride).toBe(true);

    const deliveries = repos.deliveries.listForSession(session.id);
    expect(deliveries.length).toBeGreaterThan(0);
    // Overriding is allowed; hiding the consequence is not.
    expect(deliveries.every((d) => d.confidence === 'low')).toBe(true);

    // They stay visible in the log, but never feed an insight or a trend.
    expect(repos.insights.forSession(session.id)).toBeNull();
    expect(repos.deliveries.trendSpeeds()).toEqual([]);
  });

  it('warns before arming that the session will be low-confidence', async () => {
    await setup({ calibrated: true, fakes: { tiltDeg: 12 } });
    await press(screen.getByText('Continue'));
    await press(screen.getByText('Continue'));
    expect(screen.getByText('Low confidence')).toBeTruthy();
  });

  it('resumes an interrupted analysis rather than losing the spell', async () => {
    const { repos } = await bowlSpell(4);
    const session = repos.sessions.listSummaries()[0]!.session;
    expect(session.status).toBe('ended');

    // Relaunch straight into processing, as boot does after a crash.
    await setup({ repos, routeParams: { resumeSessionId: session.id } });
    await advanceMs(2000);

    expect(repos.sessions.get(session.id)?.status).toBe('complete');
    expect(repos.deliveries.listForSession(session.id)).toHaveLength(4);
    // The ledger was written when recording stopped, and is not counted twice.
    expect(repos.workload.all()).toHaveLength(1);
  });
});
