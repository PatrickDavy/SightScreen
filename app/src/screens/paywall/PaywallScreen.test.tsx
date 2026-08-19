/**
 * S80 — the paywall.
 *
 * The commercial rules are product rules, not marketing preferences, so they
 * are tested: annual before monthly, no manufactured urgency, and the workload
 * ledger visibly outside the wall. The no-price case matters most — until
 * billing exists there is nothing truthful to show, and showing a plausible
 * number anyway is the failure this suite is here to prevent.
 */
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { createFakeCapabilities } from '@/capabilities/index.fake';
import type { PaywallTrigger, Prices } from '@/domain/paywall';
import { setAnalytics } from '@/services/analytics';
import { renderScreen } from '@/testing/renderScreen';

import { PaywallScreen } from './PaywallScreen';

const goBack = jest.fn();
const navigation = { goBack, navigate: jest.fn() } as never;
const route = (trigger: PaywallTrigger = 'fourth_session') =>
  ({ key: 'Paywall', name: 'Paywall', params: { trigger } }) as never;

const PRICES: Prices = {
  annual: 'NZ$59.99',
  monthly: 'NZ$8.99',
  annualMinorUnits: 5999,
  currencyCode: 'NZD',
};

async function setup(fakes: Parameters<typeof createFakeCapabilities>[0] = {}, trigger?: PaywallTrigger) {
  const purchaseLog: ('annual' | 'monthly')[] = [];
  const capabilities = createFakeCapabilities({ purchaseLog, ...fakes });
  const view = await renderScreen(
    <PaywallScreen navigation={navigation} route={route(trigger)} />,
    { capabilities, navigation: false },
  );
  await waitFor(() => undefined);
  return { view, purchaseLog };
}

describe('when prices are unavailable', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows no price rather than a plausible one', async () => {
    const { view } = await setup();
    await waitFor(() => expect(view.getByText(/Pricing is not available/)).toBeTruthy());
    expect(view.queryByTestId('buy-annual')).toBeNull();
    expect(view.queryByTestId('buy-monthly')).toBeNull();
  });

  it('says nothing has been charged', async () => {
    const { view } = await setup();
    await waitFor(() => expect(view.getByText(/Nothing has been charged/)).toBeTruthy());
  });
});

describe('when prices are available', () => {
  beforeEach(() => jest.clearAllMocks());

  it('leads with the annual price and the monthly equivalent beneath it', async () => {
    const { view } = await setup({ prices: PRICES });
    await waitFor(() => expect(view.getByText('NZ$59.99 a year')).toBeTruthy());
    expect(view.getByText(/NZD 5\.00 A MONTH, BILLED ONCE A YEAR/i)).toBeTruthy();
  });

  it('offers monthly as the quieter option', async () => {
    const { view } = await setup({ prices: PRICES });
    await waitFor(() => expect(view.getByTestId('buy-monthly')).toBeTruthy());
    expect(view.getByText(/Or NZ\$8\.99 a month/)).toBeTruthy();
  });

  it('reports a refused purchase as refused, and does not claim a charge', async () => {
    const { view, purchaseLog } = await setup({ prices: PRICES, purchaseSucceeds: false });
    await waitFor(() => expect(view.getByTestId('buy-annual')).toBeTruthy());

    fireEvent.press(view.getByTestId('buy-annual'));
    await waitFor(() => expect(purchaseLog).toEqual(['annual']));
    expect(goBack).not.toHaveBeenCalled();
  });

  it('closes on a completed purchase', async () => {
    const { view } = await setup({ prices: PRICES, purchaseSucceeds: true });
    await waitFor(() => expect(view.getByTestId('buy-annual')).toBeTruthy());

    fireEvent.press(view.getByTestId('buy-annual'));
    await waitFor(() => expect(goBack).toHaveBeenCalled());
  });
});

describe('the rules the design insists on', () => {
  beforeEach(() => jest.clearAllMocks());

  it('says the workload ledger is free on every tier', async () => {
    const { view } = await setup({ prices: PRICES });
    expect(view.getByText(/THE WORKLOAD LEDGER IS FREE/)).toBeTruthy();
  });

  it('manufactures no urgency — no timer, no countdown, no expiry', async () => {
    const { view } = await setup({ prices: PRICES });
    const rendered = JSON.stringify(view.toJSON());
    expect(rendered).not.toMatch(/countdown|expires|hurry|limited time|offer ends/i);
  });

  it('always offers a way out', async () => {
    const { view } = await setup({ prices: PRICES });
    fireEvent.press(view.getByTestId('paywall-not-now'));
    expect(goBack).toHaveBeenCalled();
  });

  it('says which wall was hit, rather than a generic upsell', async () => {
    const { view } = await setup({ prices: PRICES }, 'locked_metric');
    expect(view.getByText(/full metric breakdown is part of Pro/)).toBeTruthy();
  });
});

describe('instrumentation', () => {
  beforeEach(() => jest.clearAllMocks());

  it('reports which trigger opened it, so conversion can be read per trigger', async () => {
    const events: { event: string; properties?: Record<string, unknown> }[] = [];
    setAnalytics({ track: (event, properties) => events.push({ event, properties }) });

    await setup({ prices: PRICES }, 'retest_export');
    await waitFor(() =>
      expect(events).toContainEqual({
        event: 'paywall_shown',
        properties: { trigger: 'retest_export' },
      }),
    );
    setAnalytics({ track: () => {} });
  });
});
