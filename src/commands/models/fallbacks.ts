// Text model fallback command wrappers around the shared fallback implementation.
import type { RuntimeEnv } from "../../runtime.js";
import {
  addFallbackCommand,
  clearFallbacksCommand,
  listFallbacksCommand,
  removeFallbackCommand,
} from "./fallbacks-shared.js";

/** Reused helper for models Fallbacks List Command behavior in src/commands/models. */
export async function modelsFallbacksListCommand(
  opts: { json?: boolean; plain?: boolean },
  runtime: RuntimeEnv,
) {
  return await listFallbacksCommand({ label: "Fallbacks", key: "model" }, opts, runtime);
}

/** Reused helper for models Fallbacks Add Command behavior in src/commands/models. */
export async function modelsFallbacksAddCommand(modelRaw: string, runtime: RuntimeEnv) {
  return await addFallbackCommand(
    { label: "Fallbacks", key: "model", logPrefix: "Fallbacks" },
    modelRaw,
    runtime,
  );
}

/** Reused helper for models Fallbacks Remove Command behavior in src/commands/models. */
export async function modelsFallbacksRemoveCommand(modelRaw: string, runtime: RuntimeEnv) {
  return await removeFallbackCommand(
    {
      label: "Fallbacks",
      key: "model",
      notFoundLabel: "Fallback",
      logPrefix: "Fallbacks",
    },
    modelRaw,
    runtime,
  );
}

/** Reused helper for models Fallbacks Clear Command behavior in src/commands/models. */
export async function modelsFallbacksClearCommand(runtime: RuntimeEnv) {
  return await clearFallbacksCommand(
    { key: "model", clearedMessage: "Fallback list cleared." },
    runtime,
  );
}
