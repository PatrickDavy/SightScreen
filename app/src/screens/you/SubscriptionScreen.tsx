/**
 * S71 — subscription.
 *
 * Play requires that what you are on, what it costs and how to leave are all
 * findable without a support email. Cancelling happens in Play rather than
 * here, so this says so plainly and does not build a fake cancel button that
 * would only ever open a link.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text } from 'react-native';

import { useCapabilities } from '@/capabilities/context';
import { Badge, Button, Card } from '@/components';
import type { YouStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/useAppStore';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<YouStackParamList, 'Subscription'>;

export function SubscriptionScreen({ navigation }: Props) {
  const { billing } = useCapabilities();
  const entitlement = useAppStore((s) => s.entitlement);
  const showToast = useAppStore((s) => s.showToast);
  const [busy, setBusy] = useState(false);

  const isPro = entitlement?.entitlement === 'pro';
  const used = entitlement?.analysedCount ?? 0;

  const restore = async () => {
    setBusy(true);
    try {
      const restored = await billing.restore();
      showToast(
        restored
          ? 'Subscription restored.'
          : 'No subscription found for this Play account.',
        restored ? 'good' : 'neutral',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen testID="subscription-screen">
      <ScreenHeader title="Subscription" onBack={() => navigation.goBack()} />

      <Card>
        <Badge tone={isPro ? 'inverse' : undefined}>{isPro ? 'Pro' : 'Free'}</Badge>
        <Text
          style={{
            marginTop: sp[2],
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          {isPro
            ? 'Unlimited analysis, the full metric breakdown, retest comparisons, trends and the drill library.'
            : 'Three analysed sessions a month, the complete speed log, and the whole workload ledger.'}
        </Text>
        {!isPro ? <MonoNote>{`${used} ANALYSED THIS MONTH`}</MonoNote> : null}
      </Card>

      <Card>
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          The workload ledger is free on every tier, always. Nothing about your bowling limits
          depends on paying.
        </Text>
      </Card>

      <Card>
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          Subscriptions renew until you cancel. Cancel in the Play Store under Payments and
          subscriptions — cancelling there keeps you subscribed until the period you have already
          paid for runs out. Refunds go through Play.
        </Text>
      </Card>

      <Button variant="secondary" full disabled={busy} onPress={restore} testID="restore-purchases">
        Restore purchases
      </Button>
    </Screen>
  );
}
