/** Canonical unit is km/h; mph is a display conversion (the UK market thinks
 *  in mph). Every measured value renders with its band — never a bare number. */
import { Unit } from './types';

export const KMH_TO_MPH = 0.621371;

export function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

/** Convert a km/h value for display in the chosen unit, rounded to 1 dp. */
export function toDisplay(kmh: number, unit: Unit): number {
  return unit === 'mph' ? round1(kmh * KMH_TO_MPH) : round1(kmh);
}

/** "128 ± 4 km/h" — never a false-precision decimal without its band. */
export function formatSpeedWithBand(kmh: number, bandKmh: number, unit: Unit): string {
  return `${toDisplay(kmh, unit)} ±${toDisplay(bandKmh, unit)} ${unit}`;
}

/** Screen-reader form: "128 plus or minus 4 kilometres per hour". */
export function speechSpeed(kmh: number, bandKmh: number, unit: Unit): string {
  const unitWords = unit === 'mph' ? 'miles per hour' : 'kilometres per hour';
  return `${toDisplay(kmh, unit)} plus or minus ${toDisplay(bandKmh, unit)} ${unitWords}`;
}

/** Spoken speed during capture — whole number in the chosen unit. */
export function spokenSpeed(kmh: number, unit: Unit): string {
  return String(Math.round(unit === 'mph' ? kmh * KMH_TO_MPH : kmh));
}
