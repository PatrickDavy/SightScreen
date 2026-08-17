/**
 * S23 — arm it and walk away. The last touch of the session, so everything the
 * bowler might want mid-spell has to be decided here.
 */
import React from 'react';
import { Text, View } from 'react-native';

import { Badge, Button, Select, Switch } from '@/components';
import { CapacityEstimate, capacityLine } from '@/domain/capacity';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';

import { COUNTDOWN_OPTIONS } from '../captureMachine';

export interface ReadyStepProps {
  countdownSeconds: number;
  onCountdownChange: (seconds: number) => void;
  audioEnabled: boolean;
  onAudioChange: (enabled: boolean) => void;
  spokenEnabled: boolean;
  onSpokenChange: (enabled: boolean) => void;
  capacity: CapacityEstimate | null;
  batteryLevel: number;
  /** Set when a placement check was continued past. */
  lowConfidenceWarning: boolean;
  onArm: () => void;
}

export function ReadyStep({
  countdownSeconds,
  onCountdownChange,
  audioEnabled,
  onAudioChange,
  spokenEnabled,
  onSpokenChange,
  capacity,
  batteryLevel,
  lowConfidenceWarning,
  onArm,
}: ReadyStepProps) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: sp[4], paddingTop: sp[4], gap: sp[4] }}>
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm + 1,
            lineHeight: (text.sm + 1) * leading.body,
            color: color.ink2,
          }}
        >
          Arm it, walk to your mark, bowl. The screen stays readable from 20 m; a tone confirms each
          delivery. Tap the screen when you&apos;re done.
        </Text>

        <Select
          label="Countdown"
          options={COUNTDOWN_OPTIONS.map((s) => ({ value: String(s), label: `${s} s` }))}
          value={String(countdownSeconds)}
          onChange={(v) => onCountdownChange(Number(v))}
          testID="countdown-select"
        />

        <Switch
          label="Audio confirmation per delivery"
          checked={audioEnabled}
          onChange={onAudioChange}
        />
        <Switch label="Speak the speed aloud" checked={spokenEnabled} onChange={onSpokenChange} />

        {capacity ? (
          <View style={{ gap: sp[2] }}>
            <MonoNote>{capacityLine(capacity, batteryLevel)}</MonoNote>
            {capacity.lowBattery ? <Badge tone="watch">Battery low</Badge> : null}
            {capacity.lowStorage ? <Badge tone="watch">Storage low</Badge> : null}
          </View>
        ) : null}

        {lowConfidenceWarning ? (
          <View style={{ gap: sp[2] }}>
            <Badge tone="watch">Low confidence</Badge>
            <MonoNote>
              A placement check was skipped, so every delivery this session is marked
              low-confidence. They stay in your log but sit outside your trend.
            </MonoNote>
          </View>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: sp[4], paddingBottom: sp[6] }}>
        <Button size="lg" full icon="video" onPress={onArm} testID="arm-button">
          Arm and walk away
        </Button>
      </View>
    </View>
  );
}
