/**
 * WorkloadMeter — bowling-load bar against an age-group guideline; tone
 * derives automatically: <80% good, ≥80% watch, ≥100% over. Workload safety is
 * never paywalled — this component never sits behind an upsell.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, dur, ease, font, radius, text } from '@/theme/tokens';

import { Badge, BadgeTone } from '../core/Badge';

export interface WorkloadMeterProps {
  label?: string;
  used?: number;
  limit?: number;
  unit?: string;
  guideline?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function workloadTone(used: number, limit: number): 'good' | 'watch' | 'over' {
  const ratio = limit > 0 ? used / limit : 0;
  return ratio >= 1 ? 'over' : ratio >= 0.8 ? 'watch' : 'good';
}

const WORD = { good: 'Within limit', watch: 'Near limit', over: 'Over limit' } as const;
const FILL = { good: color.turf, watch: color.amber, over: color.cherry } as const;

export function WorkloadMeter({
  label = 'This week',
  used = 0,
  limit = 1,
  unit = 'overs',
  guideline,
  style,
  testID,
}: WorkloadMeterProps) {
  const ratio = limit > 0 ? used / limit : 0;
  const tone = workloadTone(used, limit);
  const width = useRef(new Animated.Value(Math.min(ratio, 1))).current;
  useEffect(() => {
    Animated.timing(width, {
      toValue: Math.min(ratio, 1),
      duration: dur.d3,
      easing: ease.swift,
      useNativeDriver: false,
    }).start();
  }, [ratio, width]);

  return (
    <View
      style={style}
      testID={testID}
      accessible
      accessibilityLabel={`${label}: ${used} of ${limit} ${unit} — ${WORD[tone]}`}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontFamily: font.uiSemi, fontSize: text.sm, color: color.ink }}>{label}</Text>
        <Text style={{ fontFamily: font.mono, fontSize: text.sm, color: color.ink2 }}>
          <Text style={{ fontFamily: font.monoSemi, color: color.ink }}>{used}</Text>
          {` / ${limit} ${unit}`}
        </Text>
      </View>
      <View
        style={{
          height: 16,
          backgroundColor: color.paper,
          borderWidth: border.strong,
          borderColor: color.ink,
          borderRadius: radius.r1,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            backgroundColor: FILL[tone],
          }}
        />
        {/* Graduation ticks at 25/50/75 — like a rule (signature motif). */}
        {[25, 50, 75].map((t) => (
          <View
            key={t}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${t}%`,
              width: 1,
              backgroundColor: color.meterTick,
            }}
          />
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 8,
        }}
      >
        <Text
          style={{ flexShrink: 1, fontFamily: font.mono, fontSize: text.xxs, color: color.ink3 }}
        >
          {guideline ?? ''}
        </Text>
        <Badge tone={tone as BadgeTone}>{WORD[tone]}</Badge>
      </View>
    </View>
  );
}
