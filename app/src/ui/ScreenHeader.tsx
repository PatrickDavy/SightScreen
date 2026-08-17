/**
 * The back bar used on every pushed detail screen — the prototype's `Head`.
 * The whole label is the target, not just the chevron, because outdoors a
 * 16px glyph is not a touch target.
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components';
import { color, font, sp, text } from '@/theme/tokens';

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  /** Trailing slot — a unit toggle, a confidence badge, a settings button. */
  right?: React.ReactNode;
}

export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: sp[2],
        minHeight: 32,
      }}
    >
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={`Back to ${title}`}
          hitSlop={{ top: 14, bottom: 14, left: 8, right: 14 }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: sp[1], flexShrink: 1 }}
        >
          <Icon name="chevron-left" size={16} color={color.ink2} />
          <Text
            numberOfLines={1}
            style={{ fontFamily: font.uiSemi, fontSize: text.sm, color: color.ink2 }}
          >
            {title}
          </Text>
        </Pressable>
      ) : (
        <Text
          numberOfLines={1}
          style={{ fontFamily: font.uiSemi, fontSize: text.sm, color: color.ink2, flexShrink: 1 }}
        >
          {title}
        </Text>
      )}
      {right ?? null}
    </View>
  );
}
