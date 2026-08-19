/**
 * S01–S07 first run.
 *
 * Two things shape this flow. Account creation is deferred — the first session
 * is captured, processed and reviewed anonymously on this phone, because a
 * registration wall before the aha moment is the single largest drop-off cause
 * in consumer apps and this product's aha is unusually strong. And the age gate
 * is not a formality: it decides the guidelines, the home surface, and what
 * leaves the device.
 *
 * S03 — guardian consent — is deliberately absent. It collected a guardian's
 * email address and told the bowler a consent request had been sent, while
 * sending nothing: the app has no networking, so nobody was ever contacted.
 * Consent has to be completed on the guardian's own device, which needs a
 * service that does not exist. Until it does, the flow does not claim otherwise.
 * `ConsentState` stays in the domain layer for when it is reinstated.
 *
 * With consent gone, the gate has to do the stopping: v1 is 18 and over, so an
 * under-18 year of birth ends the flow at S02 rather than passing through it.
 * Existing junior accounts are left alone — the gate blocks new sign-ups, it
 * does not evict anyone who is already here.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { useRepos } from '@/app/ReposProvider';
import { Card, Icon, Input, Radio, Select, Tag } from '@/components';
import { meetsMinimumAge } from '@/domain/accountAge';
import { systemClock } from '@/domain/clock';
import { guidelineFor, guidelineFootnote } from '@/domain/guidelines';
import { newId } from '@/domain/ids';
import { isJunior, juniorPolicy } from '@/domain/juniorPolicy';
import { Arm, Bowler, BowlingType } from '@/domain/types';
import type { RootStackParamList } from '@/navigation/types';
import { track } from '@/services/analytics';
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

type Step = 'welcome' | 'age' | 'blocked' | 'profile' | 'goals' | 'permissions' | 'setup';

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
  const [yob, setYob] = useState<string>(String(nowYear - 25));
  const [arm, setArm] = useState<Arm>('right');
  const [bowlingType, setBowlingType] = useState<BowlingType>('Pace');
  const [heightCm, setHeightCm] = useState('');
  const [armSpanCm, setArmSpanCm] = useState('');
  const [targetSpeed, setTargetSpeed] = useState('');
  const [fix, setFix] = useState<string | null>(null);

  const junior = isJunior(Number(yob), nowYear);
  const oldEnough = meetsMinimumAge(Number(yob), nowYear);
  const guideline = guidelineFor(Number(yob), nowYear);

  const finish = (startCapture: boolean) => {
    // Unreachable from the flow — S02 stops an under-age bowler before profile.
    // It is here so that a future entry point cannot create an account the age
    // gate would have refused.
    if (!meetsMinimumAge(Number(yob), nowYear)) {
      throw new Error('Sightscreen accounts are 18 and over');
    }

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
      guardianEmail: null,
      // No consent can be recorded while there is no way to obtain one. Junior
      // accounts therefore stay restricted: capture and workload work, sharing
      // and export do not.
      consentState: 'none',
    };
    mutate((r) => r.bowler.save(bowler));
    track('onboarding_complete', { junior, consent: bowler.consentState });

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
        onCta={() => setStep(oldEnough ? 'profile' : 'blocked')}
      >
        <Select
          label="Year of birth"
          options={years}
          value={yob}
          onChange={setYob}
          hint={
            oldEnough
              ? 'Adult guidelines apply.'
              : 'Sightscreen is 18 and over for now.'
          }
          testID="year-of-birth"
        />
        <MonoNote>{guidelineFootnote(guideline)}</MonoNote>
      </OnboardingFrame>
    );
  }

  if (step === 'blocked') {
    return (
      <OnboardingFrame
        eyebrow="S02 · AGE GATE"
        title="Sightscreen is 18 and over for now"
        subtitle="Not because your bowling isn't worth measuring. An under-18 account needs a guardian to consent on their own device, and that isn't built yet. We'd rather leave you out than run those protections badly."
        ctaLabel="Change year of birth"
        onCta={() => setStep('age')}
      >
        <MonoNote>NO ACCOUNT WAS CREATED · NOTHING WAS SAVED</MonoNote>
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
