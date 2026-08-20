/**
 * S30 — session review, ordered by what a bowler actually wants: the headline
 * speed, then whether it moved since last time, then the one thing to change,
 * then the balls themselves.
 *
 * Low-confidence deliveries stay in the list. They are marked, excluded from
 * trends and never feed the insight, but they are never silently dropped.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Badge, Card, CueCard, Metric, SegmentedControl } from '@/components';
import { displayDate } from '@/domain/clock';
import { cueFor, gainLabel } from '@/domain/insight';
import { compareRetest, deltaSentence } from '@/domain/retest';
import { Delivery, Unit } from '@/domain/types';
import { formatSpeedWithBand, toDisplay } from '@/domain/units';
import type { HomeStackParamList } from '@/navigation/types';
import { color, font, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SectionLabel } from '@/ui/SectionLabel';
import { sessionTypeLabel } from '@/screens/capture/sessionTypes';

type Props = NativeStackScreenProps<HomeStackParamList, 'Review'>;

export function ReviewScreen({ navigation, route }: Props) {
  const { sessionId } = route.params;
  const { repos, mutate } = useRepos();

  const summary = useRepoQuery((r) => r.sessions.summary(sessionId));
  const deliveries = useRepoQuery((r) => r.deliveries.listForSession(sessionId));
  const insight = useRepoQuery((r) => r.insights.forSession(sessionId));
  const previous = useRepoQuery((r) =>
    r.sessions.listSummaries().find((s) => s.session.id !== sessionId && s.session.endedAt !== null),
  );

  const bowler = repos.bowler.get();
  const unit: Unit = bowler?.unit ?? 'km/h';

  const fastest = useMemo(
    () =>
      deliveries.reduce<Delivery | null>(
        (best, d) => (best === null || d.speedKmh > best.speedKmh ? d : best),
        null,
      ),
    [deliveries],
  );
  const slowest = useMemo(
    () =>
      deliveries.reduce<Delivery | null>(
        (worst, d) => (worst === null || d.speedKmh < worst.speedKmh ? d : worst),
        null,
      ),
    [deliveries],
  );

  if (!summary) {
    return (
      <Screen>
        <ScreenHeader title="Back" onBack={() => navigation.goBack()} />
        <MonoNote>That session is no longer on this phone.</MonoNote>
      </Screen>
    );
  }

  const { session } = summary;

  /**
   * Session-on-session comparison, on the mean rather than the fastest ball.
   *
   * The fastest ball is the wrong statistic for this in two ways. It is a
   * maximum, so it is biased upward, and the bias grows with the number of
   * deliveries — comparing a best-of-5 against a best-of-30 flatters the longer
   * session for no reason connected to bowling. And a single ball gets no
   * benefit from averaging, so its band is as wide as a band can be, which made
   * the comparison both biased and imprecise at once.
   *
   * The mean is unbiased and its band narrows with the count (see
   * sessionMeanBandKmh), so a longer spell now earns a more confident verdict
   * instead of a flatteringly higher number. The fastest ball is still shown —
   * it is what a bowler wants to know — it just no longer decides whether a
   * change was real.
   */
  const delta =
    summary.avgKmh !== null &&
    summary.avgBandKmh !== null &&
    previous?.avgKmh != null &&
    previous.avgBandKmh != null
      ? compareRetest(
          { speedKmh: previous.avgKmh, bandKmh: previous.avgBandKmh },
          { speedKmh: summary.avgKmh, bandKmh: summary.avgBandKmh },
        )
      : null;

  return (
    <Screen
      testID="review-screen"
      footer={
        session.simulated ? (
          <MonoNote>
            Simulated analysis · these speeds are synthesised, not measured from video
          </MonoNote>
        ) : null
      }
    >
      <ScreenHeader
        title={`${sessionTypeLabel(session.type)} · ${displayDate(session.startedAt)}`}
        onBack={() => navigation.goBack()}
        right={
          <SegmentedControl
            size="sm"
            options={['km/h', 'mph']}
            value={unit}
            onChange={(next) => mutate((r) => r.bowler.update({ unit: next as Unit }))}
          />
        }
      />

      <Card>
        {summary.bestKmh !== null && summary.bestBandKmh !== null ? (
          <Metric
            label="Fastest ball"
            value={toDisplay(summary.bestKmh, unit)}
            unit={unit}
            band={toDisplay(summary.bestBandKmh, unit)}
            sample={summary.frames ? `from ${summary.frames} frames` : undefined}
            size="lg"
          />
        ) : null}

        {summary.avgKmh !== null && summary.avgBandKmh !== null ? (
          <View style={{ marginTop: sp[4] }}>
            <Metric
              label="Average"
              value={toDisplay(summary.avgKmh, unit)}
              unit={unit}
              band={toDisplay(summary.avgBandKmh, unit)}
              size="sm"
            />
          </View>
        ) : null}

        {delta ? (
          <View
            style={{
              marginTop: sp[4],
              paddingTop: sp[4],
              borderTopWidth: 1,
              borderTopColor: color.line,
            }}
          >
            {/* The verification half of the loop — and honest about whether the
                change clears its own uncertainty. */}
            <MonoNote>
              {deltaSentence(delta.speedDelta, delta.speedBand, unit)}
            </MonoNote>
          </View>
        ) : null}
      </Card>

      {insight ? (
        <CueCard
          cue={cueFor(insight.determinantKey)}
          gain={gainLabel(insight)}
          detail="Your biggest opportunity this session. See why it was chosen ahead of the others."
          actionLabel="See the one insight"
          onAction={() => navigation.navigate('Insight', { sessionId })}
        />
      ) : null}

      <SectionLabel>Deliveries</SectionLabel>

      {deliveries.map((delivery) => (
        <Card
          key={delivery.id}
          pad={sp[3]}
          onPress={() => navigation.navigate('Delivery', { sessionId, index: delivery.index })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: sp[3] }}>
            <Text
              style={{
                fontFamily: font.mono,
                fontSize: text.xs,
                color: color.ink3,
                width: 20,
              }}
            >
              {delivery.index}
            </Text>
            <Text
              style={{
                flex: 1,
                fontFamily: font.monoMedium,
                fontSize: text.sm,
                color: color.ink,
              }}
            >
              {formatSpeedWithBand(delivery.speedKmh, delivery.speedBandKmh, unit)}
            </Text>

            {delivery.id === fastest?.id ? <Badge tone="inverse">Fastest</Badge> : null}
            {delivery.id === slowest?.id && deliveries.length > 1 ? <Badge>Slowest</Badge> : null}
            {delivery.confidence === 'low' ? <Badge tone="watch">Low conf</Badge> : null}
          </View>
        </Card>
      ))}

      <MonoNote>
        Low-confidence deliveries stay visible but sit outside your trend. Speeds shown with their
        error band — never a false-precision decimal.
      </MonoNote>
    </Screen>
  );
}
