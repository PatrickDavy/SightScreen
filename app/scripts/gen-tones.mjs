// One-off generator for the capture audio cues. Each state change gets a
// distinct sound (spec: the whole session is operable by ear).
// Run: node scripts/gen-tones.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'audio');
mkdirSync(outDir, { recursive: true });

const RATE = 44100;

function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.max(-1, Math.min(1, s)) * 0x7fff, 44 + i * 2));
  return buf;
}

// A tone segment: sine at freq, with exponential decay like the prototype's beep().
function tone(freq, ms, gain = 0.5) {
  const n = Math.round((RATE * ms) / 1000);
  return Array.from({ length: n }, (_, i) => {
    const t = i / RATE;
    const env = Math.exp(-t * (4000 / ms));
    return Math.sin(2 * Math.PI * freq * t) * gain * env;
  });
}

const silence = (ms) => new Array(Math.round((RATE * ms) / 1000)).fill(0);

// delivery: single soft 880 Hz — the prototype's per-delivery confirmation.
writeFileSync(join(outDir, 'delivery.wav'), wav(tone(880, 260)));
// alert: low double buzz — the amber problem state.
writeFileSync(join(outDir, 'alert.wav'), wav([...tone(300, 220), ...silence(90), ...tone(300, 220)]));
// end: falling pair — session stopped.
writeFileSync(join(outDir, 'end.wav'), wav([...tone(660, 200), ...silence(40), ...tone(440, 300)]));
// done: rising pair — processing complete.
writeFileSync(join(outDir, 'done.wav'), wav([...tone(440, 180), ...silence(40), ...tone(660, 260)]));

console.log('Wrote delivery.wav alert.wav end.wav done.wav to', outDir);
