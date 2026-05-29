/** Holds process-wide models.json write/cache state shared by ESM module reloads. */
const MODELS_JSON_STATE_KEY = Symbol.for("openclaw.modelsJsonState");

type ModelsJsonState = {
  writeLocks: Map<string, Promise<void>>;
  readyCache: Map<
    string,
    Promise<{ fingerprint: string; result: { agentDir: string; wrote: boolean } }>
  >;
};

/** Global write-lock and ready-cache store for generated models.json files. */
export const MODELS_JSON_STATE = (() => {
  const globalState = globalThis as typeof globalThis & {
    [MODELS_JSON_STATE_KEY]?: ModelsJsonState;
  };
  if (!globalState[MODELS_JSON_STATE_KEY]) {
    globalState[MODELS_JSON_STATE_KEY] = {
      writeLocks: new Map<string, Promise<void>>(),
      readyCache: new Map<
        string,
        Promise<{ fingerprint: string; result: { agentDir: string; wrote: boolean } }>
      >(),
    };
  }
  return globalState[MODELS_JSON_STATE_KEY];
})();

/** Clear generated models.json locks/caches between tests. */
export function resetModelsJsonReadyCacheForTest(): void {
  MODELS_JSON_STATE.writeLocks.clear();
  MODELS_JSON_STATE.readyCache.clear();
}
