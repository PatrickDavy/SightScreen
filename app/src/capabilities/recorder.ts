/**
 * Camera availability.
 *
 * react-native-vision-camera v5 needs nitro modules and a custom dev client —
 * it cannot load in Expo Go and does not exist on web. It is therefore required
 * lazily and never at module scope, so that an environment without it degrades
 * to the simulated engine instead of failing to boot.
 */
import { Recorder, RecorderProbe } from './types';

const UNSUPPORTED: RecorderProbe = {
  supported: false,
  maxFps: 0,
  // We cannot measure exposure without a camera. Reporting a failed light check
  // here would put a red cross on every checklist for a reason the bowler
  // cannot act on, so it reports clear — and the simulated-capture notice on
  // S26 and the review screens is what tells them these numbers are not real.
  lightOk: true,
};

function loadVisionCamera(): unknown | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-vision-camera');
  } catch {
    return null;
  }
}

export function createRecorder(): Recorder {
  return {
    async requestPermission() {
      const camera = loadVisionCamera() as
        | { Camera?: { requestCameraPermission?: () => Promise<string> } }
        | null;
      const request = camera?.Camera?.requestCameraPermission;
      if (!request) return 'unavailable';
      try {
        const status = await request();
        return status === 'granted' ? 'granted' : 'denied';
      } catch {
        return 'unavailable';
      }
    },

    async probe(): Promise<RecorderProbe> {
      // TODO(native): with a dev client, select the high-speed format here —
      // AVCaptureDevice.Format at 240 fps with activeVideoMinFrameDuration
      // pinned on iOS, CONSTRAINED_HIGH_SPEED_VIDEO on Android — and read the
      // real exposure duration for the light check.
      return loadVisionCamera() ? { supported: true, maxFps: 240, lightOk: true } : UNSUPPORTED;
    },
  };
}
