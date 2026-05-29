// utils message channel core helpers and runtime behavior.
import { normalizeChatChannelId } from "../channels/ids.js";
import { normalizeAnyChannelId } from "../channels/registry-normalize.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import { INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants.js";

/** Reused helper for normalize Message Channel behavior in src/utils. */
export function normalizeMessageChannel(raw?: string | null): string | undefined {
  const normalized = normalizeOptionalLowercaseString(raw);
  if (!normalized) {
    return undefined;
  }
  if (normalized === INTERNAL_MESSAGE_CHANNEL) {
    return INTERNAL_MESSAGE_CHANNEL;
  }
  const builtIn = normalizeChatChannelId(normalized);
  if (builtIn) {
    return builtIn;
  }
  return normalizeAnyChannelId(normalized) ?? normalized;
}

/** Reused helper for is Deliverable Message Channel behavior in src/utils. */
export function isDeliverableMessageChannel(value: string): boolean {
  const normalized = normalizeMessageChannel(value);
  return (
    normalized !== undefined && normalized !== INTERNAL_MESSAGE_CHANNEL && normalized === value
  );
}
