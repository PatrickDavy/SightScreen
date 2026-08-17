/**
 * Switch — on/off for settings that apply immediately. Custom 40×22 track with
 * an 18px knob (the platform Switch doesn't match the system's geometry).
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { color, dur, ease, font, radius, text } from '@/theme/tokens';

export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Switch({ label, checked, onChange, disabled, style }: SwitchProps) {
  const x = useRef(new Animated.Value(checked ? 20 : 2)).current;
  useEffect(() => {
    Animated.timing(x, {
      toValue: checked ? 20 : 2,
      duration: dur.d2,
      easing: ease.swift,
      useNativeDriver: true,
    }).start();
  }, [checked, x]);
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: !!checked, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: 40,
          height: 22,
          flexShrink: 0,
          borderRadius: radius.pill,
          backgroundColor: checked ? color.ink : color.lineStrong,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: color.paper,
            transform: [{ translateX: x }],
            shadowColor: color.ink,
            shadowOpacity: 0.25,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
            elevation: 1,
          }}
        />
      </Animated.View>
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
