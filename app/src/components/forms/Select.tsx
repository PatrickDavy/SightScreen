/**
 * Select — for 4+ options; 2–3 options use SegmentedControl instead.
 * The web <select> becomes a trigger field + modal option sheet, keeping the
 * caps label and hint/error line verbatim.
 */
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleProp, Text, View, ViewStyle } from 'react-native';

import { border, color, font, radius, shadow2, text, trackCaps } from '@/theme/tokens';

import { Icon } from '../core/Icon';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  options?: (string | SelectOption)[];
  value?: string;
  onChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Select({ label, hint, error, options = [], value, onChange, style, testID }: SelectProps) {
  const [open, setOpen] = useState(false);
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const current = opts.find((o) => o.value === value);
  const borderColor = error ? color.cherry : open ? color.ink : color.lineStrong;
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: current?.label ?? '' }}
        onPress={() => setOpen(true)}
        testID={testID}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 40,
          paddingLeft: 12,
          paddingRight: 10,
          backgroundColor: color.paper,
          borderWidth: border.strong,
          borderColor,
          borderRadius: radius.r1,
        }}
      >
        <Text style={{ flex: 1, fontFamily: font.ui, fontSize: text.md, color: color.ink }}>
          {current?.label ?? ''}
        </Text>
        <Icon name="chevron-down" size={16} color={color.ink2} />
      </Pressable>
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
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: color.overlay, justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}
        >
          <View
            style={{
              backgroundColor: color.paper,
              borderTopLeftRadius: radius.r2 + 4,
              borderTopRightRadius: radius.r2 + 4,
              paddingVertical: 8,
              maxHeight: 420,
              ...shadow2,
            }}
            onStartShouldSetResponder={() => true}
          >
            {label ? (
              <Text
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
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
            <ScrollView>
              {opts.map((o) => {
                const selected = o.value === value;
                return (
                  <Pressable
                    key={o.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onChange?.(o.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: 48,
                      paddingHorizontal: 20,
                      backgroundColor: pressed ? color.chalk : 'transparent',
                    })}
                  >
                    <Text
                      style={{
                        fontFamily: selected ? font.uiSemi : font.ui,
                        fontSize: text.md,
                        color: color.ink,
                      }}
                    >
                      {o.label}
                    </Text>
                    {selected ? <Icon name="check" size={16} color={color.ink} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
