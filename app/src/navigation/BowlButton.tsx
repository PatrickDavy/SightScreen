/**
 * The centre capture action — oversized, cherry, overhanging the bar. It is the
 * core action of the product and has to be reachable one-handed at the top of a
 * run-up, so the visual circle stays at the design system's 58 while hitSlop
 * takes the effective target past the 60×60 pt outdoor minimum.
 */
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components';
import { color, font, radius, shadow1, sp } from '@/theme/tokens';

import type { RootStackParamList } from './types';

export function BowlButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1.1, alignItems: 'center', gap: 3, paddingTop: 2 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Bowl a session"
        hitSlop={{ top: 12, bottom: 8, left: 8, right: 8 }}
        onPress={() => navigation.navigate('Capture', { type: 'net' })}
        style={({ pressed }) => ({
          width: 58,
          height: 58,
          marginTop: -20,
          borderRadius: radius.pill,
          backgroundColor: pressed ? color.cherryDeep : color.cherry,
          borderWidth: 4,
          borderColor: color.paper,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadow1,
        })}
      >
        <Icon name="video" size={22} color={color.paper} />
      </Pressable>
      <Text
        style={{
          fontFamily: font.uiSemi,
          fontSize: 10,
          letterSpacing: 0.3,
          color: color.ink,
          marginTop: sp[1] / 2,
        }}
      >
        Bowl
      </Text>
    </View>
  );
}
