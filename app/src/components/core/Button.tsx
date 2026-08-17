/**
 * Button — the push button; labels are sentence-case imperatives.
 * Variants: primary (ink — the default; never cherry), secondary (outlined),
 * ghost, danger (cherry, destructive/over-limit only). Hover states dropped on
 * touch; press = background one step darker + 1px translate down.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, font, radius } from '@/theme/tokens';

import { Icon, IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  full?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
}

const SIZES: Record<ButtonSize, { h: number; f: number; px: number; icon: number }> = {
  sm: { h: 32, f: 13, px: 12, icon: 15 },
  md: { h: 40, f: 15, px: 16, icon: 17 },
  lg: { h: 48, f: 16, px: 20, icon: 18 },
};

const VARIANTS: Record<
  ButtonVariant,
  { bg: string; bgPressed: string; text: string; borderColor: string }
> = {
  primary: { bg: color.ink, bgPressed: color.inkDeep, text: color.chalk, borderColor: 'transparent' },
  secondary: { bg: color.paper, bgPressed: color.line, text: color.ink, borderColor: color.ink },
  ghost: { bg: 'transparent', bgPressed: color.ghostPressed, text: color.ink, borderColor: 'transparent' },
  danger: { bg: color.cherry, bgPressed: color.dangerPressed, text: '#FFFFFF', borderColor: 'transparent' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  full,
  onPress,
  style,
  children,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height: s.h,
          paddingHorizontal: s.px,
          // 1.5px border on every variant so heights never shift.
          borderWidth: border.strong,
          borderColor: disabled ? 'transparent' : v.borderColor,
          borderRadius: radius.r1,
          backgroundColor: disabled ? color.line : pressed ? v.bgPressed : v.bg,
          transform: pressed && !disabled ? [{ translateY: 1 }] : [],
          alignSelf: full ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={s.icon} color={disabled ? color.ink3 : v.text} /> : null}
      <Text
        style={{
          fontFamily: font.uiSemi,
          fontSize: s.f,
          lineHeight: s.f,
          color: disabled ? color.ink3 : v.text,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
