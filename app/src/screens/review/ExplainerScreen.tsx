/**
 * S32 — what a metric is, why it links to speed, how this app measures it, what
 * the measurement cannot see, and the research behind it.
 *
 * The limitations section is not a disclaimer to be buried. Showing the working
 * is the honesty position rendered as UI, and the defence against the
 * credibility problem that has already bitten a competitor.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import { Card } from '@/components';
import { DETERMINANTS } from '@/domain/content/determinants';
import { explainerFor } from '@/domain/content/explainers';
import type { HomeStackParamList } from '@/navigation/types';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { SectionLabel } from '@/ui/SectionLabel';

type Props = NativeStackScreenProps<HomeStackParamList, 'Explainer'>;

function Section({ label, body }: { label: string; body: string }) {
  return (
    <View style={{ gap: sp[2] }}>
      <SectionLabel>{label}</SectionLabel>
      <Text
        style={{
          fontFamily: font.ui,
          fontSize: text.sm,
          lineHeight: text.sm * leading.body,
          color: color.ink2,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

export function ExplainerScreen({ navigation, route }: Props) {
  const { determinantKey } = route.params;
  const determinant = DETERMINANTS[determinantKey];
  const explainer = explainerFor(determinantKey);

  if (!determinant || !explainer) {
    return (
      <Screen>
        <ScreenHeader title="Back" onBack={() => navigation.goBack()} />
        <MonoNote>No explainer for that measurement.</MonoNote>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title={determinant.name} onBack={() => navigation.goBack()} />

      {/* A reference range is not a measurement, so it is not set in Metric and
          carries no error band — it would be false precision to give it one. */}
      <Card>
        <SectionLabel>Where quicker bowlers sit</SectionLabel>
        <Text
          style={{
            fontFamily: font.monoSemi,
            fontSize: text.lg,
            color: color.ink,
            marginTop: sp[2],
          }}
        >
          {determinant.range.good[0]}–{determinant.range.good[1]} {determinant.unit}
        </Text>
        <View style={{ marginTop: sp[2] }}>
          <MonoNote>{determinant.ref}</MonoNote>
        </View>
      </Card>

      <Section label="What it is" body={explainer.whatItIs} />
      <Section label="Why it links to speed" body={explainer.whyItLinks} />
      <Section label="How it's measured here" body={explainer.howMeasured} />
      <Section label="Limitations" body={explainer.limitations} />
      <Section label="Research" body={explainer.research} />
    </Screen>
  );
}
