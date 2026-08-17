/**
 * CueCard — the product's promise as a component: one imperative cue, its
 * estimated gain, and the evidence. The only ink-inverse card in the system;
 * the loudest object on any screen, so never more than one per screen.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, font, radius, text } from '@/theme/tokens';

import { Icon } from '../core/Icon';

export interface CueCardProps {
  eyebrow?: string;
  cue?: React.ReactNode;
  gain?: string;
  detail?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function CueCard({
  eyebrow = 'The one thing',
  cue,
  gain,
  detail,
  actionLabel,
  onAction,
  style,
  testID,
}: CueCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: color.surfaceInverse,
          borderRadius: radius.r2,
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 18,
        },
        style,
      ]}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <Icon name="target" size={13} strokeWidth={2.5} color={color.cherrySoft} />
        <Text
          style={{
            fontFamily: font.uiBold,
            fontSize: text.xxs,
            letterSpacing: text.xxs * 0.12,
            textTransform: 'uppercase',
            color: color.cherrySoft,
          }}
        >
          {eyebrow}
        </Text>
      </View>
      <Text
        style={{
          marginTop: 10,
          fontFamily: font.displaySemi,
          fontSize: text.xxl,
          lineHeight: text.xxl * 1.08,
          color: color.textInverse,
        }}
      >
        {cue}
      </Text>
      {gain ? (
        <Text
          style={{ marginTop: 6, fontFamily: font.mono, fontSize: text.sm, color: color.turfSoft }}
        >
          {gain}
        </Text>
      ) : null}
      {detail ? (
        <Text
          style={{
            marginTop: 10,
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * 1.5,
            color: color.textInverseMuted,
          }}
        >
          {detail}
        </Text>
      ) : null}
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 8,
            marginTop: 16,
            height: 36,
            paddingHorizontal: 14,
            backgroundColor: pressed ? color.inversePressed : 'transparent',
            borderWidth: border.strong,
            borderColor: color.chalk,
            borderRadius: radius.r1,
          })}
        >
          <Icon name="play" size={15} color={color.chalk} />
          <Text
            style={{
              fontFamily: font.uiSemi,
              fontSize: text.sm,
              lineHeight: text.sm + 1,
              color: color.chalk,
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
