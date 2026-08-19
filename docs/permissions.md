# Android permissions audit

Issue #54. Play scrutinises every declared permission, and each one must be
justified by app behaviour. This audits what the code actually does against what
`app/app.json` declares.

**Incomplete by construction.** The authoritative list is the *merged* manifest
that Expo produces at prebuild, after every config plugin has contributed to it.
`/android` is gitignored and no prebuild has been run, so that file does not
exist yet. This audit covers the config and the source; it must be repeated
against `android/app/src/main/AndroidManifest.xml` once a build exists. #54
stays open until then.

## Declared today

```json
"android": { "permissions": ["android.permission.CAMERA"] }
```

One permission, and it is clearly justified: the product films a bowler to
measure their action. The rationale string already written for iOS is a good
model for the Play declaration, because it says where the video goes:

> Sightscreen films your bowling from the tripod to measure ball speed. Video
> stays on this phone.

## Permission-bearing APIs the code actually uses

| Module | Used in | Permission implication |
|---|---|---|
| `react-native-vision-camera` | `capabilities/recorder.ts` | `CAMERA`. **`RECORD_AUDIO` if audio capture is enabled** — see below. |
| `expo-keep-awake` | `capabilities/screen.ts` | `WAKE_LOCK`. Added by the library; normal, not user-facing. |
| `expo-brightness` | `capabilities/screen.ts` | None as used. The code calls `setBrightnessAsync` (app-scoped) and comments that this needs no permission. It does **not** call `setSystemBrightnessAsync`, which would need `WRITE_SETTINGS`. Keep it that way. |
| `expo-sensors` (`Accelerometer`) | `capabilities/device.ts` | None at the sampling rate used. `HIGH_SAMPLING_RATE_SENSORS` is only required above 200 Hz; the level check samples far slower. |
| `expo-battery` | `capabilities/device.ts` | None. |
| `expo-file-system` | `capabilities/device.ts`, and the new export | None — app-scoped storage only. No `READ/WRITE_EXTERNAL_STORAGE`. |
| `expo-audio` | `capabilities/audio.ts` | None. Playback only; `setAudioModeAsync` needs no permission. |
| `expo-speech` | `capabilities/speech.ts` | None. |
| `expo-haptics` | components | `VIBRATE`. Added by the library; normal. |
| `expo-screen-orientation` | `capabilities/screen.ts` | None. |
| `expo-sqlite` | `data/db/` | None. |

## Open questions for the prebuild audit

1. **`RECORD_AUDIO`.** Vision Camera adds it depending on configuration. The
   product has no use for recorded audio — it plays cues, it does not listen —
   so if the plugin adds it, it should be disabled explicitly. An unexplained
   microphone permission on a camera app is exactly what makes a reviewer, and a
   user, suspicious.
2. **Foreground service.** A capture session runs up to five minutes with the
   screen on and the phone untouched. If capture is ever moved off the
   foreground activity, Android 14+ requires a typed foreground service and a
   Play declaration. Not needed as currently built.
3. **Sensitive permission declarations.** None of the above is in Play's
   sensitive set today. Re-check after the billing library lands.
4. **`INTERNET`.** Not currently needed — there is no networking anywhere in
   `src/`. It will be added implicitly by any analytics, crash-reporting or
   billing library, and the Data safety declaration (#50) must change with it.

## Rule

Every permission in the merged manifest must be traceable to a line of code that
needs it. A permission nobody can point at is a permission to delete.
