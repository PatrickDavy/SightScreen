/**
 * Input — text field with caps label, hint/error line, optional leading icon
 * and mono suffix (a unit). Errors are honest and say what to do.
 * Never require text entry on a capture screen.
 */
import React, { useState } from 'react';
import { StyleProp, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { border, color, font, radius, text, trackCaps } from '@/theme/tokens';

import { Icon, IconName } from '../core/Icon';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
  suffix?: string;
  style?: StyleProp<ViewStyle>;
}

export function Input({ label, hint, error, icon, suffix, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? color.cherry : focused ? color.ink : color.lineStrong;
  return (
    <View style={style}>
      {label ? (
        <Text
          style={{
            marginBottom: 6,
            fontFamily: font.uiSemi,
            fontSize: text.xs,
            letterSpacing: trackCaps(text.xs),
            textTransform: 'uppercase',
            color: color.ink2,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: 40,
          paddingHorizontal: 12,
          backgroundColor: color.paper,
          borderWidth: border.strong,
          borderColor,
          borderRadius: radius.r1,
        }}
      >
        {icon ? <Icon name={icon} size={16} color={color.ink3} /> : null}
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={color.ink3}
          selectionColor={color.ink}
          style={{
            flex: 1,
            minWidth: 0,
            padding: 0,
            fontFamily: font.ui,
            fontSize: text.md,
            color: color.ink,
          }}
        />
        {suffix ? (
          <Text style={{ fontFamily: font.mono, fontSize: text.sm, color: color.ink3, flexShrink: 0 }}>
            {suffix}
          </Text>
        ) : null}
      </View>
      {error || hint ? (
        <Text
          style={{
            marginTop: 6,
            fontFamily: error ? font.uiSemi : font.ui,
            fontSize: text.xs,
            lineHeight: text.xs * 1.4,
            color: error ? color.cherry : color.ink3,
          }}
        >
          {error || hint}
        </Text>
      ) : null}
    </View>
  );
}
