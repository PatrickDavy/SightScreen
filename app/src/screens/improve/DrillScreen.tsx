/**
 * S41 — the drill.
 *
 * Two or three cues in the bowler's language, the prescribed reps, and — the
 * part most drill libraries leave out — what should feel different when it is
 * working. Ends by pre-configuring the drill check that verifies it.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { Badge, Button, Card } from '@/components';
import { DRILLS } from '@/domain/content/drills';
import { rootNavigationFrom } from '@/navigation/rootNavigation';
import type { ImproveStackParamList } from '@/navigation/types';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MediaPlaceholder } from '@/ui/MediaPlaceholder';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<ImproveStackParamList, 'Drill'>;

export function DrillScreen({ navigation, route }: Props) {
  const rootNavigation = rootNavigationFrom(navigation);
  const drill = DRILLS[route.params.drillId];

  if (!drill) {
    return (
      <Screen>
        <ScreenHeader title="Improve" onBack={() => navigation.goBack()} />
        <MonoNote>No drill by that name.</MonoNote>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <Button
          size="lg"
          full
          icon="video"
          // Pre-configures the session type, so the retest is a drill check
          // rather than a normal spell the bowler hopes to compare against.
          onPress={() => rootNavigation?.navigate('Capture', { type: 'drill' })}
        >
          Retest this in your next session
        </Button>
      }
    >
      <ScreenHeader
        title={drill.name}
        onBack={() => navigation.goBack()}
        right={<Badge>{drill.det}</Badge>}
      />

      <MediaPlaceholder height={180} caption="DEMONSTRATION VIDEO" />

      <Card title="Cues">
        <View style={{ gap: sp[3] }}>
          {drill.cues.map((cue, index) => (
            <View key={cue} style={{ flexDirection: 'row', gap: sp[3], alignItems: 'flex-start' }}>
              <Text
                style={{
                  fontFamily: font.display,
                  fontSize: text.lg,
                  color: color.cherry,
                  width: 18,
                }}
              >
                {index + 1}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontFamily: font.ui,
                  fontSize: text.sm,
                  lineHeight: text.sm * leading.body,
                  color: color.ink,
                }}
              >
                {cue}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card title="Prescription">
        <MonoNote>{drill.reps}</MonoNote>
      </Card>

      <Card title="What should feel different">
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          {drill.feel}
        </Text>
      </Card>
    </Screen>
  );
}
