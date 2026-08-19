/**
 * IconButton — square icon-only button for toolbar-ish actions; `label` is
 * required (icon-only buttons must still say what they do).
 *
 * Sizes sm 28 / md 36 / lg 44 are the drawn box. The *target* is a separate
 * number: the handover sets 60x60 pt minimum on anything used outdoors, above
 * both platforms' guidance, because the user is standing, hot and hurried with
 * a ball in the other hand. hitSlop makes up the difference on every size, so
 * the small visual box never means a small tap.
 */
import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { border, color, radius } from '@/theme/tokens';

import { Icon, IconName } from './Icon';

export interface IconButtonProps {
  name: IconName;
  label: string;
  variant?: 'ghost' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SIZES = { sm: { box: 28, icon: 15 }, md: { box: 36, icon: 18 }, lg: { box: 44, icon: 20 } };

/** Handover §7: 60x60 pt minimum on anything used outdoors. */
export const MIN_TARGET = 60;

const VARIANTS = {
  ghost: { bg: 'transparent', bgPressed: color.ghostPressed, fg: color.ink, borderColor: 'transparent' },
  primary: { bg: color.ink, bgPressed: color.inkDeep, fg: color.chalk, borderColor: 'transparent' },
  secondary: { bg: color.paper, bgPressed: color.line, fg: color.ink, borderColor: color.ink },
} as const;

export function IconButton({
  name,
  label,
  variant = 'ghost',
  size = 'md',
  disabled,
  onPress,
  style,
  testID,
}: IconButtonProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  // Pad every side out to the 60 pt outdoor minimum, whatever the drawn size.
  const slop = Math.max(Math.ceil((MIN_TARGET - s.box) / 2), 0);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={slop}
      testID={testID}
      style={({ pressed }) => [
        {
          width: s.box,
          height: s.box,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderWidth: border.strong,
          borderColor: disabled ? 'transparent' : v.borderColor,
          borderRadius: radius.r1,
          backgroundColor: disabled ? color.line : pressed ? v.bgPressed : v.bg,
          transform: pressed && !disabled ? [{ translateY: 1 }] : [],
        },
        style,
      ]}
    >
      <Icon name={name} size={s.icon} color={disabled ? color.ink3 : v.fg} />
    </Pressable>
  );
}
