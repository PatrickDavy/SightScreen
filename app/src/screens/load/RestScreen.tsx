/**
 * S52 — rest guidance.
 *
 * Never scolds, and never blocks. It explains the reason in one paragraph,
 * gives a recommendation, and offers non-bowling work that still serves the
 * current drill focus. The app advises; the human decides.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Badge, Card } from '@/components';
import { systemClock } from '@/domain/clock';
import { guidelineFor, guidelineFootnote } from '@/domain/guidelines';
import { STATUS_WORD, consecutiveDays, loadStatus, rolling7DayOvers } from '@/domain/workload';
import type { LoadStackParamList } from '@/navigation/types';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<LoadStackParamList, 'Rest'>;

const ALTERNATIVES = [
  {
    title: 'Front-leg brace, no ball',
    body: 'Walk-throughs against a wall — serves your current focus.',
  },
  {
    title: 'Run-up rhythm only',
    body: 'Run-throughs without bowling cost nothing.',
  },
  {
    title: 'Watch your last session',
    body: 'Two minutes on the insight beats six overs of grooving the fault.',
  },
];

export function RestScreen({ navigation }: Props) {
  const { repos } = useRepos();
  const entries = useRepoQuery((r) => r.workload.all());

  const now = systemClock.now();
  const nowYear = new Date(now).getFullYear();
  const bowler = repos.bowler.get();
  const guideline = guidelineFor(bowler?.yob ?? nowYear - 25, nowYear);

  const rollingOvers = useMemo(() => rolling7DayOvers(entries, now), [entries, now]);
  const inARow = useMemo(() => consecutiveDays(entries, now), [entries, now]);
  const status = loadStatus(rollingOvers, guideline);

  const band = guideline.label === 'Senior' ? 'senior' : guideline.label;

  return (
    <Screen>
      <ScreenHeader
        title={STATUS_WORD[status]}
        onBack={() => navigation.goBack()}
        right={<Badge tone={status === 'good' ? 'good' : 'watch'}>Advice</Badge>}
      />

      <Card>
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          You have bowled on {inARow} of the last few days, and your rolling seven-day load is{' '}
          {rollingOvers} of the {guideline.maxOversWeek} overs in the {band} band. The research ties
          injury risk to the seven-day peak more than to any single day, so today is the cheap day
          to go easy.
        </Text>
        <View style={{ marginTop: sp[3] }}>
          <MonoNote>{guidelineFootnote(guideline)}</MonoNote>
        </View>
      </Card>

      <Card title="Still useful today">
        <View style={{ gap: sp[4] }}>
          {ALTERNATIVES.map((alternative) => (
            <View key={alternative.title} style={{ gap: 3 }}>
              <Text style={{ fontFamily: font.uiSemi, fontSize: text.sm, color: color.ink }}>
                {alternative.title}
              </Text>
              <Text
                style={{
                  fontFamily: font.ui,
                  fontSize: text.xs,
                  lineHeight: text.xs * leading.body,
                  color: color.ink2,
                }}
              >
                {alternative.body}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <MonoNote>
        The app advises, you decide. Nothing is blocked — but the ledger keeps honest count either
        way.
      </MonoNote>
    </Screen>
  );
}
