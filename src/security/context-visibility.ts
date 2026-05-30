// Supplemental context visibility policy shared by channels and message routing.
import type { ContextVisibilityMode } from "../config/types.base.js";

/** Supplemental context source class used for visibility decisions. */
export type ContextVisibilityKind = "history" | "thread" | "quote" | "forwarded";

/** Reason code explaining a supplemental context visibility decision. */
export type ContextVisibilityDecisionReason =
  | "mode_all"
  | "sender_allowed"
  | "quote_override"
  | "blocked";

/** Include/omit decision for supplemental context. */
export type ContextVisibilityDecision = {
  include: boolean;
  reason: ContextVisibilityDecisionReason;
};

/** Evaluate whether one supplemental context item class is visible. */
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

/** Return only the boolean include decision for supplemental context. */
export function shouldIncludeSupplementalContext(params: {
  mode: ContextVisibilityMode;
  kind: ContextVisibilityKind;
  senderAllowed: boolean;
}): boolean {
  return evaluateSupplementalContextVisibility(params).include;
}

/** Filter supplemental context items and count how many were omitted. */
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
