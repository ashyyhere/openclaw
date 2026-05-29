// Public contracts for plugin-scoped, TTL-aware keyed state storage.
/** Stored plugin-state entry with creation time and optional expiry. */
export type PluginStateEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
};

/** Async keyed state store exposed to plugin and core consumers. */
export type PluginStateKeyedStore<T> = {
  register(key: string, value: T, opts?: { ttlMs?: number }): Promise<void>;
  registerIfAbsent(key: string, value: T, opts?: { ttlMs?: number }): Promise<boolean>;
  lookup(key: string): Promise<T | undefined>;
  consume(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<PluginStateEntry<T>[]>;
  clear(): Promise<void>;
};

/** Synchronous keyed state store for runtime paths that cannot await storage calls. */
export type PluginStateSyncKeyedStore<T> = {
  register(key: string, value: T, opts?: { ttlMs?: number }): void;
  registerIfAbsent(key: string, value: T, opts?: { ttlMs?: number }): boolean;
  lookup(key: string): T | undefined;
  consume(key: string): T | undefined;
  delete(key: string): boolean;
  entries(): PluginStateEntry<T>[];
  clear(): void;
};

/** Options that scope a keyed store and bound its retention. */
export type OpenKeyedStoreOptions = {
  namespace: string;
  maxEntries: number;
  defaultTtlMs?: number;
  env?: NodeJS.ProcessEnv;
};

/** Machine-readable plugin-state storage failure categories. */
export type PluginStateStoreErrorCode =
  | "PLUGIN_STATE_SQLITE_UNAVAILABLE"
  | "PLUGIN_STATE_OPEN_FAILED"
  | "PLUGIN_STATE_WRITE_FAILED"
  | "PLUGIN_STATE_READ_FAILED"
  | "PLUGIN_STATE_CORRUPT"
  | "PLUGIN_STATE_LIMIT_EXCEEDED"
  | "PLUGIN_STATE_INVALID_INPUT";

/** Storage operation names used for diagnostics and wrapped errors. */
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

/** Structured context captured when constructing a plugin-state store error. */
export type PluginStateStoreErrorOptions = {
  code: PluginStateStoreErrorCode;
  operation: PluginStateStoreOperation;
  path?: string;
  cause?: unknown;
};

/** Error type that preserves storage code, operation, path, and original cause. */
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

/** One diagnostic check performed by the plugin-state storage probe. */
export type PluginStateStoreProbeStep = {
  name: string;
  ok: boolean;
  code?: PluginStateStoreErrorCode;
  message?: string;
};

/** Full diagnostic probe result for plugin-state SQLite storage. */
export type PluginStateStoreProbeResult = {
  ok: boolean;
  databasePath: string;
  steps: PluginStateStoreProbeStep[];
};
