/**
 * S73 — data and privacy.
 *
 * Video is processed on this phone and stays on it. For under-18 accounts data
 * is minimised further, and export is off until a guardian turns it on.
 *
 * Deleting everything is exactly that: there is no cloud copy to restore from,
 * so the dialog says so rather than implying an undo that does not exist.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { Button, Card, Dialog } from '@/components';
import { systemClock } from '@/domain/clock';
import { juniorPolicy } from '@/domain/juniorPolicy';
import type { YouStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/useAppStore';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<YouStackParamList, 'Privacy'>;

export function PrivacyScreen({ navigation }: Props) {
  const { mutate } = useRepos();
  const showToast = useAppStore((s) => s.showToast);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const bowler = useRepoQuery((r) => r.bowler.get());
  const nowYear = new Date(systemClock.now()).getFullYear();
  const policy = bowler ? juniorPolicy(bowler.yob, bowler.consentState, nowYear) : null;

  const deleteEverything = () => {
    mutate((r) => r.deleteEverything());
    setConfirmOpen(false);
    // Back to first run: with the bowler gone there is nothing to return to.
    navigation.getParent()?.getParent()?.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Onboarding' }] }),
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Data and privacy" onBack={() => navigation.goBack()} />

      <Card>
        <Text
          style={{
            fontFamily: font.ui,
            fontSize: text.sm,
            lineHeight: text.sm * leading.body,
            color: color.ink2,
          }}
        >
          Your video is processed on this phone and stays on it
          {policy?.isJunior
            ? ' — under-18 accounts keep everything on-device unless a guardian opts in'
            : ''}
          . Cloud backup only exists once you create an account, and you have not needed one yet.
        </Text>
      </Card>

      <Button
        variant="secondary"
        icon="download"
        full
        disabled={policy ? !policy.exportEnabled : false}
        onPress={() => showToast('Export prepared — measurements as CSV, clips as files.', 'good')}
      >
        Export my data
      </Button>

      {policy && !policy.exportEnabled ? (
        <MonoNote>
          Export is off for under-18 accounts until your guardian turns it on.
        </MonoNote>
      ) : null}

      <Button variant="danger" icon="trash-2" full onPress={() => setConfirmOpen(true)}>
        Delete everything
      </Button>

      <Dialog
        open={confirmOpen}
        title="Delete everything?"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onPress={() => setConfirmOpen(false)}>
              Keep it
            </Button>
            <Button variant="danger" onPress={deleteEverything}>
              Delete
            </Button>
          </>
        }
      >
        Every session, measurement and setting on this phone. There is no cloud copy to restore
        from.
      </Dialog>
    </Screen>
  );
}
