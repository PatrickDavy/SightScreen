/** Pre-flight capacity estimate — a realistic delivery count from battery,
 *  storage and thermal headroom ("Room for about 45 deliveries at 62% battery"). */

export interface DeviceHeadroom {
  /** 0..1 */
  batteryLevel: number;
  /** Free bytes available for clips. */
  freeStorageBytes: number;
  thermalState: 'nominal' | 'fair' | 'serious' | 'critical';
}

/** ~90MB per 240fps delivery clip — placeholder engineering estimate. */
const BYTES_PER_DELIVERY = 90 * 1024 * 1024;
/** Empirical-ish: a full battery sustains roughly this many deliveries of
 *  capture + inference before dying. */
const DELIVERIES_PER_FULL_BATTERY = 120;

export interface CapacityEstimate {
  deliveries: number;
  limitedBy: 'battery' | 'storage' | 'thermal';
  lowBattery: boolean;
  lowStorage: boolean;
}

export function estimateCapacity(h: DeviceHeadroom): CapacityEstimate {
  const byBattery = Math.floor(h.batteryLevel * DELIVERIES_PER_FULL_BATTERY);
  const byStorage = Math.floor(h.freeStorageBytes / BYTES_PER_DELIVERY);
  const thermalFactor = h.thermalState === 'serious' ? 0.5 : h.thermalState === 'critical' ? 0.2 : 1;
  const byThermal = Math.floor(byBattery * thermalFactor);
  const deliveries = Math.max(0, Math.min(byBattery, byStorage, byThermal));
  const limitedBy =
    deliveries === byStorage && byStorage <= byBattery
      ? 'storage'
      : thermalFactor < 1 && byThermal < byBattery
        ? 'thermal'
        : 'battery';
  return {
    deliveries,
    limitedBy,
    lowBattery: h.batteryLevel < 0.2,
    lowStorage: byStorage < 5, // mid-session warning buffer per the error matrix
  };
}

export function capacityLine(c: CapacityEstimate, batteryLevel: number): string {
  return `Room for about ${c.deliveries} deliveries at ${Math.round(batteryLevel * 100)}% battery. Recording warms the phone up; that's normal.`;
}
