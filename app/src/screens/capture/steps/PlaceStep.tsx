/** S21 — where to put the phone, with four live checks. */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button, Icon } from '@/components';
import { border, color, font, leading, radius, sp, text } from '@/theme/tokens';
import { MediaPlaceholder } from '@/ui/MediaPlaceholder';

import { PlacementCheck, allChecksPass } from '../placementChecks';

export interface PlaceStepProps {
  checks: PlacementCheck[];
  /** A calibration already exists for this venue, so S22 can be skipped. */
  calibrated: boolean;
  onCalibrate: () => void;
  onContinue: (overrode: boolean) => void;
}

export function PlaceStep({ checks, calibrated, onCalibrate, onContinue }: PlaceStepProps) {
  const allOk = allChecksPass(checks);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: sp[4], gap: sp[3] }}>
        <MediaPlaceholder height={170} framed creaseAt={0.75} caption="LIVE PREVIEW" />

        <View style={{ gap: sp[2] }}>
          {checks.map((check) => (
            <View
              key={check.key}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: sp[3],
                paddingVertical: 10,
                paddingHorizontal: sp[3],
                backgroundColor: color.surfaceCard,
                borderWidth: border.hair,
                borderColor: color.line,
                borderRadius: radius.r1,
              }}
            >
              <Icon
                name={check.ok ? 'circle-check' : 'circle-alert'}
                size={17}
                color={check.ok ? color.turf : color.amber}
                style={{ marginTop: 1 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontFamily: font.uiMedium, fontSize: 13.5, color: color.ink }}
                  accessibilityLabel={`${check.label}: ${check.ok ? 'ready' : 'needs attention'}`}
                >
                  {check.label}
                </Text>
                {!check.ok ? (
                  <Text
                    style={{
                      fontFamily: font.ui,
                      fontSize: text.xs,
                      lineHeight: text.xs * leading.body,
                      color: color.ink2,
                      marginTop: 2,
                    }}
                  >
                    {check.fix}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {!allOk ? (
          <Text
            style={{
              fontFamily: font.ui,
              fontSize: text.xs,
              lineHeight: text.xs * leading.body,
              color: color.ink3,
            }}
          >
            You can continue anyway — affected deliveries get marked low-confidence rather than
            hidden.
          </Text>
        ) : null}
      </ScrollView>

      <View style={{ paddingHorizontal: sp[4], paddingBottom: sp[6], gap: sp[2] }}>
        {calibrated ? (
          <Button size="lg" full onPress={() => onContinue(!allOk)}>
            Continue
          </Button>
        ) : (
          <>
            <Button size="lg" full onPress={onCalibrate}>
              Mark crease and stumps
            </Button>
            <Button variant="ghost" full onPress={() => onContinue(!allOk)}>
              Continue anyway
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
