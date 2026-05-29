// config runtime snapshot helpers and runtime behavior.
import { createHash } from "node:crypto";
import type { OpenClawConfig } from "./types.js";

/** Shared type for Runtime Config Snapshot Refresh Options in src/config. */
export type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
};

/** Shared type for Runtime Config Snapshot Refresh Params in src/config. */
export type RuntimeConfigSnapshotRefreshParams = RuntimeConfigSnapshotRefreshOptions & {
  sourceConfig: OpenClawConfig;
  preflightResult?: unknown;
};
type MaybePromise<T> = T | Promise<T>;

/** Shared type for Config Write After Write in src/config. */
export type ConfigWriteAfterWrite =
  | { mode: "auto" }
  | { mode: "restart"; reason: string }
  | { mode: "none"; reason: string };

/** Shared type for Config Write Follow Up in src/config. */
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

/** Reused helper for resolve Config Write After Write behavior in src/config. */
export function resolveConfigWriteAfterWrite(
  afterWrite?: ConfigWriteAfterWrite,
): ConfigWriteAfterWrite {
  return afterWrite ?? { mode: "auto" };
}

/** Reused helper for resolve Config Write Follow Up behavior in src/config. */
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

/** Shared type for Runtime Config Snapshot Refresh Handler in src/config. */
export type RuntimeConfigSnapshotRefreshHandler = {
  preflight?: (params: RuntimeConfigSnapshotRefreshParams) => MaybePromise<unknown>;
  refresh: (params: RuntimeConfigSnapshotRefreshParams) => boolean | Promise<boolean>;
  clearOnRefreshFailure?: () => void;
};

/** Shared type for Runtime Config Write Notification in src/config. */
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

/** Shared type for Runtime Config Snapshot Metadata in src/config. */
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

/** Reused helper for hash Runtime Config Value behavior in src/config. */
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

/** Reused helper for set Runtime Config Snapshot behavior in src/config. */
export function setRuntimeConfigSnapshot(
  config: OpenClawConfig,
  sourceConfig?: OpenClawConfig,
): void {
  runtimeConfigSnapshot = config;
  runtimeConfigSourceSnapshot = sourceConfig ?? null;
  runtimeConfigSnapshotMetadata = createRuntimeConfigSnapshotMetadata(config, sourceConfig);
}

/** Reused helper for reset Config Runtime State behavior in src/config. */
export function resetConfigRuntimeState(): void {
  runtimeConfigSnapshot = null;
  runtimeConfigSourceSnapshot = null;
  runtimeConfigSnapshotMetadata = null;
  runtimeConfigSnapshotRevision = 0;
}

/** Reused helper for clear Runtime Config Snapshot behavior in src/config. */
export function clearRuntimeConfigSnapshot(): void {
  resetConfigRuntimeState();
}

/** Reused helper for get Runtime Config Snapshot behavior in src/config. */
export function getRuntimeConfigSnapshot(): OpenClawConfig | null {
  return runtimeConfigSnapshot;
}

/** Reused helper for get Runtime Config Source Snapshot behavior in src/config. */
export function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null {
  return runtimeConfigSourceSnapshot;
}

/** Reused helper for get Runtime Config Snapshot Metadata behavior in src/config. */
export function getRuntimeConfigSnapshotMetadata(): RuntimeConfigSnapshotMetadata | null {
  return runtimeConfigSnapshotMetadata;
}

/** Reused helper for resolve Runtime Config Cache Key behavior in src/config. */
export function resolveRuntimeConfigCacheKey(config: OpenClawConfig): string {
  const metadata = runtimeConfigSnapshotMetadata;
  if (metadata && config === runtimeConfigSnapshot) {
    return `runtime:${metadata.revision}:${metadata.fingerprint}`;
  }
  return `config:${hashRuntimeConfigValue(config)}`;
}

/** Reused helper for create Runtime Config Write Notification behavior in src/config. */
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

/** Reused helper for select Applicable Runtime Config behavior in src/config. */
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

/** Reused helper for set Runtime Config Snapshot Refresh Handler behavior in src/config. */
export function setRuntimeConfigSnapshotRefreshHandler(
  refreshHandler: RuntimeConfigSnapshotRefreshHandler | null,
): void {
  runtimeConfigSnapshotRefreshHandler = refreshHandler;
}

/** Reused helper for get Runtime Config Snapshot Refresh Handler behavior in src/config. */
export function getRuntimeConfigSnapshotRefreshHandler(): RuntimeConfigSnapshotRefreshHandler | null {
  return runtimeConfigSnapshotRefreshHandler;
}

/** Reused helper for register Runtime Config Write Listener behavior in src/config. */
export function registerRuntimeConfigWriteListener(
  listener: (event: RuntimeConfigWriteNotification) => void,
): () => void {
  runtimeConfigWriteListeners.add(listener);
  return () => {
    runtimeConfigWriteListeners.delete(listener);
  };
}

/** Reused helper for notify Runtime Config Write Listeners behavior in src/config. */
export function notifyRuntimeConfigWriteListeners(event: RuntimeConfigWriteNotification): void {
  for (const listener of runtimeConfigWriteListeners) {
    try {
      listener(event);
    } catch {
      // Best-effort observer path only; successful writes must still complete.
    }
  }
}

/** Reused helper for load Pinned Runtime Config behavior in src/config. */
export function loadPinnedRuntimeConfig(loadFresh: () => OpenClawConfig): OpenClawConfig {
  if (runtimeConfigSnapshot) {
    return runtimeConfigSnapshot;
  }
  const config = loadFresh();
  setRuntimeConfigSnapshot(config);
  return getRuntimeConfigSnapshot() ?? config;
}

/** Reused helper for preflight Runtime Snapshot Write behavior in src/config. */
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

/** Reused helper for finalize Runtime Snapshot Write behavior in src/config. */
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
