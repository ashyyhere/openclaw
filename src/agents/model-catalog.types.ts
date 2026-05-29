import type { ModelApi, ModelCompatConfig, ModelMediaInputConfig } from "../config/types.models.js";

/** Input modality supported by a model catalog entry. */
export type ModelInputType = "text" | "image" | "audio" | "video" | "document";

/** Normalized model catalog entry from config, manifests, or discovery. */
export type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string;
  alias?: string;
  api?: ModelApi;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  input?: ModelInputType[];
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
};
