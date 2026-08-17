/**
 * S01–S07 first run.
 *
 * Two things shape this flow. Account creation is deferred — the first session
 * is captured, processed and reviewed anonymously on this phone, because a
 * registration wall before the aha moment is the single largest drop-off cause
 * in consumer apps and this product's aha is unusually strong. And the age gate
 * is not a formality: it decides the guidelines, the home surface, whether a
 * guardian is looped in, and what leaves the device.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { useRepos } from '@/app/ReposProvider';
import { Badge, Card, Icon, Input, Radio, Select, Tag } from '@/components';
import { systemClock } from '@/domain/clock';
import { guidelineFor, guidelineFootnote } from '@/domain/guidelines';
import { newId } from '@/domain/ids';
import { isJunior, juniorPolicy } from '@/domain/juniorPolicy';
import { Arm, Bowler, BowlingType } from '@/domain/types';
import type { RootStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/useAppStore';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MediaPlaceholder } from '@/ui/MediaPlaceholder';
import { MonoNote } from '@/ui/MonoNote';
import { OnboardingFrame } from '@/ui/OnboardingFrame';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const BOWLING_TYPES: BowlingType[] = ['Pace', 'Fast-medium', 'Medium', 'Spin'];
const GOALS = ['More pace', 'Smoother action', 'Stay injury-free'];

/** Old enough to bowl, young enough to be plausible. */
const YOUNGEST_AGE = 8;
const OLDEST_AGE = 60;

type Step = 'welcome' | 'age' | 'consent' | 'profile' | 'goals' | 'permissions' | 'setup';

export function OnboardingScreen({ navigation }: Props) {
  const { repos, mutate } = useRepos();
  const showToast = useAppStore((s) => s.showToast);

  const nowYear = useMemo(() => new Date(systemClock.now()).getFullYear(), []);
  const years = useMemo(
    () =>
      Array.from({ length: OLDEST_AGE - YOUNGEST_AGE + 1 }, (_, i) =>
        String(nowYear - YOUNGEST_AGE - i),
      ),
    [nowYear],
  );

  const [step, setStep] = useState<Step>('welcome');
  const [yob, setYob] = useState<string>(String(nowYear - 17));
  const [guardianEmail, setGuardianEmail] = useState('');
  const [consentSent, setConsentSent] = useState(false);
  const [arm, setArm] = useState<Arm>('right');
  const [bowlingType, setBowlingType] = useState<BowlingType>('Pace');
  const [heightCm, setHeightCm] = useState('');
  const [armSpanCm, setArmSpanCm] = useState('');
  const [targetSpeed, setTargetSpeed] = useState('');
  const [fix, setFix] = useState<string | null>(null);

  const junior = isJunior(Number(yob), nowYear);
  const guideline = guidelineFor(Number(yob), nowYear);

  const finish = (startCapture: boolean) => {
    const bowler: Bowler = {
      id: newId('bowler', systemClock.now()),
      yob: Number(yob),
      arm,
      type: bowlingType,
      heightCm: heightCm ? Number(heightCm) : null,
      armSpanCm: armSpanCm ? Number(armSpanCm) : null,
      targetSpeedKmh: targetSpeed ? Number(targetSpeed) : null,
      fix,
      unit: 'km/h',
      guardianEmail: junior && guardianEmail ? guardianEmail : null,
      // Junior accounts start restricted: capture and workload work, sharing
      // and export do not, until a guardian consents on their own device.
      consentState: junior ? (consentSent ? 'pending' : 'none') : 'none',
    };
    mutate((r) => r.bowler.save(bowler));

    const policy = juniorPolicy(bowler.yob, bowler.consentState, nowYear);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Tabs',
            params: { screen: policy.landingTab === 'load' ? 'LoadTab' : 'HomeTab' },
          },
        ],
      }),
    );
    if (startCapture) navigation.navigate('Capture', { type: 'net' });
  };

  if (step === 'welcome') {
    return (
      <OnboardingFrame
        eyebrow="S01 · WELCOME"
        title="One phone video. One thing to change. Bowl quicker."
        subtitle="Sightscreen measures your action from a single clip — speed with its error band, the one biggest opportunity in your action, and the workload limits that protect your back. No account needed for your first session."
        ctaLabel="Get started"
        onCta={() => setStep('age')}
        ghostLabel="I already have an account"
        onGhost={() =>
          showToast('Sign-in comes later — your first session runs without an account.')
        }
      />
    );
  }

  if (step === 'age') {
    return (
      <OnboardingFrame
        eyebrow="S02 · AGE GATE"
        title="When were you born?"
        // Never "are you over 18?", which teaches lying.
        subtitle="So we can set safe bowling limits — they change with age."
        ctaLabel="Continue"
        onCta={() => setStep(junior ? 'consent' : 'profile')}
      >
        <Select
          label="Year of birth"
          options={years}
          value={yob}
          onChange={setYob}
          hint={
            junior
              ? 'Under-18: workload comes first and a guardian is looped in.'
              : 'Adult guidelines apply.'
          }
          testID="year-of-birth"
        />
        <MonoNote>{guidelineFootnote(guideline)}</MonoNote>
      </OnboardingFrame>
    );
  }

  if (step === 'consent') {
    return (
      <OnboardingFrame
        eyebrow="S03 · GUARDIAN CONSENT"
        title="A guardian signs off"
        subtitle="They get an email and consent on their own device. Until then: recording and workload work, sharing doesn't."
        ctaLabel={consentSent ? 'Continue' : 'Send consent request'}
        ctaDisabled={!consentSent && !guardianEmail.includes('@')}
        onCta={() => {
          if (consentSent) {
            setStep('profile');
            return;
          }
          setConsentSent(true);
          showToast('Consent request sent. The app keeps working meanwhile.', 'good');
        }}
        ghostLabel="Do this later"
        onGhost={() => setStep('profile')}
      >
        <Input
          label="Guardian email"
          icon="mail"
          inputMode="email"
          autoCapitalize="none"
          value={guardianEmail}
          onChangeText={setGuardianEmail}
          testID="guardian-email"
        />
        {consentSent ? (
          <Card>
            <Badge tone="watch">Pending</Badge>
            <Text
              style={{
                fontFamily: font.ui,
                fontSize: text.xs,
                lineHeight: text.xs * leading.body,
                color: color.ink2,
                marginTop: sp[2],
              }}
            >
              Sent. Read-only workload access for your guardian, alerts on limit breaches, and no
              access to your video by default.
            </Text>
          </Card>
        ) : null}
      </OnboardingFrame>
    );
  }

  if (step === 'profile') {
    return (
      <OnboardingFrame
        eyebrow="S04 · YOUR ACTION"
        title="Your action, on paper"
        ctaLabel="Continue"
        onCta={() => setStep('goals')}
      >
        <View style={{ gap: sp[3] }}>
          <Radio
            label="Right arm"
            value="right"
            checked={arm === 'right'}
            onChange={() => setArm('right')}
          />
          <Radio
            label="Left arm"
            value="left"
            checked={arm === 'left'}
            onChange={() => setArm('left')}
          />
        </View>

        <Select
          label="Bowling type"
          options={BOWLING_TYPES}
          value={bowlingType}
          onChange={(v) => setBowlingType(v as BowlingType)}
        />

        <Input
          label="Height"
          suffix="cm"
          inputMode="numeric"
          value={heightCm}
          onChangeText={setHeightCm}
          testID="height-cm"
        />
        <Input
          label="Arm span"
          suffix="cm"
          inputMode="numeric"
          value={armSpanCm}
          onChangeText={setArmSpanCm}
          testID="arm-span-cm"
        />

        <MonoNote>
          Why arm span: it correlates strongly with release speed and it can&apos;t be changed.
          Better you know what&apos;s levers and what&apos;s given, from minute one.
        </MonoNote>
      </OnboardingFrame>
    );
  }

  if (step === 'goals') {
    return (
      <OnboardingFrame
        eyebrow="S05 · GOALS"
        title="Where are you headed?"
        subtitle="Optional — it frames your first insight."
        ctaLabel="Continue"
        onCta={() => setStep('permissions')}
        ghostLabel="Skip"
        onGhost={() => setStep('permissions')}
      >
        <Input
          label="Target speed"
          suffix="km/h"
          inputMode="numeric"
          value={targetSpeed}
          onChangeText={setTargetSpeed}
        />
        <View style={{ gap: sp[2] }}>
          <MonoNote>WHAT DO YOU WANT TO FIX?</MonoNote>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: sp[2] }}>
            {GOALS.map((goal) => (
              <Tag
                key={goal}
                selected={fix === goal}
                onPress={() => setFix(fix === goal ? null : goal)}
              >
                {goal}
              </Tag>
            ))}
          </View>
        </View>
      </OnboardingFrame>
    );
  }

  if (step === 'permissions') {
    const primers: { icon: 'camera' | 'hard-drive' | 'bell'; title: string; body: string }[] = [
      {
        icon: 'camera',
        title: 'Camera',
        body: 'Asked right before your first recording.',
      },
      {
        icon: 'hard-drive',
        title: 'Storage',
        body: '240 fps clips are big; kept on this phone.',
      },
      {
        icon: 'bell',
        title: 'Notifications',
        body: 'Only workload alerts, retest prompts and processing done. Nothing else — asked after your first session.',
      },
    ];

    return (
      <OnboardingFrame
        eyebrow="S06 · PERMISSIONS"
        title="We'll ask when it matters"
        subtitle="Each permission is requested at the moment it's needed, not now."
        ctaLabel="Continue"
        onCta={() => setStep('setup')}
      >
        {primers.map((primer) => (
          <Card key={primer.title}>
            <View style={{ flexDirection: 'row', gap: sp[3], alignItems: 'flex-start' }}>
              <Icon name={primer.icon} size={18} color={color.ink2} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={{ fontFamily: font.uiSemi, fontSize: text.sm, color: color.ink }}>
                  {primer.title}
                </Text>
                <Text
                  style={{
                    fontFamily: font.ui,
                    fontSize: text.xs,
                    lineHeight: text.xs * leading.body,
                    color: color.ink2,
                  }}
                >
                  {primer.body}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </OnboardingFrame>
    );
  }

  return (
    <OnboardingFrame
      eyebrow="S07 · SETUP"
      title="Stand the phone here"
      ctaLabel="Bowl your first session"
      onCta={() => finish(true)}
      ghostLabel="Go to home"
      onGhost={() => finish(false)}
    >
      <MediaPlaceholder
        height={200}
        framed
        creaseAt={0.78}
        caption={'SIDE-ON · LEVEL WITH THE POPPING CREASE'}
      />
      <MonoNote>8–10 M FROM THE PITCH · TRIPOD AT HIP HEIGHT</MonoNote>
      <Text
        style={{
          fontFamily: font.ui,
          fontSize: text.sm,
          lineHeight: text.sm * leading.body,
          color: color.ink2,
        }}
      >
        Landscape, side-on, crease and stumps both in frame. The app checks all of this live before
        you bowl, so you can&apos;t silently get it wrong.
      </Text>
    </OnboardingFrame>
  );
}
