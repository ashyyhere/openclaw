// Runtime indirection for selecting the model used by commitment extraction.
import { resolveDefaultModelForAgent } from "../agents/model-selection.js";
import type { OpenClawConfig } from "../config/config.js";

/** Resolves the default model used by the hidden commitment extractor. */
export function resolveCommitmentDefaultModelRef(params: {
  cfg: OpenClawConfig;
  agentId?: string;
}): { provider: string; model: string } {
  return resolveDefaultModelForAgent(params);
}
