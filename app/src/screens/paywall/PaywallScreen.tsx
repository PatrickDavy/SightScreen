/**
 * S80 — the paywall.
 *
 * Three rules from the handover's commercial section, all of them visible in
 * this file. Annual price first with the monthly equivalent beneath it, because
 * annual retention runs roughly 2.5x monthly and the way to sell it is obvious
 * value rather than manufactured urgency. **No countdown timer** — there is no
 * clock in this component and there should never be one. And it is never
 * reached during first run: the triggers all require a completed loop.
 *
 * The workload ledger is not behind this and never will be. The screen says so
 * out loud, because a bowler who hits a paywall needs to know that the part
 * that protects their back is not the part being sold.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useCapabilities } from '@/capabilities/context';
import { Button, Card } from '@/components';
import { Prices, PaywallTrigger, annualPerMonth } from '@/domain/paywall';
import type { RootStackParamList } from '@/navigation/types';
import { track } from '@/services/analytics';
import { useAppStore } from '@/store/useAppStore';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

/** What the bowler just ran into, said plainly rather than as a sales line. */
const REASON: Record<PaywallTrigger, string> = {
  fourth_session:
    'That is your fourth analysed session this month. The free tier covers three.',
  locked_metric: 'The full metric breakdown is part of Pro.',
  retest_export: 'Exporting a retest comparison is part of Pro.',
};

const INCLUDED = [
  'Unlimited analysed sessions',
  'The full metric breakdown, not just the one thing',
  'Retest comparisons',
  'Trends over time',
  'The drill library',
];

export function PaywallScreen({ navigation, route }: Props) {
  const trigger = route.params?.trigger ?? 'fourth_session';
  const { billing } = useCapabilities();
  const showToast = useAppStore((s) => s.showToast);
  const [prices, setPrices] = useState<Prices | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    track('paywall_shown', { trigger });
  }, [trigger]);

  useEffect(() => {
    let live = true;
    billing
      .getPrices()
      .then((p) => live && setPrices(p))
      .catch(() => live && setPrices(null))
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, [billing]);

  const buy = async (plan: 'annual' | 'monthly') => {
    setBusy(true);
    try {
      const bought = await billing.purchase(plan);
      if (bought) {
        showToast('Subscribed. Everything is unlocked.', 'good');
        navigation.goBack();
        return;
      }
      showToast('That did not go through. You have not been charged.', 'over');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen testID="paywall-screen">
      <ScreenHeader title="Sightscreen Pro" onBack={() => navigation.goBack()} />

      <Text
        style={{
          fontFamily: font.ui,
          fontSize: text.sm,
          lineHeight: text.sm * leading.body,
          color: color.ink2,
        }}
      >
        {REASON[trigger]}
      </Text>

      {/*
        No price is better than a wrong price. Until a billing library is wired
        up (#35) and products exist in Play Console (#41), there is nothing
        truthful to show, and the screen says so instead of inventing a figure.
      */}
      {prices ? (
        <Card>
          <View style={{ gap: sp[1] }}>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 34,
                lineHeight: 34 * leading.tight,
                color: color.ink,
              }}
            >
              {prices.annual} a year
            </Text>
            <MonoNote>{annualPerMonth(prices).toUpperCase()}</MonoNote>
          </View>
          <Button
            full
            size="lg"
            disabled={busy}
            onPress={() => buy('annual')}
            testID="buy-annual"
          >
            Subscribe yearly
          </Button>
          <Button
            variant="ghost"
            full
            disabled={busy}
            onPress={() => buy('monthly')}
            testID="buy-monthly"
          >
            Or {prices.monthly} a month
          </Button>
        </Card>
      ) : loaded ? (
        <Card>
          <Text
            style={{
              fontFamily: font.ui,
              fontSize: text.sm,
              lineHeight: text.sm * leading.body,
              color: color.ink2,
            }}
          >
            Pricing is not available on this device yet, so there is nothing to show you. Nothing
            has been charged and nothing has changed about your account.
          </Text>
        </Card>
      ) : null}

      <Card>
        <View style={{ gap: sp[2] }}>
          {INCLUDED.map((line) => (
            <Text
              key={line}
              style={{
                fontFamily: font.ui,
                fontSize: text.sm,
                lineHeight: text.sm * leading.body,
                color: color.ink,
              }}
            >
              {line}
            </Text>
          ))}
        </View>
      </Card>

      <MonoNote>THE WORKLOAD LEDGER IS FREE · ON EVERY TIER · ALWAYS</MonoNote>

      <Text
        style={{
          fontFamily: font.ui,
          fontSize: text.xs,
          lineHeight: text.xs * leading.body,
          color: color.ink3,
        }}
      >
        Your speed log and the workload ledger stay free and complete. Subscriptions renew until
        you cancel, and you cancel in Play, not here. Cancelling keeps you subscribed until the
        period you paid for runs out.
      </Text>

      <Button variant="ghost" full onPress={() => navigation.goBack()} testID="paywall-not-now">
        Not now
      </Button>
    </Screen>
  );
}
