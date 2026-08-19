/**
 * The test capability set — no native modules load at all.
 *
 * jest.config.js maps `@/capabilities` here. Tests that need to drive a capture
 * should call createFakeCapabilities() directly with a short interval and pass
 * it to the CapabilityProvider, rather than relying on the default.
 */
import { Prices } from '@/domain/paywall';

import { createSimulatedEngines, SimulatedEngineOptions } from './simulatedEngine';
import { Capabilities, CueName, ThermalState } from './types';

export type { Capabilities } from './types';

export interface FakeOptions extends SimulatedEngineOptions {
  batteryLevel?: number;
  freeStorageBytes?: number;
  thermalState?: ThermalState;
  tiltDeg?: number;
  orientation?: 'portrait' | 'landscape';
  cameraSupported?: boolean;
  lightOk?: boolean;
  /** Cues played, in order — assert on these to prove the session is audible. */
  cueLog?: CueName[];
  /** Everything spoken aloud, in order. */
  speechLog?: string[];
  /** Exports written, in order — assert the file actually got produced. */
  exportLog?: { folder: string; names: string[] }[];
  /** Make the share sheet unavailable, as it is on web and without a dev client. */
  sharingAvailable?: boolean;
  /** Prices as Play would report them. Null models offline, or no billing yet. */
  prices?: Prices | null;
  /** Whether a purchase attempt succeeds. */
  purchaseSucceeds?: boolean;
  /** Purchases attempted, in order. */
  purchaseLog?: ('annual' | 'monthly')[];
}

export function createFakeCapabilities(options: FakeOptions = {}): Capabilities {
  const cueLog = options.cueLog ?? [];
  const speechLog = options.speechLog ?? [];
  const { capture, inference } = createSimulatedEngines(options);
  const exportLog = options.exportLog ?? [];
  const purchaseLog = options.purchaseLog ?? [];

  return {
    billing: {
      available: options.prices !== undefined,
      getPrices: async () => options.prices ?? null,
      purchase: async (plan) => {
        purchaseLog.push(plan);
        return options.purchaseSucceeds ?? false;
      },
      restore: async () => options.purchaseSucceeds ?? false,
    },
    files: {
      writeExport: async (folder, files) => {
        exportLog.push({ folder, names: files.map((f) => f.name) });
        return {
          directoryUri: `file:///fake/${folder}`,
          fileUris: files.map((f) => `file:///fake/${folder}/${f.name}`),
        };
      },
      share: async () => options.sharingAvailable ?? true,
    },
    audio: {
      prepare: async () => {},
      play: (cue) => {
        cueLog.push(cue);
      },
      release: () => {},
    },
    speech: {
      speakDigits: (digits) => {
        speechLog.push(digits.split('').join(' '));
      },
      speakSentence: (text) => {
        speechLog.push(text);
      },
      stop: () => {},
    },
    sensors: {
      getHeadroom: async () => ({
        batteryLevel: options.batteryLevel ?? 0.62,
        freeStorageBytes: options.freeStorageBytes ?? 16 * 1024 * 1024 * 1024,
        thermalState: options.thermalState ?? 'nominal',
      }),
      subscribeThermal: (cb) => {
        cb(options.thermalState ?? 'nominal');
        return () => {};
      },
      subscribeLevel: (cb) => {
        cb(options.tiltDeg ?? 0);
        return () => {};
      },
      subscribeOrientation: (cb) => {
        cb(options.orientation ?? 'landscape');
        return () => {};
      },
    },
    screen: {
      beginCaptureMode: async () => {},
      endCaptureMode: async () => {},
    },
    recorder: {
      requestPermission: async () => 'granted',
      probe: async () => ({
        supported: options.cameraSupported ?? false,
        maxFps: 240,
        lightOk: options.lightOk ?? true,
      }),
    },
    capture,
    inference,
  };
}

export function createCapabilities(): Capabilities {
  return createFakeCapabilities();
}
