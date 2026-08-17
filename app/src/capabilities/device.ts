/**
 * Battery, storage, tilt and orientation — the signals behind the S21
 * placement checks and the S23 capacity pre-flight.
 */
import * as Battery from 'expo-battery';
import { Paths } from 'expo-file-system';
import { Accelerometer } from 'expo-sensors';
import * as ScreenOrientation from 'expo-screen-orientation';

import { DeviceHeadroom } from '@/domain/capacity';

import { DeviceSensors, ThermalState, Unsubscribe } from './types';

/** Assume a half-full 128 GB phone when the real figure is unavailable. */
const FALLBACK_FREE_BYTES = 64 * 1024 * 1024 * 1024;
const FALLBACK_BATTERY = 0.75;

/** Sampled often enough to feel live at the phone, not so often it costs power. */
const LEVEL_INTERVAL_MS = 250;

function landscapeFrom(orientation: ScreenOrientation.Orientation): 'portrait' | 'landscape' {
  return orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    ? 'landscape'
    : 'portrait';
}

export function createDeviceSensors(): DeviceSensors {
  return {
    async getHeadroom(): Promise<DeviceHeadroom> {
      let batteryLevel = FALLBACK_BATTERY;
      try {
        const level = await Battery.getBatteryLevelAsync();
        // Simulators report -1 for "unknown".
        if (level >= 0) batteryLevel = level;
      } catch {
        // Keep the fallback.
      }

      let freeStorageBytes = FALLBACK_FREE_BYTES;
      try {
        // SDK 57 exposes this synchronously on Paths; the old async
        // getFreeDiskStorageAsync is deprecated and throws at runtime.
        const available = Paths.availableDiskSpace;
        if (typeof available === 'number' && available > 0) freeStorageBytes = available;
      } catch {
        // Keep the fallback.
      }

      return {
        batteryLevel,
        freeStorageBytes,
        // TODO(native): thermal state needs ProcessInfo.thermalState on iOS and
        // PowerManager.getCurrentThermalStatus() on Android. No Expo module
        // exposes it, so capacity is optimistic until that bridge exists.
        thermalState: 'nominal',
      };
    },

    subscribeThermal(cb: (state: ThermalState) => void): Unsubscribe {
      cb('nominal');
      return () => {};
    },

    subscribeLevel(cb: (tiltDeg: number) => void): Unsubscribe {
      let subscription: { remove: () => void } | null = null;
      try {
        Accelerometer.setUpdateInterval(LEVEL_INTERVAL_MS);
        subscription = Accelerometer.addListener(({ x, y, z }) => {
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          if (magnitude === 0) return;
          // With the screen plane vertical — the phone standing up on its
          // tripod, side-on to the pitch — gravity lies in the screen plane and
          // its out-of-screen component z is zero. Any z is the phone leaning
          // forward or back, which foreshortens the pitch and reads speeds low.
          const ratio = Math.min(1, Math.max(-1, z / magnitude));
          cb(Math.abs((Math.asin(ratio) * 180) / Math.PI));
        });
      } catch {
        // No accelerometer (web, simulator): report level so the check is not a
        // false blocker. It is overridable in any case.
        cb(0);
      }
      return () => subscription?.remove();
    },

    subscribeOrientation(cb: (o: 'portrait' | 'landscape') => void): Unsubscribe {
      let subscription: ScreenOrientation.Subscription | null = null;
      let cancelled = false;

      ScreenOrientation.getOrientationAsync()
        .then((orientation) => {
          if (!cancelled) cb(landscapeFrom(orientation));
        })
        .catch(() => {
          if (!cancelled) cb('portrait');
        });

      try {
        subscription = ScreenOrientation.addOrientationChangeListener((event) => {
          cb(landscapeFrom(event.orientationInfo.orientation));
        });
      } catch {
        // Unsupported: the initial read above is all the caller gets.
      }

      return () => {
        cancelled = true;
        if (subscription) ScreenOrientation.removeOrientationChangeListener(subscription);
      };
    },
  };
}
