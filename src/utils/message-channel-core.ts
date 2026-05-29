// Message channel normalization shared by delivery routing and session metadata.
import { normalizeChatChannelId } from "../channels/ids.js";
import { normalizeAnyChannelId } from "../channels/registry-normalize.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import { INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants.js";

/** Normalize built-in, internal, and plugin channel ids into canonical form. */
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

/** Return true for concrete channels that can receive outbound messages. */
export function isDeliverableMessageChannel(value: string): boolean {
  const normalized = normalizeMessageChannel(value);
  return (
    normalized !== undefined && normalized !== INTERNAL_MESSAGE_CHANNEL && normalized === value
  );
}
