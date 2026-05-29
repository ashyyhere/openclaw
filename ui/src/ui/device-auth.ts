// Browser local-storage adapter for device-auth tokens. Core store helpers own
// token shape and role scoping; this module supplies Control UI persistence.
import {
  clearDeviceAuthTokenFromStore,
  type DeviceAuthEntry,
  loadDeviceAuthTokenFromStore,
  storeDeviceAuthTokenInStore,
} from "../../../src/shared/device-auth-store.js";
import type { DeviceAuthStore } from "../../../src/shared/device-auth.js";
import { getSafeLocalStorage } from "../local-storage.ts";

const STORAGE_KEY = "openclaw.device.auth.v1";

function readStore(): DeviceAuthStore | null {
  try {
    const raw = getSafeLocalStorage()?.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as DeviceAuthStore;
    if (!parsed || parsed.version !== 1) {
      return null;
    }
    if (!parsed.deviceId || typeof parsed.deviceId !== "string") {
      return null;
    }
    if (!parsed.tokens || typeof parsed.tokens !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStore(store: DeviceAuthStore) {
  try {
    getSafeLocalStorage()?.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // best-effort
  }
}

/** Load a device auth token for one device and role from local storage. */
export function loadDeviceAuthToken(params: {
  deviceId: string;
  role: string;
}): DeviceAuthEntry | null {
  return loadDeviceAuthTokenFromStore({
    adapter: { readStore, writeStore },
    deviceId: params.deviceId,
    role: params.role,
  });
}

/** Store a device auth token for one device and role in local storage. */
export function storeDeviceAuthToken(params: {
  deviceId: string;
  role: string;
  token: string;
  scopes?: string[];
}): DeviceAuthEntry {
  return storeDeviceAuthTokenInStore({
    adapter: { readStore, writeStore },
    deviceId: params.deviceId,
    role: params.role,
    token: params.token,
    scopes: params.scopes,
  });
}

/** Remove a device auth token for one device and role from local storage. */
export function clearDeviceAuthToken(params: { deviceId: string; role: string }) {
  clearDeviceAuthTokenFromStore({
    adapter: { readStore, writeStore },
    deviceId: params.deviceId,
    role: params.role,
  });
}
