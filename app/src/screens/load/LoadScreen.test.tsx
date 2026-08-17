/**
 * S50 and S52. The ledger is part of the handover's ethical floor, so what is
 * asserted here is that it counts honestly, says which band it is judging
 * against, keeps the illustrative flag visible, and is never gated.
 */
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { isoDate, systemClock } from '@/domain/clock';
import { newId } from '@/domain/ids';
import { Bowler, SessionType } from '@/domain/types';
import { WEIGHTING } from '@/domain/workload';
import { renderScreen } from '@/testing/renderScreen';

import { LoadScreen } from './LoadScreen';
import { RestScreen } from './RestScreen';

const navigate = jest.fn();
const navigation = { navigate, goBack: jest.fn() } as never;
const route = { key: 'k', name: 'n', params: undefined } as never;

type View = Awaited<ReturnType<typeof renderScreen>>;

const flush = () => waitFor(() => undefined);

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

/** Adds `overs` bowled `daysAgo`, at the given weighting. */
function addLoad(repos: Repos, overs: number, daysAgo: number, type: SessionType = 'net') {
  const when = systemClock.now() - daysAgo * 24 * 60 * 60 * 1000;
  repos.workload.insert({
    id: newId('wl', when),
    bowlerId: 'b1',
    date: isoDate(when),
    deliveries: overs * 6,
    source: 'captured',
    weighting: WEIGHTING[type],
    sessionId: `s_${daysAgo}`,
  });
}

async function setup(yob = 1996, seed?: (repos: Repos) => void) {
  const repos = createMemoryRepos();
  repos.bowler.save(bowler(yob));
  seed?.(repos);
  const view = await renderScreen(<LoadScreen navigation={navigation} route={route} />, {
    repos,
    navigation: false,
  });
  await flush();
  return { view, repos };
}

describe('S50 the workload ledger', () => {
  beforeEach(() => jest.clearAllMocks());

  it('offers manual entry rather than apologising when nothing is logged', async () => {
    const { view } = await setup();
    expect(view.getByText('Nothing bowled yet this week')).toBeTruthy();
    expect(view.getByText('Add an uncaptured session')).toBeTruthy();
  });

  it('says the ledger is free forever', async () => {
    const { view } = await setup();
    // Safety behind a paywall would be indefensible, so this is not conditional.
    expect(
      view.getByText('The ledger is free forever. Safety never sits behind a paywall.'),
    ).toBeTruthy();
  });

  it('reads good to bowl when well inside the guideline', async () => {
    const { view } = await setup(1996, (r) => addLoad(r, 6, 1));
    expect(view.getByText('Good to bowl')).toBeTruthy();
  });

  it('reads bowl light as the week approaches the limit', async () => {
    // Senior guideline is 36 overs; 30 is past the 80% mark.
    const { view } = await setup(1996, (r) => {
      addLoad(r, 15, 1);
      addLoad(r, 15, 2);
    });
    expect(view.getByText('Bowl light')).toBeTruthy();
  });

  it('reads rest today once the guideline is reached', async () => {
    const { view } = await setup(1996, (r) => {
      addLoad(r, 20, 1);
      addLoad(r, 20, 2);
    });
    expect(view.getByText('Rest today')).toBeTruthy();
  });

  it('judges a junior against the under-17 band, flagged as illustrative', async () => {
    const thisYear = new Date(systemClock.now()).getFullYear();
    const { view } = await setup(thisYear - 16, (r) => addLoad(r, 8, 1));

    // The figures are placeholders, not sourced medical guidance.
    expect(view.getByText('U17 guideline · illustrative figures')).toBeTruthy();
  });

  it('counts a manual entry into the ledger with its weighting', async () => {
    const { view, repos } = await setup(1996, (r) => addLoad(r, 4, 1));

    await press(view.getByText('Add an uncaptured session'));
    await press(view.getByText('Match'));
    await press(view.getByText('Add it'));

    const manual = repos.workload.all().find((e) => e.source === 'manual');
    expect(manual).toMatchObject({ deliveries: 24, weighting: WEIGHTING.match });
  });

  it('explains why hand-entered sessions matter', async () => {
    const { view } = await setup(1996, (r) => addLoad(r, 4, 1));
    expect(
      view.getByText(/a ledger that only counts filmed balls is worse than useless/),
    ).toBeTruthy();
  });

  it('leads to the rest guidance rather than just showing a colour', async () => {
    const { view } = await setup(1996, (r) => addLoad(r, 4, 1));
    await press(view.getByText('Good to bowl'));
    expect(navigate).toHaveBeenCalledWith('Rest');
  });
});

describe('S52 rest guidance', () => {
  beforeEach(() => jest.clearAllMocks());

  async function setupRest(yob = 1996) {
    const repos = createMemoryRepos();
    repos.bowler.save(bowler(yob));
    addLoad(repos, 14, 0);
    addLoad(repos, 14, 1);
    const view = await renderScreen(<RestScreen navigation={navigation} route={route} />, {
      repos,
      navigation: false,
    });
    await flush();
    return { view, repos };
  }

  it('explains the reason against the seven-day peak', async () => {
    const { view } = await setupRest();
    expect(view.getByText(/rolling seven-day load/)).toBeTruthy();
    expect(view.getByText(/injury risk to the seven-day peak/)).toBeTruthy();
  });

  it('offers work that still serves the current focus', async () => {
    const { view } = await setupRest();
    expect(view.getByText('Still useful today')).toBeTruthy();
    expect(view.getByText('Front-leg brace, no ball')).toBeTruthy();
    expect(view.getByText('Run-up rhythm only')).toBeTruthy();
  });

  it('advises without blocking, and says so', async () => {
    const { view } = await setupRest();
    // Never scolds, never blocks: the app advises, the human decides.
    expect(view.getByText(/The app advises, you decide. Nothing is blocked/)).toBeTruthy();
  });

  it('keeps the illustrative flag on the figures it is judging against', async () => {
    const { view } = await setupRest();
    expect(view.getByText(/illustrative figures/)).toBeTruthy();
  });
});
