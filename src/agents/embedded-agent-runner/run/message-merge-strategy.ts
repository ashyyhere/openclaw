/** Registry for message merge behavior applied before provider submission. */
import { mergeOrphanedTrailingUserPrompt } from "./attempt.prompt-helpers.js";
import type { EmbeddedRunAttemptParams } from "./types.js";

/** Shared type for Orphaned Trailing User Prompt Merge Params in src/agents/embedded-agent-runner. */
export type OrphanedTrailingUserPromptMergeParams = {
  prompt: string;
  trigger: EmbeddedRunAttemptParams["trigger"];
  leafMessage: { content?: unknown };
};

/** Shared type for Orphaned Trailing User Prompt Merge Result in src/agents/embedded-agent-runner. */
export type OrphanedTrailingUserPromptMergeResult = {
  prompt: string;
  merged: boolean;
  /**
   * When false, the active session leaf is preserved. Use this only when the
   * caller intentionally accepts that the next appended prompt may follow an
   * existing user leaf; most providers reject consecutive user turns.
   */
  removeLeaf: boolean;
};

/** Shared type for Message Merge Strategy Id in src/agents/embedded-agent-runner. */
export type MessageMergeStrategyId = "orphan-trailing-user-prompt";

/** Shared type for Message Merge Strategy in src/agents/embedded-agent-runner. */
export type MessageMergeStrategy = {
  id: MessageMergeStrategyId;
  mergeOrphanedTrailingUserPrompt: (
    params: OrphanedTrailingUserPromptMergeParams,
  ) => OrphanedTrailingUserPromptMergeResult;
};

/** Reused constant for DEFAULT MESSAGE MERGE STRATEGY ID behavior in src/agents/embedded-agent-runner. */
export const DEFAULT_MESSAGE_MERGE_STRATEGY_ID: MessageMergeStrategyId =
  "orphan-trailing-user-prompt";

const defaultMessageMergeStrategy: MessageMergeStrategy = {
  id: DEFAULT_MESSAGE_MERGE_STRATEGY_ID,
  mergeOrphanedTrailingUserPrompt,
};

let activeMessageMergeStrategy = defaultMessageMergeStrategy;

/** Returns the active message merge strategy. */
export function resolveMessageMergeStrategy(): MessageMergeStrategy {
  return activeMessageMergeStrategy;
}

function registerMessageMergeStrategy(strategy: MessageMergeStrategy): () => void {
  const previous = activeMessageMergeStrategy;
  activeMessageMergeStrategy = strategy;
  return () => {
    activeMessageMergeStrategy = previous;
  };
}

/** Temporarily replaces the merge strategy for isolated tests. */
export function registerMessageMergeStrategyForTest(strategy: MessageMergeStrategy): () => void {
  return registerMessageMergeStrategy(strategy);
}
