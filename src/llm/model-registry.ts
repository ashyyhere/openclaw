// llm model registry helpers and runtime behavior.
import type { Model } from "./types.js";

/** Shared type for Model Registry in src/llm. */
export type ModelRegistry = {
  getAll(): Model[];
  getAvailable(): Model[];
  find(provider: string, modelId: string): Model | undefined;
  hasConfiguredAuth(model: Model): boolean;
};
