// hooks legacy config helpers and runtime behavior.
type LegacyInternalHookHandler = {
  event: string;
  module: string;
  export?: string;
};

type LegacyInternalHooksCarrier = {
  hooks?: {
    internal?: {
      handlers?: LegacyInternalHookHandler[];
    };
  };
};

/** Reused helper for get Legacy Internal Hook Handlers behavior in src/hooks. */
export function getLegacyInternalHookHandlers(config: unknown): LegacyInternalHookHandler[] {
  const handlers = (config as LegacyInternalHooksCarrier)?.hooks?.internal?.handlers;
  return Array.isArray(handlers) ? handlers : [];
}
