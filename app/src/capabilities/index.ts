/**
 * The real capability set.
 *
 * Audio, speech, sensors and screen control are genuine on both native and web
 * — every one of those Expo modules ships a web implementation. Capture and
 * inference are still simulated, because they need native high-speed capture
 * and a pose model that do not exist yet; `kind: 'simulated'` travels with them
 * so the UI can say so.
 */
import { createCueAudio } from './audio';
import { createDeviceSensors } from './device';
import { createRecorder } from './recorder';
import { createScreenControl } from './screen';
import { createSimulatedEngines } from './simulatedEngine';
import { createSpeech } from './speech';
import { Capabilities } from './types';

export type { Capabilities } from './types';

export function createCapabilities(): Capabilities {
  const { capture, inference } = createSimulatedEngines();
  return {
    audio: createCueAudio(),
    speech: createSpeech(),
    sensors: createDeviceSensors(),
    screen: createScreenControl(),
    recorder: createRecorder(),
    capture,
    inference,
  };
}
