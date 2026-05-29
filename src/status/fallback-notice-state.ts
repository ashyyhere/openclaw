// status fallback notice state helpers and runtime behavior.
import { areRuntimeModelRefsEquivalent } from "../agents/model-runtime-aliases.js";
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Shared type for Fallback Notice State in src/status. */
export type FallbackNoticeState = Pick<
  SessionEntry,
  "fallbackNoticeSelectedModel" | "fallbackNoticeActiveModel" | "fallbackNoticeReason"
>;

/** Reused helper for resolve Active Fallback State behavior in src/status. */
export function resolveActiveFallbackState(params: {
  selectedModelRef: string;
  activeModelRef: string;
  config?: OpenClawConfig;
  state?: FallbackNoticeState;
}): { active: boolean; reason?: string } {
  const selected = normalizeOptionalString(params.state?.fallbackNoticeSelectedModel);
  const active = normalizeOptionalString(params.state?.fallbackNoticeActiveModel);
  const reason = normalizeOptionalString(params.state?.fallbackNoticeReason);
  const fallbackActive =
    !areRuntimeModelRefsEquivalent(params.selectedModelRef, params.activeModelRef, {
      config: params.config,
    }) &&
    selected === params.selectedModelRef &&
    active === params.activeModelRef;
  return {
    active: fallbackActive,
    reason: fallbackActive ? reason : undefined,
  };
}
