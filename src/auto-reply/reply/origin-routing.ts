// Origin routing helpers for inter-session and source-directed replies.
import { normalizeOptionalLowercaseString } from "../../shared/string-coerce.js";
import type { OriginatingChannelType } from "../templating.js";

/** Reused helper for resolve Origin Message Provider behavior in src/auto-reply/reply. */
export function resolveOriginMessageProvider(params: {
  originatingChannel?: OriginatingChannelType;
  provider?: string;
}): string | undefined {
  return (
    normalizeOptionalLowercaseString(params.originatingChannel) ??
    normalizeOptionalLowercaseString(params.provider)
  );
}

/** Reused helper for resolve Origin Message To behavior in src/auto-reply/reply. */
export function resolveOriginMessageTo(params: {
  originatingTo?: string;
  to?: string;
}): string | undefined {
  return params.originatingTo ?? params.to;
}

/** Reused helper for resolve Origin Account Id behavior in src/auto-reply/reply. */
export function resolveOriginAccountId(params: {
  originatingAccountId?: string;
  accountId?: string;
}): string | undefined {
  return params.originatingAccountId ?? params.accountId;
}
