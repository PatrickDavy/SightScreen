/**
 * The flat ink block that stands where video goes — camera preview, delivery
 * clip, drill demonstration. Video and camera areas are ink blocks by design,
 * and the chalk framing rectangle is one of the brand's signature motifs.
 */
import React from 'react';
import { Text, View } from 'react-native';

import { color, font, leading, radius, sp, text, trackCaps } from '@/theme/tokens';

export interface MediaPlaceholderProps {
  height?: number;
  /** Small tracked caption, centred at the foot of the block. */
  caption?: string;
  /** Draws the chalk framing rectangle — "stand here". */
  framed?: boolean;
  /** Draws a horizontal rule where the popping crease sits. */
  creaseAt?: number;
  children?: React.ReactNode;
}

export function MediaPlaceholder({
  height = 180,
  caption,
  framed = false,
  creaseAt,
  children,
}: MediaPlaceholderProps) {
  return (
    <View
      style={{
        height,
        backgroundColor: color.surfaceInverse,
        borderRadius: radius.r2,
        overflow: 'hidden',
        justifyContent: 'center',
      }}
    >
      {framed ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: sp[6],
            right: sp[6],
            top: sp[5],
            bottom: 42,
            borderWidth: 1.5,
            borderColor: color.chalk,
            borderRadius: 2,
          }}
        />
      ) : null}

      {creaseAt !== undefined ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${creaseAt * 100}%`,
            height: 1.5,
            backgroundColor: 'rgba(242,240,233,.45)',
          }}
        />
      ) : null}

      {children}

      {caption ? (
        <Text
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: sp[3],
            textAlign: 'center',
            fontFamily: font.monoMedium,
            fontSize: 10,
            lineHeight: 10 * leading.body,
            letterSpacing: trackCaps(text.xxs) * 1.4,
            color: 'rgba(242,240,233,.8)',
          }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
