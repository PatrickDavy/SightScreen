/**
 * S70 — profile and settings.
 *
 * Everything lives on this phone. An account is only needed for backup, sharing
 * or a second device, and none of those are what the first session is for.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Badge, Card, SegmentedControl, Switch } from '@/components';
import { systemClock } from '@/domain/clock';
import { juniorPolicy } from '@/domain/juniorPolicy';
import { Unit } from '@/domain/types';
import type { YouStackParamList } from '@/navigation/types';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { ListRow } from '@/ui/ListRow';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { SectionLabel } from '@/ui/SectionLabel';

type Props = NativeStackScreenProps<YouStackParamList, 'You'>;

const NOTIFICATIONS_KEY = 'notificationsEnabled';

export function YouScreen({ navigation }: Props) {
  const { mutate } = useRepos();
  const bowler = useRepoQuery((r) => r.bowler.get());
  const notificationsRaw = useRepoQuery((r) => r.settings.get(NOTIFICATIONS_KEY));
  const notificationsEnabled = notificationsRaw !== 'off';

  const nowYear = new Date(systemClock.now()).getFullYear();
  const policy = bowler ? juniorPolicy(bowler.yob, bowler.consentState, nowYear) : null;
  const unit: Unit = bowler?.unit ?? 'km/h';

  return (
    <Screen testID="you-screen">
      <Text
        style={{
          fontFamily: font.display,
          fontSize: text.xxxl,
          lineHeight: text.xxxl * leading.tight,
          color: color.ink,
        }}
      >
        You
      </Text>

      {bowler ? (
        <Card>
          <View style={{ gap: sp[2] }}>
            <Text style={{ fontFamily: font.uiSemi, fontSize: text.md, color: color.ink }}>
              {bowler.arm === 'right' ? 'Right' : 'Left'}-arm {bowler.type.toLowerCase()}
            </Text>
            <MonoNote>
              {[
                bowler.heightCm ? `${bowler.heightCm} cm` : null,
                bowler.armSpanCm ? `span ${bowler.armSpanCm} cm` : null,
                bowler.targetSpeedKmh ? `target ${bowler.targetSpeedKmh} km/h` : null,
                policy?.accountBadge,
              ]
                .filter(Boolean)
                .join(' · ')}
            </MonoNote>
            <View style={{ flexDirection: 'row', gap: sp[2], marginTop: sp[1] }}>
              <Badge tone="inverse">No account yet</Badge>
            </View>
            <Text
              style={{
                fontFamily: font.ui,
                fontSize: text.xs,
                lineHeight: text.xs * leading.body,
                color: color.ink2,
                marginTop: sp[1],
              }}
            >
              Everything lives on this phone. An account is only needed for backup, sharing or a
              second device.
            </Text>
          </View>
        </Card>
      ) : null}

      <Card>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <SectionLabel>Units</SectionLabel>
          <SegmentedControl
            size="sm"
            options={['km/h', 'mph']}
            value={unit}
            onChange={(next) => mutate((r) => r.bowler.update({ unit: next as Unit }))}
          />
        </View>
      </Card>

      <Card>
        <Switch
          label="Notifications — workload, retests, processing only"
          checked={notificationsEnabled}
          onChange={(enabled) =>
            mutate((r) => r.settings.set(NOTIFICATIONS_KEY, enabled ? 'on' : 'off'))
          }
        />
      </Card>

      <ListRow
        title="Data and privacy"
        subtitle="On-device by default"
        icon="lock"
        onPress={() => navigation.navigate('Privacy')}
      />
    </Screen>
  );
}
