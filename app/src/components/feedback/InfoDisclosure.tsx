/**
 * InfoDisclosure — the mobile replacement for the web Tooltip (hover has no
 * touch equivalent). Tap to expand a short inline definition. Never hide a
 * number or a limit in one.
 */
import React, { useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { color, font, radius, text } from '@/theme/tokens';

import { Icon } from '../core/Icon';

export interface InfoDisclosureProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function InfoDisclosure({ label, children, style }: InfoDisclosureProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((o) => !o)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        {children}
        <Icon name="info" size={14} color={color.ink3} />
      </Pressable>
      {open ? (
        <View
          style={{
            marginTop: 6,
            paddingVertical: 5,
            paddingHorizontal: 9,
            backgroundColor: color.ink,
            borderRadius: radius.r1,
            alignSelf: 'flex-start',
          }}
        >
          <Text
            style={{
              fontFamily: font.uiMedium,
              fontSize: text.xs,
              lineHeight: text.xs * 1.35,
              color: color.chalk,
            }}
          >
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
