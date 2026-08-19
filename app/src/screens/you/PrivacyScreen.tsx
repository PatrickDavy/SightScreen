/**
 * S73 — data and privacy.
 *
 * Video is processed on this phone and stays on it. For under-18 accounts data
 * is minimised further and export is off. It does not say a guardian can turn
 * it on: guardian consent (S03) was removed because nothing ever delivered it,
 * and copy that points at a switch nobody can reach is the same lie in a
 * quieter place.
 *
 * Deleting everything is exactly that: there is no cloud copy to restore from,
 * so the dialog says so rather than implying an undo that does not exist.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text } from 'react-native';

import { useRepoQuery, useRepos } from '@/app/ReposProvider';
import { useCapabilities } from '@/capabilities/context';
import { Button, Card, Dialog, Switch } from '@/components';
import { systemClock } from '@/domain/clock';
import { buildExport, exportFolderName } from '@/domain/export';
import { juniorPolicy } from '@/domain/juniorPolicy';
import { ANALYTICS_KEY } from '@/app/boot';
import type { YouStackParamList } from '@/navigation/types';
import { setAnalyticsEnabled } from '@/services/analytics';
import { useAppStore } from '@/store/useAppStore';
import { color, font, leading, sp, text } from '@/theme/tokens';
import { MonoNote } from '@/ui/MonoNote';
import { Screen } from '@/ui/Screen';
import { ScreenHeader } from '@/ui/ScreenHeader';

type Props = NativeStackScreenProps<YouStackParamList, 'Privacy'>;

export function PrivacyScreen({ navigation }: Props) {
  const { repos, mutate } = useRepos();
  const { files } = useCapabilities();
  const showToast = useAppStore((s) => s.showToast);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const bowler = useRepoQuery((r) => r.bowler.get());
  const analyticsRaw = useRepoQuery((r) => r.settings.get(ANALYTICS_KEY));
  const analyticsOn = analyticsRaw !== 'off';
  const nowYear = new Date(systemClock.now()).getFullYear();
  const policy = bowler ? juniorPolicy(bowler.yob, bowler.consentState, nowYear) : null;

  /**
   * Write the whole local record out as CSV and offer it to the share sheet.
   *
   * Reported honestly in both directions: the toast says what was written, and
   * a failure says it failed rather than claiming a file that does not exist.
   * The old version of this button showed a success toast and produced nothing.
   */
  const exportEverything = async () => {
    setExporting(true);
    try {
      const at = systemClock.now();
      const summaries = repos.sessions.listSummaries();
      const deliveries = summaries.flatMap((s) => repos.deliveries.listForSession(s.session.id));
      const built = buildExport(
        {
          summaries,
          deliveries,
          metrics: deliveries.flatMap((d) => repos.metrics.listForDelivery(d.id)),
          workload: repos.workload.all(),
          clipPaths: [
            ...summaries.map((s) => s.session.clipPath),
            ...deliveries.map((d) => d.clipPath),
          ].filter((p): p is string => !!p),
        },
        at,
      );

      const written = await files.writeExport(exportFolderName(at), built);
      const shared = await files.share(written.directoryUri);

      showToast(
        shared
          ? `Exported ${built.length} files — ${deliveries.length} deliveries, ${summaries.length} sessions.`
          : `Exported ${built.length} files to this phone. Sharing is unavailable here.`,
        'good',
      );
    } catch {
      showToast('Export failed. Nothing was written.', 'over');
    } finally {
      setExporting(false);
    }
  };

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
            ? ' — under-18 accounts keep everything on this phone'
            : ''}
          . Cloud backup only exists once you create an account, and you have not needed one yet.
        </Text>
      </Card>

      <Button
        variant="secondary"
        icon="download"
        full
        disabled={exporting || (policy ? !policy.exportEnabled : false)}
        onPress={exportEverything}
        testID="export-my-data"
      >
        {exporting ? 'Preparing your data' : 'Export my data'}
      </Button>

      {policy && !policy.exportEnabled ? (
        <MonoNote>Export is off for under-18 accounts.</MonoNote>
      ) : null}

      {/*
        Stated as what actually happens, not as a policy summary. Right now the
        honest answer is that nothing leaves the device at all — no provider is
        wired up (#56) — and saying so is more useful than a hedge that will
        still read as true after one is.
      */}
      <Card>
        <Switch
          label="Usage analytics"
          checked={analyticsOn}
          onChange={(next) => {
            setAnalyticsEnabled(next);
            mutate((r) => r.settings.set(ANALYTICS_KEY, next ? 'on' : 'off'));
          }}
        />
        <Text
          style={{
            marginTop: sp[2],
            fontFamily: font.ui,
            fontSize: text.xs,
            lineHeight: text.xs * leading.body,
            color: color.ink2,
          }}
        >
          Which screens you reach and where capture fails, so the parts that break can be found.
          Never your video, never your pose data, never a measurement. No analytics provider is
          connected yet, so at present nothing leaves this phone either way.
        </Text>
      </Card>

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
