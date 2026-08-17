/**
 * S25 — the summary the bowler gets the instant they pick the phone up, before
 * any analysis has run. Read from what the session just observed, not from the
 * database, so it appears immediately.
 */
import React from 'react';
import { Text, View } from 'react-native';

import { Button, Card, Metric } from '@/components';
import { Unit } from '@/domain/types';
import { ballsToOvers } from '@/domain/workload';
import { toDisplay } from '@/domain/units';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { SectionLabel } from '@/ui/SectionLabel';

export interface EndedStepProps {
  deliveries: number;
  fastestKmh: number | null;
  fastestBandKmh: number | null;
  averageKmh: number | null;
  averageBandKmh: number | null;
  unit: Unit;
  weightingLabel: string;
  simulated: boolean;
  onProcess: () => void;
  onRetry: () => void;
  onClose: () => void;
}

export function EndedStep({
  deliveries,
  fastestKmh,
  fastestBandKmh,
  averageKmh,
  averageBandKmh,
  unit,
  weightingLabel,
  simulated,
  onProcess,
  onRetry,
  onClose,
}: EndedStepProps) {
  const hasDeliveries = deliveries > 0;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: sp[4], paddingTop: sp[4], gap: sp[4] }}>
        {hasDeliveries ? (
          <Card>
            {/* A count is not a measurement, so it carries no error band and is
                not rendered through Metric. */}
            <SectionLabel>Deliveries</SectionLabel>
            <Text
              style={{
                fontFamily: font.display,
                fontSize: 40,
                lineHeight: 40 * leading.tight,
                color: color.ink,
                fontVariant: ['tabular-nums'],
              }}
            >
              {deliveries}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: sp[5],
                marginTop: sp[4],
                paddingTop: sp[4],
                borderTopWidth: 1,
                borderTopColor: color.line,
              }}
            >
              {fastestKmh !== null && fastestBandKmh !== null ? (
                <Metric
                  label="Fastest"
                  value={toDisplay(fastestKmh, unit)}
                  unit={unit}
                  band={toDisplay(fastestBandKmh, unit)}
                  size="sm"
                />
              ) : null}
              {averageKmh !== null && averageBandKmh !== null ? (
                <Metric
                  label="Average"
                  value={toDisplay(averageKmh, unit)}
                  unit={unit}
                  band={toDisplay(averageBandKmh, unit)}
                  size="sm"
                />
              ) : null}
            </View>
          </Card>
        ) : (
          <Card>
            <Text
              style={{
                fontFamily: font.ui,
                fontSize: 13.5,
                lineHeight: 13.5 * leading.body,
                color: color.ink2,
              }}
            >
              No deliveries detected. Most likely a framing or angle problem — the placement checks
              will catch it next time. Nothing was counted against your workload.
            </Text>
          </Card>
        )}

        {hasDeliveries ? (
          <MonoNote>
            Added to workload: {ballsToOvers(deliveries)} overs · {weightingLabel} weighting
          </MonoNote>
        ) : null}

        {hasDeliveries && simulated ? (
          <MonoNote>
            Simulated analysis · these speeds are synthesised, not measured from video
          </MonoNote>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: sp[4], paddingBottom: sp[6], gap: sp[2] }}>
        {hasDeliveries ? (
          <Button size="lg" full onPress={onProcess} testID="process-button">
            Process session
          </Button>
        ) : (
          <Button size="lg" full onPress={onRetry}>
            Try again
          </Button>
        )}
        <Button variant="ghost" full onPress={onClose}>
          Close
        </Button>
      </View>
    </View>
  );
}
