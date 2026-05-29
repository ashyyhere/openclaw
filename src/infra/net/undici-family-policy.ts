// infra/net undici family policy helpers and runtime behavior.
import * as net from "node:net";
import { isWSL2Sync } from "../wsl.js";

const AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;

/** Reused helper for resolve Undici Auto Select Family behavior in src/infra/net. */
export function resolveUndiciAutoSelectFamily(): boolean | undefined {
  if (typeof net.getDefaultAutoSelectFamily !== "function") {
    return undefined;
  }
  try {
    const systemDefault = net.getDefaultAutoSelectFamily();
    // WSL2 has unstable IPv6 connectivity; disable autoSelectFamily to force
    // IPv4 connections and avoid fetch failures when reaching Windows-host services.
    if (systemDefault && isWSL2Sync()) {
      return false;
    }
    return systemDefault;
  } catch {
    return undefined;
  }
}

/** Reused helper for create Undici Auto Select Family Connect Options behavior in src/infra/net. */
export function createUndiciAutoSelectFamilyConnectOptions(
  autoSelectFamily: boolean | undefined,
): { autoSelectFamily: boolean; autoSelectFamilyAttemptTimeout: number } | undefined {
  if (autoSelectFamily === undefined) {
    return undefined;
  }
  return {
    autoSelectFamily,
    autoSelectFamilyAttemptTimeout: AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS,
  };
}

/** Reused helper for resolve Undici Auto Select Family Connect Options behavior in src/infra/net. */
export function resolveUndiciAutoSelectFamilyConnectOptions():
  | { autoSelectFamily: boolean; autoSelectFamilyAttemptTimeout: number }
  | undefined {
  return createUndiciAutoSelectFamilyConnectOptions(resolveUndiciAutoSelectFamily());
}

/** Reused helper for with Temporary Undici Auto Select Family behavior in src/infra/net. */
export function withTemporaryUndiciAutoSelectFamily<T>(
  autoSelectFamily: boolean | undefined,
  run: () => T,
): T {
  if (
    autoSelectFamily === undefined ||
    typeof net.getDefaultAutoSelectFamily !== "function" ||
    typeof net.setDefaultAutoSelectFamily !== "function"
  ) {
    return run();
  }

  let previous: boolean;
  try {
    previous = net.getDefaultAutoSelectFamily();
    net.setDefaultAutoSelectFamily(autoSelectFamily);
  } catch {
    return run();
  }

  try {
    return run();
  } finally {
    try {
      net.setDefaultAutoSelectFamily(previous);
    } catch {
      // Best-effort restore; dispatcher setup is already best-effort.
    }
  }
}
