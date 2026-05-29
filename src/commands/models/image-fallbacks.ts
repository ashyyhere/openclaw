// Image model fallback command wrappers around the shared fallback implementation.
import type { RuntimeEnv } from "../../runtime.js";
import {
  addFallbackCommand,
  clearFallbacksCommand,
  listFallbacksCommand,
  removeFallbackCommand,
} from "./fallbacks-shared.js";

/** Reused helper for models Image Fallbacks List Command behavior in src/commands/models. */
export async function modelsImageFallbacksListCommand(
  opts: { json?: boolean; plain?: boolean },
  runtime: RuntimeEnv,
) {
  return await listFallbacksCommand({ label: "Image fallbacks", key: "imageModel" }, opts, runtime);
}

/** Reused helper for models Image Fallbacks Add Command behavior in src/commands/models. */
export async function modelsImageFallbacksAddCommand(modelRaw: string, runtime: RuntimeEnv) {
  return await addFallbackCommand(
    { label: "Image fallbacks", key: "imageModel", logPrefix: "Image fallbacks" },
    modelRaw,
    runtime,
  );
}

/** Reused helper for models Image Fallbacks Remove Command behavior in src/commands/models. */
export async function modelsImageFallbacksRemoveCommand(modelRaw: string, runtime: RuntimeEnv) {
  return await removeFallbackCommand(
    {
      label: "Image fallbacks",
      key: "imageModel",
      notFoundLabel: "Image fallback",
      logPrefix: "Image fallbacks",
    },
    modelRaw,
    runtime,
  );
}

/** Reused helper for models Image Fallbacks Clear Command behavior in src/commands/models. */
export async function modelsImageFallbacksClearCommand(runtime: RuntimeEnv) {
  return await clearFallbacksCommand(
    { key: "imageModel", clearedMessage: "Image fallback list cleared." },
    runtime,
  );
}
