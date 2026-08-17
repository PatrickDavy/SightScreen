/**
 * S50 — the workload ledger.
 *
 * Safety is structure, not a disclaimer: this is a root destination, not a
 * settings toggle, and it is free on every tier at every time. It advises and
 * never blocks — the app counts honestly, the human decides.
 *
 * Manual entry matters as much as the automatic kind. A ledger that only counts
 * filmed deliveries is worse than useless.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Badge, Button, Card, Dialog, Icon, SegmentedControl, WorkloadMeter } from '@/components';
import { isoDate, systemClock } from '@/domain/clock';
import { guidelineFor, guidelineFootnote } from '@/domain/guidelines';
import { newId } from '@/domain/ids';
import { SessionType } from '@/domain/types';
import {
  STATUS_WORD,
  WEIGHTING,
  ballsToOvers,
  consecutiveDays,
  loadStatus,
  rolling7DayOvers,
  weekByDay,
} from '@/domain/workload';
import type { LoadStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/useAppStore';
import { color, font, leading, radius, sp, text } from '@/theme/tokens';
import { BarChart } from '@/ui/BarChart';
import { EmptyState } from '@/ui/EmptyState';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { SectionLabel } from '@/ui/SectionLabel';

type Props = NativeStackScreenProps<LoadStackParamList, 'Load'>;

const DAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** A typical uncaptured net — enough to be useful, small enough to be honest. */
const MANUAL_OVERS = [2, 4, 6, 8] as const;

export function LoadScreen({ navigation }: Props) {
  const { repos, mutate } = useRepos();
  const showToast = useAppStore((s) => s.showToast);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualOvers, setManualOvers] = useState<number>(4);
  const [manualType, setManualType] = useState<SessionType>('net');

  const entries = useRepoQuery((r) => r.workload.all());
  const bowler = repos.bowler.get();

  const now = systemClock.now();
  const nowYear = new Date(now).getFullYear();
  const guideline = guidelineFor(bowler?.yob ?? nowYear - 25, nowYear);

  const rollingOvers = useMemo(() => rolling7DayOvers(entries, now), [entries, now]);
  const week = useMemo(() => weekByDay(entries, now), [entries, now]);
  const inARow = useMemo(() => consecutiveDays(entries, now), [entries, now]);

  const status = loadStatus(rollingOvers, guideline);
  const today = isoDate(now);

  const addManualEntry = () => {
    if (!bowler) return;
    mutate((r) =>
      r.workload.insert({
        id: newId('wl', now),
        bowlerId: bowler.id,
        date: today,
        deliveries: manualOvers * 6,
        source: 'manual',
        weighting: WEIGHTING[manualType],
        sessionId: null,
      }),
    );
    setManualOpen(false);
    showToast(`Manual entry added: ${manualOvers} overs, ${manualType} weighting.`, 'good');
  };

  return (
    <Screen testID="load-screen">
      <Text
        style={{
          fontFamily: font.display,
          fontSize: text.xxxl,
          lineHeight: text.xxxl * leading.tight,
          color: color.ink,
        }}
      >
        Load
      </Text>

      {entries.length === 0 ? (
        <EmptyState
          title="Nothing bowled yet this week"
          body="Every session you capture lands here automatically, and you can add the ones you did not film. The ledger is what keeps the weekly count honest."
          actionLabel="Add an uncaptured session"
          actionIcon="plus"
          onAction={() => setManualOpen(true)}
        />
      ) : (
        <>
          <Card onPress={() => navigation.navigate('Rest')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: sp[3] }}>
              <View style={{ flex: 1, gap: sp[2] }}>
                <Badge tone={status}>{STATUS_WORD[status]}</Badge>
                <Text
                  style={{
                    fontFamily: font.ui,
                    fontSize: text.sm,
                    lineHeight: text.sm * leading.body,
                    color: color.ink2,
                  }}
                >
                  {inARow >= 3
                    ? `${inARow} days in a row — see why, and what is still useful today.`
                    : 'See what this means for today, and what else is worth doing.'}
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color={color.ink3} />
            </View>
          </Card>

          <Card title="Deliveries by day">
            <BarChart
              accessibilityLabel="Deliveries bowled on each day this week"
              bars={week.map((day, i) => ({
                label: DAY_INITIALS[i] ?? '',
                value: day.balls,
                highlight: day.date === today,
              }))}
            />
          </Card>

          <Card>
            <WorkloadMeter
              label="Rolling 7 days"
              used={rollingOvers}
              limit={guideline.maxOversWeek}
              unit="overs"
              guideline={guidelineFootnote(guideline)}
            />
            <View style={{ marginTop: sp[3] }}>
              <MonoNote>
                Match balls are weighted heavier · uncaptured sessions can be added by hand — a
                ledger that only counts filmed balls is worse than useless.
              </MonoNote>
            </View>
          </Card>

          <Button variant="secondary" icon="plus" full onPress={() => setManualOpen(true)}>
            Add an uncaptured session
          </Button>
        </>
      )}

      <View
        style={{
          flexDirection: 'row',
          gap: sp[3],
          alignItems: 'flex-start',
          backgroundColor: color.turfTint,
          borderRadius: radius.r2,
          padding: sp[4],
        }}
      >
        <Icon name="shield" size={18} color={color.turfDeep} />
        <Text
          style={{
            flex: 1,
            fontFamily: font.uiMedium,
            fontSize: text.xs,
            lineHeight: text.xs * leading.body,
            color: color.turfDeep,
          }}
        >
          The ledger is free forever. Safety never sits behind a paywall.
        </Text>
      </View>

      <Dialog
        open={manualOpen}
        title="Add an uncaptured session"
        onClose={() => setManualOpen(false)}
        footer={
          <>
            <Button variant="secondary" onPress={() => setManualOpen(false)}>
              Cancel
            </Button>
            <Button onPress={addManualEntry}>Add it</Button>
          </>
        }
      >
        <View style={{ gap: sp[4] }}>
          <View style={{ gap: sp[2] }}>
            <SectionLabel>Overs bowled</SectionLabel>
            <SegmentedControl
              options={MANUAL_OVERS.map((o) => ({ value: String(o), label: String(o) }))}
              value={String(manualOvers)}
              onChange={(v) => setManualOvers(Number(v))}
            />
          </View>
          <View style={{ gap: sp[2] }}>
            <SectionLabel>Kind of spell</SectionLabel>
            <SegmentedControl
              options={[
                { value: 'net', label: 'Net' },
                { value: 'match', label: 'Match' },
                { value: 'drill', label: 'Drill' },
              ]}
              value={manualType}
              onChange={(v) => setManualType(v as SessionType)}
            />
          </View>
          <MonoNote>
            That is {ballsToOvers(manualOvers * 6)} overs at {manualType} weighting.
          </MonoNote>
        </View>
      </Dialog>
    </Screen>
  );
}
