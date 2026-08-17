/**
 * Tag — pill chip for filters; selectable, optionally removable. The only
 * pill-shaped element in the system. Selected fills ink. Lay groups out with
 * flex + 8px gap.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { color, font, radius, text } from '@/theme/tokens';

import { Icon } from './Icon';

export interface TagProps {
  selected?: boolean;
  onRemove?: () => void;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Tag({ selected, onRemove, onPress, children, style }: TagProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 6,
          height: 28,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: selected ? color.ink : color.lineStrong,
          borderRadius: radius.pill,
          backgroundColor: selected ? color.ink : pressed ? color.chalk : color.paper,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: font.uiMedium,
          fontSize: text.sm,
          lineHeight: text.sm + 1,
          color: selected ? color.chalk : color.ink,
        }}
      >
        {children}
      </Text>
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remove"
          onPress={onRemove}
          hitSlop={8}
          style={{ marginRight: -4 }}
        >
          <Icon name="x" size={13} color={selected ? color.chalk : color.ink} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
