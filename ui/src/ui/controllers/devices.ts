// Controller helpers for Control UI device pairing and device-token management.
// Local token storage is updated only for the browser's own device identity.
import { clearDeviceAuthToken, storeDeviceAuthToken } from "../device-auth.ts";
import { loadOrCreateDeviceIdentity } from "../device-identity.ts";
import type { GatewayBrowserClient } from "../gateway.ts";

/** Token metadata shown for a paired browser/device role. */
export type DeviceTokenSummary = {
  role: string;
  scopes?: string[];
  createdAtMs?: number;
  rotatedAtMs?: number;
  revokedAtMs?: number;
  lastUsedAtMs?: number;
};

/** Pending pairing request awaiting operator approval or rejection. */
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

/** Approved device plus its roles, scopes, and issued token summaries. */
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

/** Gateway response shape for pending and approved devices. */
export type DevicePairingList = {
  pending: PendingDevice[];
  paired: PairedDevice[];
};

/** Mutable state for the Devices view and pairing actions. */
export type DevicesState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  devicesLoading: boolean;
  devicesError: string | null;
  devicesList: DevicePairingList | null;
};

/** Load pending and paired device lists through the gateway. */
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

/** Approve a pending device pairing request and refresh the list. */
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

/** Confirm, reject a pending device pairing request, then refresh the list. */
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

/** Rotate a device token and store it locally when it belongs to this browser. */
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

/** Revoke a device token and clear the matching local token when applicable. */
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
