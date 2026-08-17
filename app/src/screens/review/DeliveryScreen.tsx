/**
 * S31 — one delivery in detail. The video and its skeleton overlay, the three
 * action events on a timeline, and every metric measured at release with the
 * reference range and a plain-language meaning.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Badge, Card, Icon, Metric } from '@/components';
import { DETERMINANTS } from '@/domain/content/determinants';
import { Unit } from '@/domain/types';
import { toDisplay } from '@/domain/units';
import type { HomeStackParamList } from '@/navigation/types';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { EventScrubber } from '@/ui/EventScrubber';
import { MediaPlaceholder } from '@/ui/MediaPlaceholder';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<HomeStackParamList, 'Delivery'>;

export function DeliveryScreen({ navigation, route }: Props) {
  const { sessionId, index } = route.params;
  const { repos } = useRepos();

  const delivery = useRepoQuery((r) =>
    r.deliveries.listForSession(sessionId).find((d) => d.index === index),
  );
  const metrics = useRepoQuery((r) =>
    delivery ? r.metrics.listForDelivery(delivery.id) : [],
  );

  const unit: Unit = repos.bowler.get()?.unit ?? 'km/h';

  if (!delivery) {
    return (
      <Screen>
        <ScreenHeader title="Back" onBack={() => navigation.goBack()} />
        <MonoNote>That delivery is no longer on this phone.</MonoNote>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title={`Delivery ${delivery.index}`}
        onBack={() => navigation.goBack()}
        right={
          delivery.confidence === 'low' ? (
            <Badge tone="watch">Low confidence</Badge>
          ) : (
            <Badge tone="good">Confident</Badge>
          )
        }
      />

      <MediaPlaceholder height={200} caption="VIDEO + SKELETON OVERLAY · FRAME-STEP">
        <View style={{ alignItems: 'center' }}>
          <Icon name="play" size={28} color={color.chalk} />
        </View>
      </MediaPlaceholder>

      <EventScrubber events={delivery.events} />

      <Card>
        <Metric
          label="Ball speed"
          value={toDisplay(delivery.speedKmh, unit)}
          unit={unit}
          band={toDisplay(delivery.speedBandKmh, unit)}
          sample={`from ${delivery.frameCount} frames`}
          size="md"
        />
      </Card>

      {delivery.confidence === 'low' ? (
        <MonoNote>
          Marked low-confidence, so this ball sits outside your trend and did not feed the insight.
          It stays here so you can judge it yourself.
        </MonoNote>
      ) : null}

      {metrics.map((row) => {
        const determinant = DETERMINANTS[row.key];
        if (!determinant) return null;
        return (
          <Card
            key={row.key}
            onPress={() => navigation.navigate('Explainer', { determinantKey: row.key })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: sp[3] }}>
              <View style={{ flex: 1, gap: sp[2] }}>
                <Metric
                  label={determinant.name}
                  value={row.value}
                  unit={determinant.unit}
                  band={row.bandValue}
                  size="sm"
                />
                <MonoNote>{determinant.ref}</MonoNote>
                <Text
                  style={{
                    fontFamily: font.ui,
                    fontSize: text.xs,
                    lineHeight: text.xs * leading.body,
                    color: color.ink2,
                  }}
                >
                  {determinant.mean}
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={color.ink3} />
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
