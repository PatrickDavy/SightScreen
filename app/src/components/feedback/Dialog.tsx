/**
 * Dialog — modal for one decision, over an unblurred ink overlay. Title states
 * the decision; footer holds Buttons — cancel as secondary, confirm as primary
 * (danger if destructive).
 */
import React from 'react';
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { color, font, leading, radius, shadow2, text } from '@/theme/tokens';

import { IconButton } from '../core/IconButton';

export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
}

export function Dialog({ open, title, onClose, footer, width = 440, children }: DialogProps) {
  const { width: screenW } = useWindowDimensions();
  if (!open) return null;
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: color.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        onPress={onClose}
      >
        <View
          accessibilityViewIsModal
          onStartShouldSetResponder={() => true}
          style={{
            width: '100%',
            maxWidth: Math.min(width, screenW - 40),
            backgroundColor: color.paper,
            borderRadius: radius.r2,
            padding: 20,
            ...shadow2,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                flexShrink: 1,
                fontFamily: font.uiBold,
                fontSize: text.lg,
                lineHeight: text.lg * 1.25,
                color: color.ink,
              }}
            >
              {title}
            </Text>
            {onClose ? (
              <IconButton
                name="x"
                label="Close"
                size="sm"
                onPress={onClose}
                style={{ marginTop: -4, marginRight: -6 }}
              />
            ) : null}
          </View>
          {typeof children === 'string' ? (
            <Text
              style={{
                fontFamily: font.ui,
                fontSize: text.md,
                lineHeight: text.md * leading.body,
                color: color.ink2,
              }}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {footer ? (
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </Pressable>
    </Modal>
  );
}
