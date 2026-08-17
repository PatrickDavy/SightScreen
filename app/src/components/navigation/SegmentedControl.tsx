/**
 * SegmentedControl — ink-outlined toggle for 2–3 mutually exclusive one-word
 * options (the product's km/h · mph switch). More than 3 options → Select.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, font, radius, text } from '@/theme/tokens';

export interface SegmentOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options?: (string | SegmentOption)[];
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({
  options = [],
  value,
  onChange,
  size = 'md',
  style,
}: SegmentedControlProps) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const h = size === 'sm' ? 28 : 34;
  return (
    <View
      accessibilityRole="tablist"
      style={[
        {
          flexDirection: 'row',
          alignSelf: 'flex-start',
          borderWidth: border.strong,
          borderColor: color.ink,
          borderRadius: radius.r1,
          backgroundColor: color.paper,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {opts.map((o, i) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange?.(o.value)}
            style={({ pressed }) => ({
              height: h - 2 * border.strong,
              paddingHorizontal: 12,
              alignItems: 'center',
              justifyContent: 'center',
              borderLeftWidth: i ? border.strong : 0,
              borderLeftColor: color.ink,
              backgroundColor: active ? color.ink : pressed ? color.chalk : 'transparent',
            })}
          >
            <Text
              style={{
                fontFamily: font.uiSemi,
                fontSize: text.sm,
                lineHeight: text.sm + 1,
                color: active ? color.chalk : color.ink2,
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
