// Process-local config snapshot state for runtime-safe config writes and reloads.
import { createHash } from "node:crypto";
import type { OpenClawConfig } from "./types.js";

/** Options passed when refreshing the process runtime config snapshot. */
export type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
};

/** Refresh request passed to runtime config snapshot handlers. */
export type RuntimeConfigSnapshotRefreshParams = RuntimeConfigSnapshotRefreshOptions & {
  sourceConfig: OpenClawConfig;
  preflightResult?: unknown;
};
type MaybePromise<T> = T | Promise<T>;

/** Caller preference for follow-up behavior after a config write lands. */
export type ConfigWriteAfterWrite =
  | { mode: "auto" }
  | { mode: "restart"; reason: string }
  | { mode: "none"; reason: string };

/** Resolved post-write follow-up decision consumed by CLI/UI callers. */
export type ConfigWriteFollowUp =
  | {
      mode: "auto";
      requiresRestart: false;
    }
  | {
      mode: "none";
      reason: string;
      requiresRestart: false;
    }
  | {
      mode: "restart";
      reason: string;
      requiresRestart: true;
    };

/** Normalizes missing post-write behavior to the automatic follow-up mode. */
export function resolveConfigWriteAfterWrite(
  afterWrite?: ConfigWriteAfterWrite,
): ConfigWriteAfterWrite {
  return afterWrite ?? { mode: "auto" };
}

/** Converts raw post-write preference into a restart-aware follow-up result. */
export function resolveConfigWriteFollowUp(
  afterWrite?: ConfigWriteAfterWrite,
): ConfigWriteFollowUp {
  const resolved = resolveConfigWriteAfterWrite(afterWrite);
  if (resolved.mode === "restart") {
    return {
      mode: "restart",
      reason: resolved.reason,
      requiresRestart: true,
    };
  }
  if (resolved.mode === "none") {
    return {
      mode: "none",
      reason: resolved.reason,
      requiresRestart: false,
    };
  }
  return {
    mode: "auto",
    requiresRestart: false,
  };
}

/** Hook installed by runtime owners that can refresh config without process restart. */
export type RuntimeConfigSnapshotRefreshHandler = {
  preflight?: (params: RuntimeConfigSnapshotRefreshParams) => MaybePromise<unknown>;
  refresh: (params: RuntimeConfigSnapshotRefreshParams) => boolean | Promise<boolean>;
  clearOnRefreshFailure?: () => void;
};

/** Event emitted after a config write updates persisted and runtime state. */
export type RuntimeConfigWriteNotification = {
  configPath: string;
  sourceConfig: OpenClawConfig;
  runtimeConfig: OpenClawConfig;
  persistedHash: string;
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  writtenAtMs: number;
  afterWrite?: ConfigWriteAfterWrite;
};

/** Monotonic revision and fingerprints for the active runtime config snapshot. */
export type RuntimeConfigSnapshotMetadata = {
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  updatedAtMs: number;
};

let runtimeConfigSnapshot: OpenClawConfig | null = null;
let runtimeConfigSourceSnapshot: OpenClawConfig | null = null;
let runtimeConfigSnapshotMetadata: RuntimeConfigSnapshotMetadata | null = null;
let runtimeConfigSnapshotRevision = 0;
let runtimeConfigSnapshotRefreshHandler: RuntimeConfigSnapshotRefreshHandler | null = null;
const runtimeConfigWriteListeners = new Set<(event: RuntimeConfigWriteNotification) => void>();

function stableConfigStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableConfigStringify(entry)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).toSorted();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableConfigStringify(record[key])}`)
    .join(",")}}`;
}

function configSnapshotsMatch(left: OpenClawConfig, right: OpenClawConfig): boolean {
  if (left === right) {
    return true;
  }
  try {
    return stableConfigStringify(left) === stableConfigStringify(right);
  } catch {
    return false;
  }
}

/** Hashes config values with stable key ordering for snapshot cache keys. */
export function hashRuntimeConfigValue(value: OpenClawConfig): string {
  return createHash("sha256").update(stableConfigStringify(value)).digest("base64url");
}

function createRuntimeConfigSnapshotMetadata(
  config: OpenClawConfig,
  sourceConfig?: OpenClawConfig,
): RuntimeConfigSnapshotMetadata {
  runtimeConfigSnapshotRevision += 1;
  return {
    revision: runtimeConfigSnapshotRevision,
    fingerprint: hashRuntimeConfigValue(config),
    sourceFingerprint: sourceConfig ? hashRuntimeConfigValue(sourceConfig) : null,
    updatedAtMs: Date.now(),
  };
}

/** Pins the current runtime config and optional source config snapshot. */
export function setRuntimeConfigSnapshot(
  config: OpenClawConfig,
  sourceConfig?: OpenClawConfig,
): void {
  runtimeConfigSnapshot = config;
  runtimeConfigSourceSnapshot = sourceConfig ?? null;
  runtimeConfigSnapshotMetadata = createRuntimeConfigSnapshotMetadata(config, sourceConfig);
}

/** Clears all process-local runtime config snapshot state. */
export function resetConfigRuntimeState(): void {
  runtimeConfigSnapshot = null;
  runtimeConfigSourceSnapshot = null;
  runtimeConfigSnapshotMetadata = null;
  runtimeConfigSnapshotRevision = 0;
}

/** Public alias for clearing the active runtime config snapshot. */
export function clearRuntimeConfigSnapshot(): void {
  resetConfigRuntimeState();
}

/** Returns the active runtime config snapshot, if one is pinned. */
export function getRuntimeConfigSnapshot(): OpenClawConfig | null {
  return runtimeConfigSnapshot;
}

/** Returns the source config that produced the active runtime snapshot. */
export function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null {
  return runtimeConfigSourceSnapshot;
}

/** Returns revision/fingerprint metadata for the active runtime snapshot. */
export function getRuntimeConfigSnapshotMetadata(): RuntimeConfigSnapshotMetadata | null {
  return runtimeConfigSnapshotMetadata;
}

/** Builds a cache key that distinguishes pinned runtime snapshots from raw configs. */
export function resolveRuntimeConfigCacheKey(config: OpenClawConfig): string {
  const metadata = runtimeConfigSnapshotMetadata;
  if (metadata && config === runtimeConfigSnapshot) {
    return `runtime:${metadata.revision}:${metadata.fingerprint}`;
  }
  return `config:${hashRuntimeConfigValue(config)}`;
}

/** Creates a config-write event with snapshot metadata and persisted hash details. */
export function createRuntimeConfigWriteNotification(params: {
  configPath: string;
  sourceConfig: OpenClawConfig;
  runtimeConfig: OpenClawConfig;
  persistedHash: string;
  writtenAtMs?: number;
  afterWrite?: ConfigWriteAfterWrite;
}): RuntimeConfigWriteNotification {
  const metadata =
    params.runtimeConfig === runtimeConfigSnapshot && runtimeConfigSnapshotMetadata
      ? runtimeConfigSnapshotMetadata
      : {
          revision: runtimeConfigSnapshotRevision,
          fingerprint: hashRuntimeConfigValue(params.runtimeConfig),
          sourceFingerprint: hashRuntimeConfigValue(params.sourceConfig),
          updatedAtMs: Date.now(),
        };
  return {
    configPath: params.configPath,
    sourceConfig: params.sourceConfig,
    runtimeConfig: params.runtimeConfig,
    persistedHash: params.persistedHash,
    revision: metadata.revision,
    fingerprint: metadata.fingerprint,
    sourceFingerprint: metadata.sourceFingerprint,
    writtenAtMs: params.writtenAtMs ?? Date.now(),
    afterWrite: params.afterWrite,
  };
}

/** Chooses runtime config when the caller's input still matches the source snapshot. */
export function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined {
  const runtimeConfig = params.runtimeConfig ?? null;
  if (!runtimeConfig) {
    return params.inputConfig;
  }
  const inputConfig = params.inputConfig;
  if (!inputConfig) {
    return runtimeConfig;
  }
  if (inputConfig === runtimeConfig) {
    return inputConfig;
  }
  const runtimeSourceConfig = params.runtimeSourceConfig ?? null;
  if (!runtimeSourceConfig) {
    return runtimeConfig;
  }
  if (configSnapshotsMatch(inputConfig, runtimeSourceConfig)) {
    return runtimeConfig;
  }
  return inputConfig;
}

/** Installs or clears the runtime snapshot refresh hook. */
export function setRuntimeConfigSnapshotRefreshHandler(
  refreshHandler: RuntimeConfigSnapshotRefreshHandler | null,
): void {
  runtimeConfigSnapshotRefreshHandler = refreshHandler;
}

/** Returns the current runtime snapshot refresh hook, if installed. */
export function getRuntimeConfigSnapshotRefreshHandler(): RuntimeConfigSnapshotRefreshHandler | null {
  return runtimeConfigSnapshotRefreshHandler;
}

/** Registers a best-effort observer for committed config writes. */
export function registerRuntimeConfigWriteListener(
  listener: (event: RuntimeConfigWriteNotification) => void,
): () => void {
  runtimeConfigWriteListeners.add(listener);
  return () => {
    runtimeConfigWriteListeners.delete(listener);
  };
}

/** Notifies config-write observers without letting observer failures block writes. */
export function notifyRuntimeConfigWriteListeners(event: RuntimeConfigWriteNotification): void {
  for (const listener of runtimeConfigWriteListeners) {
    try {
      listener(event);
    } catch {
      // Best-effort observer path only; successful writes must still complete.
    }
  }
}

/** Loads fresh config once, then reuses the process-pinned runtime snapshot. */
export function loadPinnedRuntimeConfig(loadFresh: () => OpenClawConfig): OpenClawConfig {
  if (runtimeConfigSnapshot) {
    return runtimeConfigSnapshot;
  }
  const config = loadFresh();
  setRuntimeConfigSnapshot(config);
  return getRuntimeConfigSnapshot() ?? config;
}

/** Runs runtime-owner preflight before committing a config write. */
export async function preflightRuntimeSnapshotWrite(params: {
  nextSourceConfig: OpenClawConfig;
  refreshOptions?: RuntimeConfigSnapshotRefreshOptions;
  createRefreshError: (detail: string, cause: unknown) => Error;
  formatRefreshError: (error: unknown) => string;
}): Promise<unknown> {
  const refreshHandler = getRuntimeConfigSnapshotRefreshHandler();
  if (!refreshHandler?.preflight) {
    return undefined;
  }
  try {
    return await refreshHandler.preflight({
      sourceConfig: params.nextSourceConfig,
      ...params.refreshOptions,
    });
  } catch (error) {
    throw params.createRefreshError(params.formatRefreshError(error), error);
  }
}

/** Refreshes or repins the runtime snapshot after a config write commits. */
export async function finalizeRuntimeSnapshotWrite(params: {
  nextSourceConfig: OpenClawConfig;
  refreshOptions?: RuntimeConfigSnapshotRefreshOptions;
  hadRuntimeSnapshot: boolean;
  hadBothSnapshots: boolean;
  loadFreshConfig: () => OpenClawConfig;
  notifyCommittedWrite: () => void;
  createRefreshError: (detail: string, cause: unknown) => Error;
  formatRefreshError: (error: unknown) => string;
  preflightResult?: unknown;
}): Promise<void> {
  const refreshHandler = getRuntimeConfigSnapshotRefreshHandler();
  if (refreshHandler) {
    try {
      const refreshed = await refreshHandler.refresh({
        sourceConfig: params.nextSourceConfig,
        ...params.refreshOptions,
        preflightResult: params.preflightResult,
      });
      if (refreshed) {
        params.notifyCommittedWrite();
        return;
      }
    } catch (error) {
      try {
        refreshHandler.clearOnRefreshFailure?.();
      } catch {
        // Keep the original refresh failure as the surfaced error.
      }
      throw params.createRefreshError(params.formatRefreshError(error), error);
    }
  }

  if (params.hadBothSnapshots) {
    const fresh = params.loadFreshConfig();
    setRuntimeConfigSnapshot(fresh, params.nextSourceConfig);
    params.notifyCommittedWrite();
    return;
  }

  if (params.hadRuntimeSnapshot) {
    const fresh = params.loadFreshConfig();
    setRuntimeConfigSnapshot(fresh);
    params.notifyCommittedWrite();
    return;
  }

  setRuntimeConfigSnapshot(params.loadFreshConfig());
  params.notifyCommittedWrite();
}
