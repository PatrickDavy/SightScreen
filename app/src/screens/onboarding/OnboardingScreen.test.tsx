/**
 * S01–S07, with the age gate and guardian consent as the load-bearing parts.
 *
 * Those two, the workload ledger and confidence flagging are the handover's
 * ethical floor: retrofitting them later means retrofitting them onto real
 * minors' data, so they are tested as behaviour rather than as markup.
 */
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createMemoryRepos } from '@/data/repos/memoryRepos';
import type { Repos } from '@/data/repos/types';
import { juniorPolicy } from '@/domain/juniorPolicy';
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

  it('sends an under-18 bowler to guardian consent', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));
    await press(view.getByText('Continue'));

    expect(view.getByText('A guardian signs off')).toBeTruthy();
  });

  it('does not ask an adult for a guardian', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 30));
    await press(view.getByText('Continue'));

    // Straight to the profile step.
    expect(view.getByText('Your action, on paper')).toBeTruthy();
  });

  it('says what an under-18 account changes, before it is chosen', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));

    expect(
      view.getByText('Under-18: workload comes first and a guardian is looped in.'),
    ).toBeTruthy();
  });

  it('keeps the guideline figures flagged as illustrative', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    // These are placeholders, not sourced medical guidance, and must say so.
    expect(view.getByText(/illustrative figures/)).toBeTruthy();
  });
});

describe('guardian consent', () => {
  beforeEach(() => jest.clearAllMocks());

  async function reachConsent() {
    const ctx = await setup();
    const { view } = ctx;
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));
    await press(view.getByText('Continue'));
    return ctx;
  }

  it('will not send without an address that could reach a guardian', async () => {
    const { view } = await reachConsent();
    const cta = view.getByTestId('onboarding-cta');
    expect(cta.props.accessibilityState?.disabled).toBe(true);
  });

  it('records consent as pending once the request is sent', async () => {
    const { view, repos } = await reachConsent();

    await type(view, 'guardian-email', 'parent@example.com');
    await press(view.getByText('Send consent request'));

    expect(view.getByText('Pending')).toBeTruthy();
    // The app keeps working meanwhile: capture and workload are not blocked.
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Go to home'));

    const bowler = repos.bowler.get();
    expect(bowler?.consentState).toBe('pending');
    expect(bowler?.guardianEmail).toBe('parent@example.com');
  });

  it('lets a junior proceed without consent, in a restricted state', async () => {
    const { view, repos } = await reachConsent();
    await press(view.getByText('Do this later'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Go to home'));

    const bowler = repos.bowler.get()!;
    expect(bowler.consentState).toBe('none');

    // Sharing and export stay off; capture and workload do not.
    const policy = juniorPolicy(bowler.yob, bowler.consentState, thisYear);
    expect(policy.sharingEnabled).toBe(false);
    expect(policy.exportEnabled).toBe(false);
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

  it('lands an under-18 account on the workload surface instead', async () => {
    const { view } = await setup();
    await press(view.getByText('Get started'));
    await chooseYearOfBirth(view, String(thisYear - 15));
    await press(view.getByText('Continue'));
    await press(view.getByText('Do this later'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Continue'));
    await press(view.getByText('Go to home'));

    // Safety is structure: for a junior, workload is the default surface.
    const reset = dispatch.mock.calls[0]?.[0];
    expect(reset.payload.routes[0].params.screen).toBe('LoadTab');
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
