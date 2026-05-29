// security context visibility helpers and runtime behavior.
import type { ContextVisibilityMode } from "../config/types.base.js";

/** Shared type for Context Visibility Kind in src/security. */
export type ContextVisibilityKind = "history" | "thread" | "quote" | "forwarded";

/** Shared type for Context Visibility Decision Reason in src/security. */
export type ContextVisibilityDecisionReason =
  | "mode_all"
  | "sender_allowed"
  | "quote_override"
  | "blocked";

/** Shared type for Context Visibility Decision in src/security. */
export type ContextVisibilityDecision = {
  include: boolean;
  reason: ContextVisibilityDecisionReason;
};

/** Reused helper for evaluate Supplemental Context Visibility behavior in src/security. */
export function evaluateSupplementalContextVisibility(params: {
  mode: ContextVisibilityMode;
  kind: ContextVisibilityKind;
  senderAllowed: boolean;
}): ContextVisibilityDecision {
  if (params.mode === "all") {
    return { include: true, reason: "mode_all" };
  }
  if (params.senderAllowed) {
    return { include: true, reason: "sender_allowed" };
  }
  if (params.mode === "allowlist_quote" && params.kind === "quote") {
    return { include: true, reason: "quote_override" };
  }
  return { include: false, reason: "blocked" };
}

/** Reused helper for should Include Supplemental Context behavior in src/security. */
export function shouldIncludeSupplementalContext(params: {
  mode: ContextVisibilityMode;
  kind: ContextVisibilityKind;
  senderAllowed: boolean;
}): boolean {
  return evaluateSupplementalContextVisibility(params).include;
}

/** Reused helper for filter Supplemental Context Items behavior in src/security. */
export function filterSupplementalContextItems<T>(params: {
  items: readonly T[];
  mode: ContextVisibilityMode;
  kind: ContextVisibilityKind;
  isSenderAllowed: (item: T) => boolean;
}): { items: T[]; omitted: number } {
  const items = params.items.filter((item) =>
    shouldIncludeSupplementalContext({
      mode: params.mode,
      kind: params.kind,
      senderAllowed: params.isSenderAllowed(item),
    }),
  );
  return {
    items,
    omitted: params.items.length - items.length,
  };
}
