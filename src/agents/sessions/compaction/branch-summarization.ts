/** Branch summarization wrappers around agent-core compaction helpers. */
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

/** Re-exported API for src/agents/sessions, starting with Branch Preparation. */
export type { BranchPreparation, BranchSummaryDetails, FileOperations };
/** Re-exported API for src/agents/sessions, starting with prepare Branch Entries. */
export { prepareBranchEntries };

/** Shared type for Collect Entries Result in src/agents/sessions. */
export interface CollectEntriesResult {
  entries: SessionEntry[];
  commonAncestorId: string | null;
}

/** Shared type for Branch Summary Result in src/agents/sessions. */
export interface BranchSummaryResult {
  summary?: string;
  readFiles?: string[];
  modifiedFiles?: string[];
  aborted?: boolean;
  error?: string;
}

/** Shared type for Generate Branch Summary Options in src/agents/sessions. */
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
