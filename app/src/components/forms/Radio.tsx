/**
 * Radio — one-of choices too long for a SegmentedControl (bowling arm, camera
 * position). Stack vertically with 10px gap; grouping is caller-managed.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, dur, ease, font, text } from '@/theme/tokens';

export interface RadioProps {
  label?: React.ReactNode;
  checked?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Radio({ label, checked, value, onChange, disabled, style }: RadioProps) {
  const scale = useRef(new Animated.Value(checked ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(scale, {
      toValue: checked ? 1 : 0,
      duration: dur.d1,
      easing: ease.swift,
      useNativeDriver: true,
    }).start();
  }, [checked, scale]);
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: !!checked, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onChange?.(value ?? '')}
      style={[
        { flexDirection: 'row', alignItems: 'flex-start', gap: 10, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <View
        style={{
          width: 18,
          height: 18,
          marginTop: 1,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color.paper,
          borderWidth: border.strong,
          borderColor: checked ? color.ink : color.lineStrong,
          borderRadius: 9,
        }}
      >
        <Animated.View
          style={{
            width: 9,
            height: 9,
            borderRadius: 4.5,
            backgroundColor: color.ink,
            transform: [{ scale }],
          }}
        />
      </View>
      {label ? (
        <Text
          style={{
            flexShrink: 1,
            fontFamily: font.ui,
            fontSize: text.md,
            lineHeight: text.md * 1.35,
            color: color.ink,
          }}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}
