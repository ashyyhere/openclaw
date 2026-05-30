// Resolves Undici address-family defaults, including WSL2 IPv4 fallback policy.
import * as net from "node:net";
import { isWSL2Sync } from "../wsl.js";

const AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;

/** Resolves whether Undici should use Node's autoSelectFamily connection behavior. */
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

/** Builds Undici connect options for a known autoSelectFamily decision. */
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

/** Resolves connect options using the current Node and platform address-family policy. */
export function resolveUndiciAutoSelectFamilyConnectOptions():
  | { autoSelectFamily: boolean; autoSelectFamilyAttemptTimeout: number }
  | undefined {
  return createUndiciAutoSelectFamilyConnectOptions(resolveUndiciAutoSelectFamily());
}

/** Temporarily overrides Node's global autoSelectFamily default while building a dispatcher. */
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
