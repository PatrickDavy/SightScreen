/**
 * Metric — the signature readout: value in condensed display type, error band
 * and evidence in mono. Every measured number in the product goes through it;
 * no measured number appears outside one. Always pass `band` when the value is
 * measured. `range` adds the band track: turf zone = target, ink block = your
 * interval, cherry tick = point estimate.
 */
import React, { useState } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { color, font, text, trackCaps } from '@/theme/tokens';

export interface MetricRange {
  min: number;
  max: number;
  good?: [number, number];
}

export interface MetricProps {
  label?: string;
  value?: number | string;
  unit?: string;
  band?: number | string;
  sample?: string;
  size?: 'sm' | 'md' | 'lg';
  range?: MetricRange;
  /** Value color override, e.g. cherry when over-limit. */
  tone?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SIZES = { sm: { v: 26, u: 12 }, md: { v: 40, u: 14 }, lg: { v: 64, u: 17 } };

if (__DEV__) {
  // Invariant (handover §3): no bare measured number. Warned at render below.
}

export function Metric({
  label,
  value,
  unit,
  band,
  sample,
  size = 'md',
  range,
  tone,
  style,
  testID,
}: MetricProps) {
  const s = SIZES[size];
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  const [trackW, setTrackW] = useState(0);

  if (__DEV__ && Number.isFinite(num) && band == null) {
    console.warn(
      `Metric "${label ?? value}" rendered a measured number without a band — every measurement carries its uncertainty.`,
    );
  }

  const bandLine =
    band != null || sample
      ? `${band != null ? `±${band}` : ''}${band != null && unit ? ` ${unit}` : ''}${
          band != null && sample ? ' · ' : ''
        }${sample ?? ''}`
      : null;

  let track: React.ReactNode = null;
  if (range && Number.isFinite(num)) {
    const min = range.min ?? 0;
    const max = range.max ?? 100;
    const pct = (x: number) => Math.min(Math.max(((x - min) / (max - min)) * 100, 0), 100);
    const b = typeof band === 'number' ? band : parseFloat(String(band)) || 0;
    const intervalLeft = pct(num - b);
    const intervalW = Math.max(pct(num + b) - intervalLeft, 1.5);
    track = (
      <View
        onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
        style={{
          marginTop: 10,
          height: 12,
          justifyContent: 'center',
        }}
      >
        <View style={{ height: 6, backgroundColor: color.bandTrack, borderRadius: 3 }}>
          {range.good ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${pct(range.good[0])}%`,
                width: `${pct(range.good[1]) - pct(range.good[0])}%`,
                backgroundColor: color.turfSoft,
                opacity: 0.55,
                borderRadius: 3,
              }}
            />
          ) : null}
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${intervalLeft}%`,
              width: `${intervalW}%`,
              backgroundColor: color.bandFill,
              borderRadius: 3,
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: trackW ? (pct(num) / 100) * trackW - 1 : `${pct(num)}%`,
            width: 2,
            backgroundColor: tone ?? color.cherry,
          }}
        />
      </View>
    );
  }

  const a11y =
    Number.isFinite(num) && band != null
      ? `${label ? `${label}: ` : ''}${value} plus or minus ${band}${unit ? ` ${expandUnit(unit)}` : ''}`
      : undefined;

  return (
    <View style={style} testID={testID} accessible={!!a11y} accessibilityLabel={a11y}>
      {label ? (
        <Text
          style={{
            marginBottom: 4,
            fontFamily: font.uiBold,
            fontSize: text.xxs,
            letterSpacing: trackCaps(text.xxs),
            textTransform: 'uppercase',
            color: color.ink2,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        <Text
          style={{
            fontFamily: font.display,
            fontSize: s.v,
            lineHeight: s.v * 1.05,
            letterSpacing: s.v * 0.01,
            color: tone ?? color.ink,
            fontVariant: ['tabular-nums'],
          }}
        >
          {value}
        </Text>
        {unit ? (
          <Text style={{ fontFamily: font.monoMedium, fontSize: s.u, color: color.ink2 }}>
            {unit}
          </Text>
        ) : null}
      </View>
      {bandLine ? (
        <Text
          style={{ marginTop: 2, fontFamily: font.mono, fontSize: text.xs, color: color.ink3 }}
        >
          {bandLine}
        </Text>
      ) : null}
      {track}
    </View>
  );
}

/** Screen readers announce units in words, not glyphs. */
function expandUnit(unit: string): string {
  switch (unit) {
    case 'km/h':
      return 'kilometres per hour';
    case 'mph':
      return 'miles per hour';
    case '°':
      return 'degrees';
    case 'm/s':
      return 'metres per second';
    case 's':
      return 'seconds';
    default:
      return unit;
  }
}
