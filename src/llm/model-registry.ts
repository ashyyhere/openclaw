// Model registry interface shared by provider routing and catalog callers.
import type { Model } from "./types.js";

/** Query surface for available models and their configured auth state. */
export type ModelRegistry = {
  getAll(): Model[];
  getAvailable(): Model[];
  find(provider: string, modelId: string): Model | undefined;
  hasConfiguredAuth(model: Model): boolean;
};
