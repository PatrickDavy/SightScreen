/**
 * The flat bar chart used for deliveries-by-day and the pace trend. Bars, a
 * baseline, and labels — no gridlines, no axes furniture, no gradients.
 */
import React from 'react';
import { Text, View } from 'react-native';

import { color, font, radius, sp, text } from '@/theme/tokens';

export interface Bar {
  label: string;
  value: number;
  /** Marks today, or the latest session — one bar at most, in cherry. */
  highlight?: boolean;
  /** Overrides the fill, e.g. amber for a flagged ramp. */
  tone?: string;
}

export interface BarChartProps {
  bars: Bar[];
  height?: number;
  /** Highest value on the scale; defaults to the tallest bar. */
  max?: number;
  accessibilityLabel?: string;
}

export function BarChart({ bars, height = 96, max, accessibilityLabel }: BarChartProps) {
  const ceiling = Math.max(max ?? 0, ...bars.map((b) => b.value), 1);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={{ gap: sp[2] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: sp[2] }}>
        {bars.map((bar, i) => {
          const fill = bar.tone ?? (bar.highlight ? color.cherry : color.ink);
          return (
            <View key={`${bar.label}-${i}`} style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View
                style={{
                  // An empty day still shows a track, so the week reads as
                  // seven days rather than as however many were bowled.
                  height: bar.value > 0 ? Math.max(3, (bar.value / ceiling) * height) : 3,
                  backgroundColor: bar.value > 0 ? fill : color.bandTrack,
                  borderRadius: radius.r1 / 2,
                }}
              />
            </View>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', gap: sp[2] }}>
        {bars.map((bar, i) => (
          <Text
            key={`${bar.label}-label-${i}`}
            numberOfLines={1}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: font.mono,
              fontSize: text.xxs,
              color: bar.highlight ? color.ink : color.ink3,
            }}
          >
            {bar.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
