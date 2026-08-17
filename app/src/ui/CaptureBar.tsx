/**
 * The capture-mode header: a close affordance and the step's name. Capture has
 * no back navigation — the steps run forward — so this closes the whole mode.
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components';
import { color, font, sp, text, trackCaps } from '@/theme/tokens';

export interface CaptureBarProps {
  title: string;
  /** Small mono line beneath, e.g. "S21 · CHECKS PASS AS YOU FIX THEM". */
  subtitle?: string;
  onClose: () => void;
}

export function CaptureBar({ title, subtitle, onClose }: CaptureBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: sp[2],
        paddingHorizontal: sp[4],
        paddingTop: sp[3],
      }}
    >
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close capture"
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        style={{ padding: sp[1] }}
      >
        <Icon name="x" size={18} color={color.ink2} />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: font.display,
            fontSize: text.lg,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            color: color.ink,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontFamily: font.mono,
              fontSize: 10.5,
              letterSpacing: trackCaps(text.xxs),
              color: color.ink3,
              marginTop: 3,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
