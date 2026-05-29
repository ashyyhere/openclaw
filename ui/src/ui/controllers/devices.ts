// ui/src/ui/controllers devices helpers and runtime behavior.
import { clearDeviceAuthToken, storeDeviceAuthToken } from "../device-auth.ts";
import { loadOrCreateDeviceIdentity } from "../device-identity.ts";
import type { GatewayBrowserClient } from "../gateway.ts";

/** Shared type for Device Token Summary in ui/src/ui/controllers. */
export type DeviceTokenSummary = {
  role: string;
  scopes?: string[];
  createdAtMs?: number;
  rotatedAtMs?: number;
  revokedAtMs?: number;
  lastUsedAtMs?: number;
};

/** Shared type for Pending Device in ui/src/ui/controllers. */
export type PendingDevice = {
  requestId: string;
  deviceId: string;
  publicKey?: string;
  displayName?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  remoteIp?: string;
  isRepair?: boolean;
  ts?: number;
};

/** Shared type for Paired Device in ui/src/ui/controllers. */
export type PairedDevice = {
  deviceId: string;
  publicKey?: string;
  displayName?: string;
  roles?: string[];
  scopes?: string[];
  remoteIp?: string;
  tokens?: DeviceTokenSummary[];
  createdAtMs?: number;
  approvedAtMs?: number;
};

/** Shared type for Device Pairing List in ui/src/ui/controllers. */
export type DevicePairingList = {
  pending: PendingDevice[];
  paired: PairedDevice[];
};

/** Shared type for Devices State in ui/src/ui/controllers. */
export type DevicesState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  devicesLoading: boolean;
  devicesError: string | null;
  devicesList: DevicePairingList | null;
};

/** Reused helper for load Devices behavior in ui/src/ui/controllers. */
export async function loadDevices(state: DevicesState, opts?: { quiet?: boolean }) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.devicesLoading) {
    return;
  }
  state.devicesLoading = true;
  if (!opts?.quiet) {
    state.devicesError = null;
  }
  try {
    const res = await state.client.request<{
      pending?: Array<PendingDevice>;
      paired?: Array<PairedDevice>;
    }>("device.pair.list", {});
    state.devicesList = {
      pending: Array.isArray(res?.pending) ? res.pending : [],
      paired: Array.isArray(res?.paired) ? res.paired : [],
    };
  } catch (err) {
    if (!opts?.quiet) {
      state.devicesError = String(err);
    }
  } finally {
    state.devicesLoading = false;
  }
}

/** Reused helper for approve Device Pairing behavior in ui/src/ui/controllers. */
export async function approveDevicePairing(state: DevicesState, requestId: string) {
  if (!state.client || !state.connected) {
    return;
  }
  try {
    await state.client.request("device.pair.approve", { requestId });
    await loadDevices(state);
  } catch (err) {
    state.devicesError = String(err);
  }
}

/** Reused helper for reject Device Pairing behavior in ui/src/ui/controllers. */
export async function rejectDevicePairing(state: DevicesState, requestId: string) {
  if (!state.client || !state.connected) {
    return;
  }
  const confirmed = window.confirm("Reject this device pairing request?");
  if (!confirmed) {
    return;
  }
  try {
    await state.client.request("device.pair.reject", { requestId });
    await loadDevices(state);
  } catch (err) {
    state.devicesError = String(err);
  }
}

/** Reused helper for rotate Device Token behavior in ui/src/ui/controllers. */
export async function rotateDeviceToken(
  state: DevicesState,
  params: { deviceId: string; role: string; scopes?: string[] },
) {
  if (!state.client || !state.connected) {
    return;
  }
  try {
    const res = await state.client.request<{
      token?: string;
      role?: string;
      deviceId?: string;
      scopes?: Array<string>;
    }>("device.token.rotate", params);
    if (res?.token) {
      const identity = await loadOrCreateDeviceIdentity();
      const role = res.role ?? params.role;
      if (res.deviceId === identity.deviceId || params.deviceId === identity.deviceId) {
        storeDeviceAuthToken({
          deviceId: identity.deviceId,
          role,
          token: res.token,
          scopes: res.scopes ?? params.scopes ?? [],
        });
      }
      window.prompt("New device token (copy and store securely):", res.token);
    }
    await loadDevices(state);
  } catch (err) {
    state.devicesError = String(err);
  }
}

/** Reused helper for revoke Device Token behavior in ui/src/ui/controllers. */
export async function revokeDeviceToken(
  state: DevicesState,
  params: { deviceId: string; role: string },
) {
  if (!state.client || !state.connected) {
    return;
  }
  const confirmed = window.confirm(`Revoke token for ${params.deviceId} (${params.role})?`);
  if (!confirmed) {
    return;
  }
  try {
    await state.client.request("device.token.revoke", params);
    const identity = await loadOrCreateDeviceIdentity();
    if (params.deviceId === identity.deviceId) {
      clearDeviceAuthToken({ deviceId: identity.deviceId, role: params.role });
    }
    await loadDevices(state);
  } catch (err) {
    state.devicesError = String(err);
  }
}
