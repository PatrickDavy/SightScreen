/**
 * Tabs — underline tabs (the crease line) for sectioning one screen; 2–4
 * items, short labels. NOT for app-level navigation.
 */
import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, font, text } from '@/theme/tokens';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items?: (string | TabItem)[];
  value?: string;
  onChange?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function Tabs({ items = [], value, onChange, style }: TabsProps) {
  const tabs = items.map((i) => (typeof i === 'string' ? { id: i, label: i } : i));
  return (
    <View
      accessibilityRole="tablist"
      style={[
        {
          flexDirection: 'row',
          gap: 20,
          borderBottomWidth: border.hair,
          borderBottomColor: color.line,
        },
        style,
      ]}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange?.(t.id)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 2,
              marginBottom: -1,
              borderBottomWidth: 2,
              borderBottomColor: active ? color.ink : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: font.uiSemi,
                fontSize: text.sm,
                lineHeight: text.sm + 1,
                letterSpacing: text.sm * 0.02,
                color: active ? color.ink : color.ink3,
              }}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
