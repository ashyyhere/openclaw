/** Classifies native harness compaction failures that OpenClaw can retry. */
import type { EmbeddedAgentCompactResult } from "../embedded-agent-runner/types.js";

/** Returns whether a native harness binding reason is retryable after compaction. */
export function isRecoverableNativeHarnessBindingReason(reason: unknown): boolean {
  if (typeof reason !== "string") {
    return false;
  }
  const normalized = reason.trim().toLowerCase();
  return (
    normalized === "missing_thread_binding" ||
    normalized === "stale_thread_binding" ||
    normalized.includes("thread not found") ||
    normalized.includes("no thread binding")
  );
}

/** Checks a compaction result for recoverable native harness binding failure. */
export function isRecoverableNativeHarnessBindingFailure(
  result: EmbeddedAgentCompactResult | undefined,
): boolean {
  return (
    result?.ok === false &&
    (isRecoverableNativeHarnessBindingReason(result.failure?.reason) ||
      isRecoverableNativeHarnessBindingReason(result.reason))
  );
}
