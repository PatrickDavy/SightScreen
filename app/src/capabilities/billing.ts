/**
 * Google Play Billing — not yet implemented.
 *
 * Integrating a billing library is issue #35, and it cannot be exercised until
 * there is a merchant profile (#12) and subscription products in Play Console
 * (#41). Neither exists.
 *
 * This is deliberately not a stub that pretends. It reports `available: false`,
 * returns no prices, and refuses every purchase. The paywall reads that and
 * says pricing is unavailable rather than showing a number nobody will be
 * charged, which is the same rule the rest of the product follows about
 * printing values it is not sure of.
 */
import { Billing } from './types';

export function createBilling(): Billing {
  return {
    available: false,
    async getPrices() {
      return null;
    },
    async purchase() {
      return false;
    },
    async restore() {
      return false;
    },
  };
}
