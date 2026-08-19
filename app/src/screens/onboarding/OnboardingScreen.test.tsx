/**
 * S01–S07, with the age gate as the load-bearing part.
 *
 * The age gate, the workload ledger and confidence flagging are the handover's
 * ethical floor: retrofitting them later means retrofitting them onto real
 * minors' data, so they are tested as behaviour rather than as markup.
 *
 * Guardian consent (S03) is gone, and one test here exists to keep it gone: it
 * asked for a guardian's email and reported a consent request sent, while the
 * app has no networking and sent nothing. A false claim about a child-safety
 * mechanism is worse than an absent one. Reinstating it means building the
 * service first, not restoring the screen.
 *
 * With consent gone, the gate stops rather than diverts: v1 is 18 and over. The
 * tests below check that it stops, that nothing is written when it does, and
 * that a mistyped year is recoverable — a gate that cannot be corrected is a
 * gate that teaches people to lie to it.
 */
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { MINIMUM_AGE } from '@/domain/accountAge';
import { renderScreen } from '@/testing/renderScreen';

import { OnboardingScreen } from './OnboardingScreen';

const dispatch = jest.fn();
const navigate = jest.fn();
const navigation = { dispatch, navigate } as never;
const route = { key: 'Onboarding', name: 'Onboarding', params: undefined } as never;

async function flush() {
  await waitFor(() => undefined);
}

/**
 * Queries are taken from the render that produced them rather than the global
 * `screen`, which points at whichever tree was mounted last and so leaks
 * between tests in a file this long.
 */
type View = Awaited<ReturnType<typeof renderScreen>>;

async function press(element: ReturnType<View['getByText']>) {
  fireEvent.press(element);
  await flush();
}

/**
 * Type into a field and wait for the value to actually commit.
 *
 * Firing the event and moving on is not enough under React 19: the update stays
 * pending, which leaves the tree in a state that stops the next test's render
 * committing at all.
 */
async function type(view: View, testID: string, value: string) {
  fireEvent.changeText(view.getByTestId(testID), value);
  await waitFor(() => expect(view.getByTestId(testID).props.value).toBe(value));
}

async function setup(repos: Repos = createMemoryRepos()) {
  const view = await renderScreen(<OnboardingScreen navigation={navigation} route={route} />, {
    repos,
    navigation: false,
  });
  await flush();
  return { view, repos };
}

/** Picks a year of birth from the Select's bottom sheet. */
async function chooseYearOfBirth(view: View, year: string) {
  await press(view.getByTestId('year-of-birth'));
  await press(view.getByText(year));
}

const thisYear = new Date().getFullYear();

describe('first run', () => {
  beforeEach(() => jest.clearAllMocks());

  it('opens on a single promise, with no carousel', async () => {
    const { view } = await setup();
    expect(view.getByText('One phone video. One thing to change. Bowl quicker.')).toBeTruthy();
    expect(view.getByText('Get started')).toBeTruthy();
  });

  it('does not ask for an account before the first session', async () => {
    const { view } = await setup();
    expect(view.getByText(/No account needed for your first session/)).toBeTruthy();
  });

  it('asks when the bowler was born, not whether they are over 18', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));

    expect(view.getByText('When were you born?')).toBeTruthy();
    expect(view.getByText(/So we can set safe bowling limits/)).toBeTruthy();
  });
});

describe('the age gate', () => {
  beforeEach(() => jest.clearAllMocks());

  it('stops an under-18 bowler rather than letting them through', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));
    await press(view.getByText('Continue'));

    expect(view.getByText('Sightscreen is 18 and over for now')).toBeTruthy();
    expect(view.queryByText('Your action, on paper')).toBeNull();
    // And it never was a diversion to a guardian, which no longer exists.
    expect(view.queryByText('A guardian signs off')).toBeNull();
    expect(view.queryByTestId('guardian-email')).toBeNull();
  });

  it('writes nothing when it turns someone away', async () => {
    const { view, repos } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));
    await press(view.getByText('Continue'));

    expect(repos.bowler.get()).toBeNull();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('lets a mistyped year be corrected rather than dead-ending', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));
    await press(view.getByText('Continue'));

    await press(view.getByText('Change year of birth'));
    expect(view.getByText('When were you born?')).toBeTruthy();

    await chooseYearOfBirth(view, String(thisYear - 30));
    await press(view.getByText('Continue'));
    expect(view.getByText('Your action, on paper')).toBeTruthy();
  });

  it('admits someone turning exactly eighteen', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - MINIMUM_AGE));
    await press(view.getByText('Continue'));

    expect(view.getByText('Your action, on paper')).toBeTruthy();
  });

  it('does not ask an adult for a guardian', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 30));
    await press(view.getByText('Continue'));

    // Straight to the profile step.
    expect(view.getByText('Your action, on paper')).toBeTruthy();
  });

  it('says the account will be refused before the year is committed', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));

    // Told at the point of choosing, not after a form has been filled in.
    expect(view.getByText('Sightscreen is 18 and over for now.')).toBeTruthy();
  });

  it('keeps the guideline figures flagged as illustrative', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    // These are placeholders, not sourced medical guidance, and must say so.
    expect(view.getByText(/illustrative figures/)).toBeTruthy();
  });
});

describe('no guardian consent is claimed', () => {
  beforeEach(() => jest.clearAllMocks());

  async function complete() {
    const ctx = await setup();
    const { view } = ctx;
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 30));
    await press(view.getByText('Continue')); // age → profile
    await press(view.getByText('Continue')); // profile → goals
    await press(view.getByText('Continue')); // goals → permissions
    await press(view.getByText('Continue')); // permissions → setup
    await press(view.getByText('Go to home'));
    return ctx;
  }

  it('never collects a guardian address it cannot send anything to', async () => {
    const { repos } = await complete();
    expect(repos.bowler.get()?.guardianEmail).toBeNull();
  });

  it('never records consent as pending, because nothing was ever requested', async () => {
    const { repos } = await complete();
    expect(repos.bowler.get()?.consentState).toBe('none');
  });

  it('offers no guardian step at any point in the flow', async () => {
    const { view } = await complete();
    expect(view.queryByText('A guardian signs off')).toBeNull();
    expect(view.queryByTestId('guardian-email')).toBeNull();
  });
});

describe('finishing onboarding', () => {
  beforeEach(() => jest.clearAllMocks());

  async function completeAsAdult(startCapture: boolean) {
    const ctx = await setup();
    const { view } = ctx;
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 30));
    await press(view.getByText('Continue')); // age → profile

    await type(view, 'height-cm', '181');
    await type(view, 'arm-span-cm', '186');

    await press(view.getByText('Continue')); // profile → goals
    await press(view.getByText('More pace'));
    await press(view.getByText('Continue')); // goals → permissions
    await press(view.getByText('Continue')); // permissions → setup
    await press(
      view.getByText(startCapture ? 'Bowl your first session' : 'Go to home'),
    );
    return ctx;
  }

  it('saves what the model needs and lands on Home for an adult', async () => {
    const { repos } = await completeAsAdult(false);

    const bowler = repos.bowler.get();
    expect(bowler).toMatchObject({
      yob: thisYear - 30,
      arm: 'right',
      type: 'Pace',
      heightCm: 181,
      armSpanCm: 186,
      fix: 'More pace',
      unit: 'km/h',
      consentState: 'none',
    });

    const reset = dispatch.mock.calls[0]?.[0];
    expect(reset.payload.routes[0].params.screen).toBe('HomeTab');
  });

  it('goes straight into the first capture when asked to', async () => {
    await completeAsAdult(true);
    expect(navigate).toHaveBeenCalledWith('Capture', { type: 'net' });
  });

  it('explains why it asks for arm span', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 30));
    await press(view.getByText('Continue'));

    expect(view.getByText(/it correlates strongly with release speed/)).toBeTruthy();
  });

  it('primes permissions rather than requesting them up front', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 30));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));

    expect(view.getByText("We'll ask when it matters")).toBeTruthy();
    expect(view.getByText('Asked right before your first recording.')).toBeTruthy();
  });
});
