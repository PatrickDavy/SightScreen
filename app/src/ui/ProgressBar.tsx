/**
 * Determinate progress only — S26 counts deliveries, so it can say which one it
 * is on. There is no indeterminate spinner anywhere in this app by design:
 * nothing in the core loop waits on a network call, so nothing needs to admit
 * it does not know how long it will take.
 */
import React from 'react';
import { View } from 'react-native';

import { color, radius } from '@/theme/tokens';

export interface ProgressBarProps {
  /** 0..1. Values outside are clamped. */
  value: number;
  width?: number;
  /** Defaults suit the ink processing screen; override on chalk. */
  trackColor?: string;
  fillColor?: string;
  accessibilityLabel?: string;
}

export function ProgressBar({
  value,
  width = 200,
  trackColor = 'rgba(242,240,233,.22)',
  fillColor = color.chalk,
  accessibilityLabel,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{
        width,
        height: 4,
        backgroundColor: trackColor,
        borderRadius: radius.r1 / 2,
        overflow: 'hidden',
      }}
    >
      <View style={{ width: `${clamped * 100}%`, height: '100%', backgroundColor: fillColor }} />
    </View>
  );
}
