/**
 * S40 — the current focus.
 *
 * This is the intervention half of measure → intervene → verify. It gets its
 * own destination precisely so that analysis does not become the whole product:
 * a bowler who only ever reads numbers has not changed anything.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { useRepoQuery } from '@/app/ReposProvider';
import { Badge, Button, Card } from '@/components';
import { DRILLS } from '@/domain/content/drills';
import { cueFor, gainLabel } from '@/domain/insight';
import { rootNavigationFrom } from '@/navigation/rootNavigation';
import type { ImproveStackParamList } from '@/navigation/types';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { EmptyState } from '@/ui/EmptyState';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { SectionLabel } from '@/ui/SectionLabel';

type Props = NativeStackScreenProps<ImproveStackParamList, 'Improve'>;

export function ImproveScreen({ navigation }: Props) {
  const rootNavigation = rootNavigationFrom(navigation);

  const insight = useRepoQuery((r) => r.insights.latest());
  const sessionCount = useRepoQuery((r) => r.sessions.listSummaries().length);
  const drill = insight ? DRILLS[insight.drillId] : undefined;

  return (
    <Screen testID="improve-screen">
      <Text
        style={{
          fontFamily: font.display,
          fontSize: text.xxxl,
          lineHeight: text.xxxl * leading.tight,
          color: color.ink,
        }}
      >
        Improve
      </Text>

      {!insight || !drill ? (
        <EmptyState
          title="A session comes first"
          body="The drill you need depends on what your action is actually doing. Bowl a spell and the app will pick the one thing worth changing."
          actionLabel="Bowl a session"
          actionIcon="video"
          onAction={() => rootNavigation?.navigate('Capture', { type: 'net' })}
        />
      ) : (
        <>
          <Card title="Current focus" action={<Badge tone="inverse">{drill.det}</Badge>}>
            <Text
              style={{
                fontFamily: font.displaySemi,
                fontSize: text.xxl,
                lineHeight: text.xxl * leading.tight,
                color: color.ink,
              }}
            >
              {cueFor(insight.determinantKey)}
            </Text>
            <View style={{ marginTop: sp[2] }}>
              <MonoNote>{gainLabel(insight)}</MonoNote>
            </View>
            <Text
              style={{
                fontFamily: font.ui,
                fontSize: text.sm,
                lineHeight: text.sm * leading.body,
                color: color.ink2,
                marginTop: sp[3],
              }}
            >
              {insight.rationale}
            </Text>
          </Card>

          <Button
            size="lg"
            full
            icon="video"
            onPress={() => rootNavigation?.navigate('Capture', { type: 'drill' })}
          >
            Retest — bowl a drill check
          </Button>

          <Button
            variant="secondary"
            full
            onPress={() => navigation.navigate('Drill', { drillId: drill.id })}
          >
            Open the drill
          </Button>

          <SectionLabel>How the loop closes</SectionLabel>
          <MonoNote>
            {sessionCount} session{sessionCount === 1 ? '' : 's'} so far · bowl the drill, then a
            drill check, and the retest says whether the change cleared its own error band.
          </MonoNote>
        </>
      )}
    </Screen>
  );
}
