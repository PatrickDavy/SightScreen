/**
 * The shape every onboarding step takes: an S-ID eyebrow, a display title, a
 * line of explanation, the body, and the actions pinned at the bottom.
 *
 * The whole flow is meant to reach the first capture in under three minutes, so
 * each step asks for one thing and says why it is asking.
 */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';

export interface OnboardingFrameProps {
  /** Mono eyebrow, e.g. "S02 · AGE GATE". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  ghostLabel?: string;
  onGhost?: () => void;
}

export function OnboardingFrame({
  eyebrow,
  title,
  subtitle,
  children,
  ctaLabel,
  onCta,
  ctaDisabled,
  ghostLabel,
  onGhost,
}: OnboardingFrameProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, backgroundColor: color.surfaceApp, paddingTop: insets.top + sp[4] }}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: sp[4], paddingBottom: sp[6], gap: sp[4] }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: sp[2] }}>
          <MonoNote>{eyebrow}</MonoNote>
          <Text
            style={{
              fontFamily: font.display,
              fontSize: 30,
              lineHeight: 30 * leading.tight,
              color: color.ink,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                fontFamily: font.ui,
                fontSize: 13.5,
                lineHeight: 13.5 * leading.body,
                color: color.ink2,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {children}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: sp[4],
          paddingBottom: Math.max(insets.bottom, sp[5]),
          gap: sp[2],
        }}
      >
        <Button size="lg" full disabled={ctaDisabled} onPress={onCta} testID="onboarding-cta">
          {ctaLabel}
        </Button>
        {ghostLabel && onGhost ? (
          <Button variant="ghost" full onPress={onGhost}>
            {ghostLabel}
          </Button>
        ) : null}
      </View>
    </View>
  );
}
