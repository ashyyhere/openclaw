import type { Model } from "../../../llm/types.js";
import {
  collectEntriesForBranchSummaryFromBranches,
  generateBranchSummary as generateBranchSummaryCore,
  openClawAgentCoreRuntime,
  prepareBranchEntries,
  type BranchPreparation,
  type BranchSummaryDetails,
  type FileOperations,
} from "../../runtime/index.js";
import type { SessionEntry, ReadonlySessionManager } from "../session-manager.js";

/** Branch summary preparation and filesystem operation contracts from agent-core. */
export type { BranchPreparation, BranchSummaryDetails, FileOperations };
/** Prepare branch entries before generating a branch summary. */
export { prepareBranchEntries };

/** Transcript entries and common ancestor selected for branch summarization. */
export interface CollectEntriesResult {
  entries: SessionEntry[];
  commonAncestorId: string | null;
}

/** Branch summary text plus file metadata or failure state. */
export interface BranchSummaryResult {
  summary?: string;
  readFiles?: string[];
  modifiedFiles?: string[];
  aborted?: boolean;
  error?: string;
}

/** Model/auth/runtime options for branch summary generation. */
export interface GenerateBranchSummaryOptions {
  model: Model;
  apiKey: string;
  headers?: Record<string, string>;
  signal: AbortSignal;
  customInstructions?: string;
  replaceInstructions?: boolean;
  reserveTokens?: number;
}

/** Collects transcript entries needed to summarize a branch. */
export function collectEntriesForBranchSummary(
  session: ReadonlySessionManager,
  oldLeafId: string | null,
  targetId: string,
): CollectEntriesResult {
  if (!oldLeafId) {
    return { entries: [], commonAncestorId: null };
  }

  const oldBranch = session.getBranch(oldLeafId);
  const targetPath = session.getBranch(targetId);
  return collectEntriesForBranchSummaryFromBranches(oldBranch, targetPath);
}

/** Generates a branch summary with the OpenClaw agent-core runtime. */
export async function generateBranchSummary(
  entries: SessionEntry[],
  options: GenerateBranchSummaryOptions,
): Promise<BranchSummaryResult> {
  const result = await generateBranchSummaryCore(entries, {
    runtime: openClawAgentCoreRuntime,
    ...options,
  });
  if (result.ok) {
    return result.value;
  }
  if (result.error.code === "aborted") {
    return { aborted: true, error: result.error.message };
  }
  return { error: result.error.message };
}
