// Runtime indirection for selecting the model used by commitment extraction.
import { resolveDefaultModelForAgent } from "../agents/model-selection.js";
import type { OpenClawConfig } from "../config/config.js";

/** Reused helper for resolve Commitment Default Model Ref behavior in src/commitments. */
export function resolveCommitmentDefaultModelRef(params: {
  cfg: OpenClawConfig;
  agentId?: string;
}): { provider: string; model: string } {
  return resolveDefaultModelForAgent(params);
}
