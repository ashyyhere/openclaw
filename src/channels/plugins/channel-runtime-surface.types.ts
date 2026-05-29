// Channel runtime surface key types for plugin lifecycle caches.
/** Shared type for Channel Runtime Context Key in src/channels/plugins. */
export type ChannelRuntimeContextKey = {
  channelId: string;
  accountId?: string | null;
  capability: string;
};

/** Shared type for Channel Runtime Context Event in src/channels/plugins. */
export type ChannelRuntimeContextEvent = {
  type: "registered" | "unregistered";
  key: {
    channelId: string;
    accountId?: string;
    capability: string;
  };
  context?: unknown;
};

/** Shared type for Channel Runtime Context Registry in src/channels/plugins. */
export type ChannelRuntimeContextRegistry = {
  register: (
    params: ChannelRuntimeContextKey & {
      context: unknown;
      abortSignal?: AbortSignal;
    },
  ) => { dispose: () => void };
  // oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Runtime context values are caller-typed by key.
  get: <T = unknown>(params: ChannelRuntimeContextKey) => T | undefined;
  watch: (params: {
    channelId?: string;
    accountId?: string | null;
    capability?: string;
    onEvent: (event: ChannelRuntimeContextEvent) => void;
  }) => () => void;
};

/**
 * Minimal channel-runtime surface threaded through gateway/setup flows.
 *
 * Most callers only pass this object through or use `runtimeContexts`.
 * Keeping this leaf contract small avoids dragging the full plugin runtime
 * graph into generic channel adapter types.
 */
export type ChannelRuntimeSurface = {
  runtimeContexts: ChannelRuntimeContextRegistry;
  [key: string]: unknown;
};
