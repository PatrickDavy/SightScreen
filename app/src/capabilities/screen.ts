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

export function createScreenControl(): ScreenControl {
  return {
    async beginCaptureMode() {
      try {
        await activateKeepAwakeAsync(KEEP_AWAKE_TAG);
      } catch {
        // Worst case the screen sleeps; audio still carries the session.
      }
      try {
        // App-scoped, so it needs no permission and cannot outlive the app.
        await Brightness.setBrightnessAsync(1);
      } catch {
        // Unsupported on web and some Android builds.
      }
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch {
        // The S21 check already told the bowler to turn the phone; a failed
        // lock does not stop them bowling.
      }
    },

    async endCaptureMode() {
      try {
        deactivateKeepAwake(KEEP_AWAKE_TAG);
      } catch {
        // Never activated.
      }
      try {
        await Brightness.restoreSystemBrightnessAsync();
      } catch {
        // Never changed.
      }
      try {
        await ScreenOrientation.unlockAsync();
      } catch {
        // Never locked.
      }
    },
  };
}
