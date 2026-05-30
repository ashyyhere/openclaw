// Network interface discovery helpers.
// Callers can inject snapshots for tests while production reads node:os directly.
import os from "node:os";

/** Raw network interface snapshot shape returned by node:os. */
export type NetworkInterfacesSnapshot = ReturnType<typeof os.networkInterfaces>;
type NetworkInterfaceFamily = "IPv4" | "IPv6";
type ExternalNetworkInterfaceAddress = {
  name: string;
  address: string;
  family: NetworkInterfaceFamily;
};

function normalizeNetworkInterfaceFamily(
  family: string | number | undefined,
): NetworkInterfaceFamily | undefined {
  if (family === "IPv4" || family === 4) {
    return "IPv4";
  }
  if (family === "IPv6" || family === 6) {
    return "IPv6";
  }
  return undefined;
}

/** Read the current network interface snapshot from an injectable source. */
export function readNetworkInterfaces(
  networkInterfaces: () => NetworkInterfacesSnapshot = os.networkInterfaces,
): NetworkInterfacesSnapshot {
  return networkInterfaces();
}

/** Read network interfaces and return undefined if the OS call fails. */
export function safeNetworkInterfaces(
  networkInterfaces: () => NetworkInterfacesSnapshot = os.networkInterfaces,
): NetworkInterfacesSnapshot | undefined {
  try {
    return readNetworkInterfaces(networkInterfaces);
  } catch {
    return undefined;
  }
}

/** List non-internal IPv4/IPv6 interface addresses, optionally filtered by family. */
export function listExternalInterfaceAddresses(
  snapshot: NetworkInterfacesSnapshot | undefined,
  family?: NetworkInterfaceFamily,
): ExternalNetworkInterfaceAddress[] {
  const addresses: ExternalNetworkInterfaceAddress[] = [];
  if (!snapshot) {
    return addresses;
  }

  for (const [name, entries] of Object.entries(snapshot)) {
    if (!entries) {
      continue;
    }
    for (const entry of entries) {
      if (!entry || entry.internal) {
        continue;
      }
      const address = entry.address?.trim();
      if (!address) {
        continue;
      }
      const entryFamily = normalizeNetworkInterfaceFamily(entry.family);
      if (!entryFamily || (family && entryFamily !== family)) {
        continue;
      }
      addresses.push({ name, address, family: entryFamily });
    }
  }

  return addresses;
}

/** Pick the first external address matching preferred interface names or predicate. */
export function pickMatchingExternalInterfaceAddress(
  snapshot: NetworkInterfacesSnapshot | undefined,
  params: {
    family: NetworkInterfaceFamily;
    preferredNames?: string[];
    matches?: (address: string) => boolean;
  },
): string | undefined {
  const { family, preferredNames = [], matches = () => true } = params;
  const addresses = listExternalInterfaceAddresses(snapshot, family);

  for (const name of preferredNames) {
    const preferred = addresses.find((entry) => entry.name === name && matches(entry.address));
    if (preferred) {
      return preferred.address;
    }
  }

  return addresses.find((entry) => matches(entry.address))?.address;
}
