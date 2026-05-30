/** Registry for stateful binding target drivers supplied by core and plugins. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type {
  ConfiguredBindingResolution,
  StatefulBindingTargetDescriptor,
} from "./binding-types.js";

/** Readiness result for a stateful binding target driver. */
export type StatefulBindingTargetReadyResult = { ok: true } | { ok: false; error: string };
/** Session resolution result for a stateful binding target driver. */
export type StatefulBindingTargetSessionResult =
  | { ok: true; sessionKey: string }
  | { ok: false; sessionKey: string; error: string };
/** In-place reset result for a stateful binding target. */
export type StatefulBindingTargetResetResult =
  | { ok: true }
  | { ok: false; skipped?: boolean; error?: string };

/** Driver contract for binding targets backed by mutable external session state. */
export type StatefulBindingTargetDriver = {
  id: string;
  ensureReady: (params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution;
  }) => Promise<StatefulBindingTargetReadyResult>;
  ensureSession: (params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution;
  }) => Promise<StatefulBindingTargetSessionResult>;
  resolveTargetBySessionKey?: (params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }) => StatefulBindingTargetDescriptor | null;
  resetInPlace?: (params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    bindingTarget: StatefulBindingTargetDescriptor;
    reason: "new" | "reset";
    commandSource?: string;
  }) => Promise<StatefulBindingTargetResetResult>;
};

const registeredStatefulBindingTargetDrivers = new Map<string, StatefulBindingTargetDriver>();

function listStatefulBindingTargetDrivers(): StatefulBindingTargetDriver[] {
  return [...registeredStatefulBindingTargetDrivers.values()];
}

/** Register a stateful binding target driver by id. */
export function registerStatefulBindingTargetDriver(driver: StatefulBindingTargetDriver): void {
  const id = driver.id.trim();
  if (!id) {
    throw new Error("Stateful binding target driver id is required");
  }
  const normalized = { ...driver, id };
  const existing = registeredStatefulBindingTargetDrivers.get(id);
  if (existing) {
    return;
  }
  registeredStatefulBindingTargetDrivers.set(id, normalized);
}

/** Remove a registered stateful binding target driver. */
export function unregisterStatefulBindingTargetDriver(id: string): void {
  registeredStatefulBindingTargetDrivers.delete(id.trim());
}

/** Look up a registered stateful binding target driver. */
export function getStatefulBindingTargetDriver(id: string): StatefulBindingTargetDriver | null {
  const normalizedId = id.trim();
  if (!normalizedId) {
    return null;
  }
  return registeredStatefulBindingTargetDrivers.get(normalizedId) ?? null;
}

/** Resolve a stateful binding target descriptor from a session key across drivers. */
export function resolveStatefulBindingTargetBySessionKey(params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}): { driver: StatefulBindingTargetDriver; bindingTarget: StatefulBindingTargetDescriptor } | null {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) {
    return null;
  }
  for (const driver of listStatefulBindingTargetDrivers()) {
    const bindingTarget = driver.resolveTargetBySessionKey?.({
      cfg: params.cfg,
      sessionKey,
    });
    if (bindingTarget) {
      return {
        driver,
        bindingTarget,
      };
    }
  }
  return null;
}
