/**
 * Capability injection. Screens read from here rather than importing the
 * platform modules directly, so a test can hand them fakes and so the native
 * seam has exactly one crossing point.
 */
import React, { createContext, useContext } from 'react';

import { Capabilities } from './types';

const CapabilityContext = createContext<Capabilities | null>(null);

export function CapabilityProvider({
  value,
  children,
}: {
  value: Capabilities;
  children: React.ReactNode;
}) {
  return <CapabilityContext.Provider value={value}>{children}</CapabilityContext.Provider>;
}

export function useCapabilities(): Capabilities {
  const capabilities = useContext(CapabilityContext);
  if (!capabilities) {
    throw new Error('useCapabilities must be used inside a CapabilityProvider');
  }
  return capabilities;
}
