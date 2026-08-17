/** S11 — every session, newest first. */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Metric } from '@/components';
import { displayDate } from '@/domain/clock';
import { Unit } from '@/domain/types';
import { toDisplay } from '@/domain/units';
import type { HomeStackParamList } from '@/navigation/types';
import { sessionTypeLabel } from '@/screens/capture/sessionTypes';
import { EmptyState } from '@/ui/EmptyState';
import { ListRow } from '@/ui/ListRow';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<HomeStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const { repos } = useRepos();
  const summaries = useRepoQuery((r) => r.sessions.listSummaries());
  const unit: Unit = repos.bowler.get()?.unit ?? 'km/h';

  return (
    <Screen>
      <ScreenHeader title="Home" onBack={() => navigation.goBack()} />

      {summaries.length === 0 ? (
        <EmptyState
          title="No sessions yet"
          body="Every spell you capture lands here, with its speeds and the insight it produced."
        />
      ) : null}

      {summaries.map((summary) => (
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
    </Screen>
  );
}
