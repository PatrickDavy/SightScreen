/**
 * S30–S33. Fixtures are built by running the real capture pipeline over a
 * memory repo, so what these screens read is exactly what a real session
 * writes — not a hand-shaped object that happens to satisfy the query.
 */
import { screen } from '@testing-library/react-native';
import React from 'react';

import { createSimulatedEngines } from '@/capabilities/simulatedEngine';
import type { DeliveryObservation } from '@/capabilities/types';
import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { DETERMINANTS } from '@/domain/content/determinants';
import { Bowler } from '@/domain/types';
import { endSession, processSession, startSession } from '@/services/persistSession';
import { renderScreen } from '@/testing/renderScreen';

import { DeliveryScreen } from './DeliveryScreen';
import { ExplainerScreen } from './ExplainerScreen';
import { InsightScreen } from './InsightScreen';
import { ReviewScreen } from './ReviewScreen';

const NOW = new Date('2026-08-17T18:04:00').getTime();
const clock = { now: () => NOW };

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
  getParent: jest.fn(() => ({ navigate: jest.fn() })),
} as never;

const observation = (
  index: number,
  over: Partial<DeliveryObservation> = {},
): DeliveryObservation => ({
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
  ...over,
});

const { inference } = createSimulatedEngines({ processingStepMs: 0 });

/** Runs a full session through the real pipeline and returns its id. */
async function seedSession(
  repos: Repos,
  observations: DeliveryObservation[],
  options: { overrodeChecks?: boolean; simulated?: boolean } = {},
) {
  const { session } = startSession({
    repos,
    bowlerId: bowler.id,
    sessionType: 'net',
    overrodeChecks: options.overrodeChecks ?? false,
    captureFps: 240,
    simulated: options.simulated ?? true,
    clock,
  });
  endSession({
    repos,
    sessionId: session.id,
    bowlerId: bowler.id,
    clipPath: null,
    observations,
    thermalEvents: [],
    captureFps: 240,
    clock,
  });
  await processSession({ repos, sessionId: session.id, inference, clock });
  return session.id;
}

async function setup(
  observations = [observation(1), observation(2), observation(3)],
  options: { overrodeChecks?: boolean } = {},
) {
  const repos = createMemoryRepos();
  repos.bowler.save(bowler);
  const sessionId = await seedSession(repos, observations, options);
  return { repos, sessionId };
}

function route(params: Record<string, unknown>) {
  return { key: 'k', name: 'n', params } as never;
}

describe('S30 session review', () => {
  it('leads with the fastest ball and its error band', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(<ReviewScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });

    expect(screen.getByText('Fastest ball')).toBeTruthy();
    expect(screen.getByText('113')).toBeTruthy();
    // Every measurement carries its uncertainty, and the headline also shows
    // how many frames it was read from.
    expect(screen.getByText('±2.3 km/h · from 26 frames')).toBeTruthy();
    expect(screen.getByText('Average')).toBeTruthy();
    // The band appears on the headline, the average and every delivery row.
    expect(screen.getAllByText(/±2\.3 km\/h/).length).toBeGreaterThan(1);
  });

  it('lists every delivery with its band, marking fastest and slowest', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(<ReviewScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });

    expect(screen.getByText('111 ±2.3 km/h')).toBeTruthy();
    expect(screen.getByText('112 ±2.3 km/h')).toBeTruthy();
    expect(screen.getByText('113 ±2.3 km/h')).toBeTruthy();
    expect(screen.getByText('Fastest')).toBeTruthy();
    expect(screen.getByText('Slowest')).toBeTruthy();
  });

  it('keeps a low-confidence delivery in the list, marked', async () => {
    const { repos, sessionId } = await setup([
      observation(1),
      observation(2, { engineConfidence: 'low' }),
      observation(3),
    ]);
    await renderScreen(<ReviewScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });

    // Marked, not silently included — and not hidden either.
    expect(screen.getByText('Low conf')).toBeTruthy();
    expect(screen.getByText('112 ±2.3 km/h')).toBeTruthy();
    expect(
      screen.getByText(/Low-confidence deliveries stay visible but sit outside your trend/),
    ).toBeTruthy();
  });

  it('shows the one thing to change as a single card', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(<ReviewScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });

    expect(screen.getByText('The one thing')).toBeTruthy();
    expect(screen.getByText('Brace your front knee')).toBeTruthy();
    expect(screen.getByText(/km\/h estimated/)).toBeTruthy();
  });

  it('says whether the change since last session clears its own band', async () => {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler);
    // An earlier, slower session to compare against.
    await seedSession(repos, [observation(1, { speedKmh: 104 })]);
    const sessionId = await seedSession(repos, [observation(1, { speedKmh: 118 })]);

    await renderScreen(<ReviewScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });

    expect(screen.getByText(/vs last session/)).toBeTruthy();
  });

  it('says plainly when the speeds were simulated', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(<ReviewScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });
    expect(screen.getByText(/synthesised, not measured from video/)).toBeTruthy();
  });

  it('offers the unit toggle the UK market needs', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(<ReviewScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });
    expect(screen.getByText('mph')).toBeTruthy();
  });
});

describe('S31 delivery detail', () => {
  it('shows the ball speed with its band and frame count', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(
      <DeliveryScreen navigation={navigation} route={route({ sessionId, index: 2 })} />,
      { repos, navigation: false },
    );

    expect(screen.getByText('Delivery 2')).toBeTruthy();
    expect(screen.getByText('Ball speed')).toBeTruthy();
    expect(screen.getByText('±2.3 km/h · from 26 frames')).toBeTruthy();
  });

  it('shows every determinant measured at release, with its reference', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(
      <DeliveryScreen navigation={navigation} route={route({ sessionId, index: 1 })} />,
      { repos, navigation: false },
    );

    for (const determinant of Object.values(DETERMINANTS)) {
      expect(screen.getByText(determinant.name)).toBeTruthy();
      expect(screen.getByText(determinant.ref)).toBeTruthy();
    }
  });

  it('marks a confident delivery as such', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(
      <DeliveryScreen navigation={navigation} route={route({ sessionId, index: 1 })} />,
      { repos, navigation: false },
    );
    expect(screen.getByText('Confident')).toBeTruthy();
  });

  it('explains what a low-confidence flag means for the bowler', async () => {
    const { repos, sessionId } = await setup([observation(1, { engineConfidence: 'low' })]);
    await renderScreen(
      <DeliveryScreen navigation={navigation} route={route({ sessionId, index: 1 })} />,
      { repos, navigation: false },
    );

    expect(screen.getByText('Low confidence')).toBeTruthy();
    expect(screen.getByText(/sits outside your trend and did not feed the insight/)).toBeTruthy();
  });
});

describe('S32 metric explainer', () => {
  it('shows all five sections, limitations included', async () => {
    const { repos } = await setup();
    await renderScreen(
      <ExplainerScreen navigation={navigation} route={route({ determinantKey: 'knee' })} />,
      { repos, navigation: false },
    );

    expect(screen.getByText('What it is')).toBeTruthy();
    expect(screen.getByText('Why it links to speed')).toBeTruthy();
    expect(screen.getByText("How it's measured here")).toBeTruthy();
    // The limitations are a product surface, not a buried disclaimer.
    expect(screen.getByText('Limitations')).toBeTruthy();
    expect(screen.getByText('Research')).toBeTruthy();
    expect(screen.getByText(/Portus et al\. \(2004\)/)).toBeTruthy();
  });

  it('shows the reference band without pretending it is a measurement', async () => {
    const { repos } = await setup();
    await renderScreen(
      <ExplainerScreen navigation={navigation} route={route({ determinantKey: 'knee' })} />,
      { repos, navigation: false },
    );
    expect(screen.getByText('150–180 °')).toBeTruthy();
  });
});

describe('S33 the one insight', () => {
  it('gives one cue, the gain available and why it was chosen', async () => {
    const { repos, sessionId } = await setup();
    await renderScreen(<InsightScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });

    expect(screen.getByText('Brace your front knee')).toBeTruthy();
    expect(screen.getByText('Why this one')).toBeTruthy();
    // Two limiters were close, so it says why this one came first.
    expect(screen.getByText(/safer and easier to change/)).toBeTruthy();
    expect(screen.getByText('Start the drill')).toBeTruthy();
  });

  it('counts only the confident deliveries it drew from', async () => {
    const { repos, sessionId } = await setup([
      observation(1),
      observation(2, { engineConfidence: 'low' }),
      observation(3),
    ]);
    await renderScreen(<InsightScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });
    expect(screen.getByText(/Chosen from 2 deliveries/)).toBeTruthy();
  });

  it('says there is no insight rather than inventing one', async () => {
    const { repos, sessionId } = await setup([observation(1), observation(2)], {
      overrodeChecks: true,
    });
    await renderScreen(<InsightScreen navigation={navigation} route={route({ sessionId })} />, {
      repos,
      navigation: false,
    });
    expect(screen.getByText(/every delivery was low-confidence/)).toBeTruthy();
  });
});
