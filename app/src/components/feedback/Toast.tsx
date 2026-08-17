/**
 * Toast — ink notification bar for transient results and honest failures; one
 * sentence, says what to do next. Position/stacking is the consumer's job.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { color, font, radius, shadow2, text } from '@/theme/tokens';

import { Icon, IconName } from '../core/Icon';

export type ToastTone = 'neutral' | 'good' | 'watch' | 'over';

export interface ToastProps {
  tone?: ToastTone;
  children?: React.ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

const TONE_ICON: Record<ToastTone, { name: IconName; color: string }> = {
  neutral: { name: 'info', color: color.chalk },
  good: { name: 'circle-check', color: color.turfSoft },
  watch: { name: 'triangle-alert', color: color.amberSoft },
  over: { name: 'octagon-alert', color: color.cherrySoft },
};

export function Toast({ tone = 'neutral', children, onDismiss, style }: ToastProps) {
  const t = TONE_ICON[tone];
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          maxWidth: 420,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 14,
          paddingRight: 12,
          backgroundColor: color.ink,
          borderRadius: radius.r1,
          ...shadow2,
        },
        style,
      ]}
    >
      <Icon name={t.name} size={17} color={t.color} />
      <Text
        style={{
          flex: 1,
          fontFamily: font.uiMedium,
          fontSize: text.sm,
          lineHeight: text.sm * 1.4,
          color: color.chalk,
        }}
      >
        {children}
      </Text>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onDismiss}
          hitSlop={8}
          style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="x" size={14} color={color.textInverseMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
