/** Runtime registry for compaction-safeguard hooks and cancellation reasons. */
import type { AgentCompactionIdentifierPolicy } from "../../config/types.agent-defaults.js";
import type { Model } from "../../llm/types.js";
import { createSessionManagerRuntimeRegistry } from "./session-manager-runtime-registry.js";

/** Hook implementation bundle used by compaction safeguard runtime calls. */
export type CompactionSafeguardRuntimeValue = {
  maxHistoryShare?: number;
  contextWindowTokens?: number;
  identifierPolicy?: AgentCompactionIdentifierPolicy;
  identifierInstructions?: string;
  customInstructions?: string;
  /**
   * Model to use for compaction summarization.
   * Passed through runtime because `ctx.model` is undefined in the compact.ts workflow
   * (extensionRunner.initialize() is never called in that path).
   */
  model?: Model;
  recentTurnsPreserve?: number;
  workspaceDir?: string;
  postCompactionSections?: string[];
  qualityGuardEnabled?: boolean;
  qualityGuardMaxRetries?: number;
  /**
   * Id of a registered compaction provider plugin.
   * When set and found in the compaction provider registry, the provider's
   * `summarize()` is called instead of the built-in `summarizeInStages()`.
   */
  provider?: string;
  /**
   * Pending human-readable cancel reason from the current safeguard compaction
   * attempt. OpenClaw consumes this to replace the upstream generic
   * "Compaction cancelled" message.
   */
  cancelReason?: string;
};

const registry = createSessionManagerRuntimeRegistry<CompactionSafeguardRuntimeValue>();

/** Reused constant for set Compaction Safeguard Runtime behavior in src/agents/agent-hooks. */
export const setCompactionSafeguardRuntime = registry.set;

/** Reused constant for get Compaction Safeguard Runtime behavior in src/agents/agent-hooks. */
export const getCompactionSafeguardRuntime = registry.get;

/** Records why a compaction attempt was cancelled for a session manager. */
export function setCompactionSafeguardCancelReason(
  sessionManager: unknown,
  reason: string | undefined,
): void {
  const current = getCompactionSafeguardRuntime(sessionManager);
  const trimmed = reason?.trim();

  if (!current) {
    if (!trimmed) {
      return;
    }
    setCompactionSafeguardRuntime(sessionManager, { cancelReason: trimmed });
    return;
  }

  const next = { ...current };
  if (trimmed) {
    next.cancelReason = trimmed;
  } else {
    delete next.cancelReason;
  }
  setCompactionSafeguardRuntime(sessionManager, next);
}

/** Reads and clears the most recent compaction cancellation reason for a session manager. */
export function consumeCompactionSafeguardCancelReason(sessionManager: unknown): string | null {
  const current = getCompactionSafeguardRuntime(sessionManager);
  const reason = current?.cancelReason?.trim();
  if (!reason) {
    return null;
  }

  const next = { ...current };
  delete next.cancelReason;
  setCompactionSafeguardRuntime(sessionManager, Object.keys(next).length > 0 ? next : null);
  return reason;
}
