/**
 * S10 — the returning-user landing surface.
 *
 * Card order comes from juniorPolicy: for an under-18 account workload sits
 * first and pace second. That is the flow spec's "workload status first" rule,
 * and it is decided at the data layer rather than by an age check here.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Badge, Card, IconButton, Metric, WorkloadMeter } from '@/components';
import { displayDate, systemClock } from '@/domain/clock';
import { DRILLS } from '@/domain/content/drills';
import { guidelineFor, guidelineFootnote } from '@/domain/guidelines';
import { cueFor } from '@/domain/insight';
import { juniorPolicy } from '@/domain/juniorPolicy';
import { Unit } from '@/domain/types';
import { toDisplay } from '@/domain/units';
import { rolling7DayOvers, loadStatus, STATUS_WORD } from '@/domain/workload';
import { rootNavigationFrom } from '@/navigation/rootNavigation';
import type { HomeStackParamList } from '@/navigation/types';
import { sessionTypeLabel } from '@/screens/capture/sessionTypes';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { EmptyState } from '@/ui/EmptyState';
import { ListRow } from '@/ui/ListRow';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { SectionLabel } from '@/ui/SectionLabel';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const RECENT_COUNT = 3;

export function HomeScreen({ navigation }: Props) {
  const { repos } = useRepos();
  const rootNavigation = rootNavigationFrom(navigation);

  const summaries = useRepoQuery((r) => r.sessions.listSummaries());
  const entries = useRepoQuery((r) => r.workload.all());
  const insight = useRepoQuery((r) => r.insights.latest());
  const bowler = useRepoQuery((r) => r.bowler.get());

  const now = systemClock.now();
  const nowYear = new Date(now).getFullYear();
  const unit: Unit = bowler?.unit ?? 'km/h';
  const policy = bowler ? juniorPolicy(bowler.yob, bowler.consentState, nowYear) : null;
  const guideline = guidelineFor(bowler?.yob ?? nowYear - 25, nowYear);

  const rollingOvers = useMemo(() => rolling7DayOvers(entries, now), [entries, now]);
  const latest = summaries[0];
  const status = loadStatus(rollingOvers, guideline);

  const paceCard =
    latest && latest.bestKmh !== null && latest.bestBandKmh !== null ? (
      <Card key="pace" onPress={() => navigation.navigate('Review', { sessionId: latest.session.id })}>
        <Metric
          label="Current pace"
          value={toDisplay(latest.bestKmh, unit)}
          unit={unit}
          band={toDisplay(latest.bestBandKmh, unit)}
          sample={displayDate(latest.session.startedAt)}
          size="lg"
        />
        {latest.session.simulated ? (
          <View style={{ marginTop: sp[2] }}>
            <MonoNote>Simulated analysis · not measured from video</MonoNote>
          </View>
        ) : null}
      </Card>
    ) : null;

  const loadCard = (
    <Card key="load" onPress={() => rootNavigation?.navigate('Tabs', { screen: 'LoadTab' })}>
      <WorkloadMeter
        label="This week"
        used={rollingOvers}
        limit={guideline.maxOversWeek}
        unit="overs"
        guideline={guidelineFootnote(guideline)}
      />
      <View style={{ marginTop: sp[3] }}>
        <Badge tone={status}>{STATUS_WORD[status]}</Badge>
      </View>
    </Card>
  );

  const ordered =
    policy?.homeOrder[0] === 'load' ? [loadCard, paceCard] : [paceCard, loadCard];

  return (
    <Screen testID="home-screen">
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* The wordmark, set literally rather than transformed: no logo exists,
            so this is the mark itself, not sentence-case copy shouting. */}
        <Text
          style={{
            fontFamily: font.display,
            fontSize: text.xl,
            letterSpacing: 0.4,
            color: color.ink,
          }}
        >
          SIGHTSCREEN
        </Text>
        {policy?.accountBadge ? (
          <Badge>{policy.accountBadge}</Badge>
        ) : (
          <IconButton
            name="settings"
            label="Settings"
            onPress={() => rootNavigation?.navigate('Tabs', { screen: 'YouTab' })}
          />
        )}
      </View>

      {summaries.length === 0 ? (
        <EmptyState
          title="Your first session is one spell away"
          body="Prop the phone side-on, bowl your usual spell, and walk back to a speed with its error band and the one thing worth changing."
          actionLabel="Bowl a session"
          actionIcon="video"
          onAction={() => rootNavigation?.navigate('Capture', { type: 'net' })}
        />
      ) : null}

      {ordered}

      {insight && DRILLS[insight.drillId] ? (
        <Card
          onPress={() =>
            rootNavigation?.navigate('Tabs', {
              screen: 'ImproveTab',
              params: { screen: 'Drill', params: { drillId: insight.drillId } },
            })
          }
        >
          <SectionLabel>Next</SectionLabel>
          <Text
            style={{
              fontFamily: font.uiSemi,
              fontSize: text.md,
              color: color.ink,
              marginTop: sp[2],
            }}
          >
            {cueFor(insight.determinantKey)}, then retest
          </Text>
          <Text
            style={{
              fontFamily: font.ui,
              fontSize: text.xs,
              lineHeight: text.xs * leading.body,
              color: color.ink2,
              marginTop: 3,
            }}
          >
            Your one thing from the last session.
          </Text>
        </Card>
      ) : null}

      {summaries.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <SectionLabel>Recent sessions</SectionLabel>
            <Text
              accessibilityRole="button"
              onPress={() => navigation.navigate('History')}
              style={{ fontFamily: font.uiSemi, fontSize: text.xs, color: color.cherry }}
            >
              All sessions
            </Text>
          </View>

          {summaries.slice(0, RECENT_COUNT).map((summary) => (
            <ListRow
              key={summary.session.id}
              title={sessionTypeLabel(summary.session.type)}
              detail={`${displayDate(summary.session.startedAt)} · ${summary.balls} balls`}
              right={
                summary.bestKmh !== null && summary.bestBandKmh !== null ? (
                  <Metric
                    value={toDisplay(summary.bestKmh, unit)}
                    unit={unit}
                    band={toDisplay(summary.bestBandKmh, unit)}
                    size="sm"
                  />
                ) : undefined
              }
              onPress={() => navigation.navigate('Review', { sessionId: summary.session.id })}
            />
          ))}
        </>
      ) : null}
    </Screen>
  );
}
