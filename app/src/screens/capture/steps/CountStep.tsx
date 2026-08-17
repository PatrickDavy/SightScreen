/**
 * S24 countdown — the walk back to the mark. Full-bleed ink with one enormous
 * numeral, because from here on the phone is read at distance.
 */
import React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';

import { color, font, leading, sp } from '@/theme/tokens';

/** 170/390 in the prototype. Scales with the screen; deliberately uncapped. */
const NUMERAL_RATIO = 170 / 390;

export function CountStep({ count, onSkip }: { count: number; onSkip: () => void }) {
  const { width } = useWindowDimensions();
  const numeralSize = Math.round(width * NUMERAL_RATIO);

  return (
    <Pressable
      onPress={onSkip}
      accessibilityRole="button"
      accessibilityLabel={`Starting in ${count} seconds. Tap to start now.`}
      style={{
        flex: 1,
        backgroundColor: color.surfaceInverse,
        alignItems: 'center',
        justifyContent: 'center',
        gap: sp[3],
      }}
    >
      <Text
        style={{
          fontFamily: font.display,
          fontSize: numeralSize,
          lineHeight: numeralSize * leading.tight,
          color: color.chalk,
          fontVariant: ['tabular-nums'],
        }}
      >
        {count}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: font.monoMedium,
          fontSize: 11,
          lineHeight: 11 * 1.6,
          letterSpacing: 1.1,
          color: 'rgba(242,240,233,.7)',
        }}
      >
        WALK TO YOUR MARK
      </Text>
    </Pressable>
  );
}
