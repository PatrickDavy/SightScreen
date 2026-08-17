/**
 * Badge — small uppercase status chip; the standard way to say good / watch /
 * over. Text stays terse — two or three words. Purely presentational.
 */
import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { color, font, radius, text, trackCaps } from '@/theme/tokens';

export type BadgeTone = 'neutral' | 'good' | 'watch' | 'over' | 'inverse';

export interface BadgeProps {
  tone?: BadgeTone;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const TONES: Record<BadgeTone, { bg: string; fg: string; border: string }> = {
  neutral: { bg: color.chalk, fg: color.ink2, border: color.lineStrong },
  good: { bg: color.goodBg, fg: color.turfDeep, border: color.turfSoft },
  watch: { bg: color.watchBg, fg: color.amberDeep, border: color.amberSoft },
  over: { bg: color.overBg, fg: color.cherryDeep, border: color.cherrySoft },
  inverse: { bg: color.ink, fg: color.chalk, border: color.ink },
};

export function Badge({ tone = 'neutral', children, style }: BadgeProps) {
  const t = TONES[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 5,
          height: 20,
          paddingHorizontal: 7,
          backgroundColor: t.bg,
          borderWidth: 1,
          borderColor: t.border,
          borderRadius: radius.r1,
        },
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={{
          fontFamily: font.uiBold,
          fontSize: text.xxs,
          lineHeight: text.xxs + 1,
          letterSpacing: trackCaps(text.xxs),
          textTransform: 'uppercase',
          color: t.fg,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
