// Test helpers for subagent command suites.
import type { InlineDirectives } from "./directive-handling.js";

/** Reused helper for create Empty Inline Directives behavior in src/auto-reply/reply. */
export function createEmptyInlineDirectives(): InlineDirectives {
  return {
    cleaned: "",
    hasThinkDirective: false,
    clearThinkLevel: false,
    hasVerboseDirective: false,
    hasFastDirective: false,
    clearFastMode: false,
    hasReasoningDirective: false,
    hasTraceDirective: false,
    hasElevatedDirective: false,
    hasExecDirective: false,
    hasExecOptions: false,
    invalidExecHost: false,
    invalidExecSecurity: false,
    invalidExecAsk: false,
    invalidExecNode: false,
    hasStatusDirective: false,
    hasModelDirective: false,
    hasQueueDirective: false,
    queueReset: false,
    hasQueueOptions: false,
  };
}
