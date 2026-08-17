/**
 * Checkbox — for independent opt-ins; label states the consequence plainly.
 * Checked fills ink. Use Switch for settings that apply immediately.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, font, text } from '@/theme/tokens';

import { Icon } from '../core/Icon';

export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Checkbox({ label, checked, onChange, disabled, style }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!checked, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
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
          backgroundColor: checked ? color.ink : color.paper,
          borderWidth: border.strong,
          borderColor: checked ? color.ink : color.lineStrong,
          borderRadius: 3,
        }}
      >
        {checked ? <Icon name="check" size={12} strokeWidth={3.5} color={color.chalk} /> : null}
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
