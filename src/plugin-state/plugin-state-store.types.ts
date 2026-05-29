// Shared types for plugin-state plugin state store types behavior.
/** Shared type for Plugin State Entry in src/plugin-state. */
export type PluginStateEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
};

/** Shared type for Plugin State Keyed Store in src/plugin-state. */
export type PluginStateKeyedStore<T> = {
  register(key: string, value: T, opts?: { ttlMs?: number }): Promise<void>;
  registerIfAbsent(key: string, value: T, opts?: { ttlMs?: number }): Promise<boolean>;
  lookup(key: string): Promise<T | undefined>;
  consume(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<PluginStateEntry<T>[]>;
  clear(): Promise<void>;
};

/** Shared type for Plugin State Sync Keyed Store in src/plugin-state. */
export type PluginStateSyncKeyedStore<T> = {
  register(key: string, value: T, opts?: { ttlMs?: number }): void;
  registerIfAbsent(key: string, value: T, opts?: { ttlMs?: number }): boolean;
  lookup(key: string): T | undefined;
  consume(key: string): T | undefined;
  delete(key: string): boolean;
  entries(): PluginStateEntry<T>[];
  clear(): void;
};

/** Shared type for Open Keyed Store Options in src/plugin-state. */
export type OpenKeyedStoreOptions = {
  namespace: string;
  maxEntries: number;
  defaultTtlMs?: number;
  env?: NodeJS.ProcessEnv;
};

/** Shared type for Plugin State Store Error Code in src/plugin-state. */
export type PluginStateStoreErrorCode =
  | "PLUGIN_STATE_SQLITE_UNAVAILABLE"
  | "PLUGIN_STATE_OPEN_FAILED"
  | "PLUGIN_STATE_WRITE_FAILED"
  | "PLUGIN_STATE_READ_FAILED"
  | "PLUGIN_STATE_CORRUPT"
  | "PLUGIN_STATE_LIMIT_EXCEEDED"
  | "PLUGIN_STATE_INVALID_INPUT";

/** Shared type for Plugin State Store Operation in src/plugin-state. */
export type PluginStateStoreOperation =
  | "load-sqlite"
  | "open"
  | "ensure-schema"
  | "register"
  | "lookup"
  | "consume"
  | "delete"
  | "entries"
  | "clear"
  | "sweep"
  | "probe"
  | "close";

/** Shared type for Plugin State Store Error Options in src/plugin-state. */
export type PluginStateStoreErrorOptions = {
  code: PluginStateStoreErrorCode;
  operation: PluginStateStoreOperation;
  path?: string;
  cause?: unknown;
};

/** Reused class for Plugin State Store Error behavior in src/plugin-state. */
export class PluginStateStoreError extends Error {
  readonly code: PluginStateStoreErrorCode;
  readonly operation: PluginStateStoreOperation;
  readonly path?: string;

  constructor(message: string, options: PluginStateStoreErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "PluginStateStoreError";
    this.code = options.code;
    this.operation = options.operation;
    if (options.path) {
      this.path = options.path;
    }
  }
}

/** Shared type for Plugin State Store Probe Step in src/plugin-state. */
export type PluginStateStoreProbeStep = {
  name: string;
  ok: boolean;
  code?: PluginStateStoreErrorCode;
  message?: string;
};

/** Shared type for Plugin State Store Probe Result in src/plugin-state. */
export type PluginStateStoreProbeResult = {
  ok: boolean;
  databasePath: string;
  steps: PluginStateStoreProbeStep[];
};
