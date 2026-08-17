/**
 * Screen behaviour during capture: the phone is twenty metres away in sunlight
 * for several minutes with nobody touching it, so it must not dim, must not
 * sleep, and must be landscape. All three are scoped to the session and undone
 * when it ends.
 */
import * as Brightness from 'expo-brightness';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';

import { ScreenControl } from './types';

const KEEP_AWAKE_TAG = 'sightscreen-capture';

/**
 * Run a device call and ignore whatever it does wrong.
 *
 * Every call in here is an enhancement — a brighter screen, a held wake lock —
 * and none is worth interrupting a spell for. A plain try/catch is not enough:
 * these reject as often as they throw, and an unhandled rejection during
 * capture is a crash on some platforms.
 */
async function attempt(fn: () => unknown): Promise<void> {
  try {
    await fn();
  } catch {
    // Deliberately swallowed; the session continues either way.
  }
}

export function createScreenControl(): ScreenControl {
  // The wake lock rejects if released before it finished acquiring, which is
  // easy to hit when a bowler taps to end almost immediately.
  let keepAwake: Promise<unknown> | null = null;

  return {
    async beginCaptureMode() {
      keepAwake = activateKeepAwakeAsync(KEEP_AWAKE_TAG);
      await attempt(() => keepAwake);
      // App-scoped brightness needs no permission and cannot outlive the app.
      await attempt(() => Brightness.setBrightnessAsync(1));
      // The S21 check already told the bowler to turn the phone, so a failed
      // lock does not stop them bowling.
      await attempt(() =>
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE),
      );
    },

    async endCaptureMode() {
      // Let the acquisition settle first, so releasing cannot outrun it.
      await attempt(() => keepAwake);
      keepAwake = null;
      await attempt(() => deactivateKeepAwake(KEEP_AWAKE_TAG));
      await attempt(() => Brightness.restoreSystemBrightnessAsync());
      await attempt(() => ScreenOrientation.unlockAsync());
    },
  };
}
