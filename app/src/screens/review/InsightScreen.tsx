/**
 * S33 — the one thing to change.
 *
 * Explicitly not a list. When two limiters are close the app picks the one that
 * is safer and easier to change, and says why. A bowler cannot act on five
 * technique changes at once, and the research base is small enough to work
 * through one at a time.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';

import { useRepoQuery } from '@/app/ReposProvider';
import { Button, Card, CueCard } from '@/components';
import { DETERMINANTS } from '@/domain/content/determinants';
import { cueFor, gainLabel } from '@/domain/insight';
import type { HomeStackParamList } from '@/navigation/types';
import { color, font, leading, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<HomeStackParamList, 'Insight'>;

export function InsightScreen({ navigation, route }: Props) {
  const { sessionId } = route.params;

  const insight = useRepoQuery((r) => r.insights.forSession(sessionId));
  const okDeliveries = useRepoQuery(
    (r) => r.deliveries.listForSession(sessionId).filter((d) => d.confidence === 'ok').length,
  );

  if (!insight) {
    return (
      <Screen>
        <ScreenHeader title="Back" onBack={() => navigation.goBack()} />
        <MonoNote>
          No insight for this session — every delivery was low-confidence, so there was nothing
          solid enough to draw one from.
        </MonoNote>
      </Screen>
    );
  }

  const determinant = DETERMINANTS[insight.determinantKey];

  return (
    <Screen
      footer={
        <Button
          size="lg"
          full
          icon="play"
          onPress={() =>
            navigation.getParent()?.navigate('ImproveTab', {
              screen: 'Drill',
              params: { drillId: insight.drillId },
            })
          }
        >
          Start the drill
        </Button>
      }
    >
      <ScreenHeader title="The one insight" onBack={() => navigation.goBack()} />

      <CueCard
        cue={cueFor(insight.determinantKey)}
        gain={gainLabel(insight)}
        detail={determinant?.mean}
      />

      <Card title="Why this one">
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          {insight.rationale}
        </Text>
      </Card>

      <MonoNote>
        Chosen from {okDeliveries} deliveries · confidence-weighted · low-confidence balls excluded
      </MonoNote>
    </Screen>
  );
}
