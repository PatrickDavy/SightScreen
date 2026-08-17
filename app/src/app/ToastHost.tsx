/**
 * Toast has no portal, no stacking and no timer of its own — it is a plain
 * presentational component. This supplies all three, once, above the navigator.
 */
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toast } from '@/components';
import { sp } from '@/theme/tokens';
import { useAppStore } from '@/store/useAppStore';

/** Long enough to read a sentence at a glance, short enough not to nag. */
const DISMISS_AFTER_MS = 3400;

function ToastItemView({ id, tone, text }: { id: string; tone: 'neutral' | 'good' | 'watch' | 'over'; text: string }) {
  const dismissToast = useAppStore((s) => s.dismissToast);

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(id), DISMISS_AFTER_MS);
    return () => clearTimeout(timer);
  }, [id, dismissToast]);

  return (
    <Toast tone={tone} onDismiss={() => dismissToast(id)}>
      {text}
    </Toast>
  );
}

export function ToastHost() {
  const toasts = useAppStore((s) => s.toasts);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: sp[4],
        right: sp[4],
        // Clear of the tab bar, which the host sits above and cannot measure.
        bottom: insets.bottom + 84,
        alignItems: 'center',
        gap: sp[2],
      }}
    >
      {toasts.map((t) => (
        <ToastItemView key={t.id} id={t.id} tone={t.tone} text={t.text} />
      ))}
    </View>
  );
}
