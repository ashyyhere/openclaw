// Resolves outbound sender identity metadata from agent configuration.
import { resolveAgentAvatar } from "../../agents/identity-avatar.js";
import { resolveAgentIdentity } from "../../agents/identity.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { normalizeOptionalString } from "../../shared/string-coerce.js";
import type { OutboundIdentity } from "./identity-types.js";

/** Outbound sender display identity shape. */
export type { OutboundIdentity } from "./identity-types.js";

/** Removes empty sender identity fields and returns undefined when none remain. */
export function normalizeOutboundIdentity(
  identity?: OutboundIdentity | null,
): OutboundIdentity | undefined {
  if (!identity) {
    return undefined;
  }
  const name = normalizeOptionalString(identity.name);
  const avatarUrl = normalizeOptionalString(identity.avatarUrl);
  const emoji = normalizeOptionalString(identity.emoji);
  const theme = normalizeOptionalString(identity.theme);
  if (!name && !avatarUrl && !emoji && !theme) {
    return undefined;
  }
  return { name, avatarUrl, emoji, theme };
}

/** Resolves an agent's outbound display identity and remote avatar URL. */
export function resolveAgentOutboundIdentity(
  cfg: OpenClawConfig,
  agentId: string,
): OutboundIdentity | undefined {
  const agentIdentity = resolveAgentIdentity(cfg, agentId);
  const avatar = resolveAgentAvatar(cfg, agentId);
  return normalizeOutboundIdentity({
    name: agentIdentity?.name,
    emoji: agentIdentity?.emoji,
    avatarUrl: avatar.kind === "remote" ? avatar.url : undefined,
    theme: agentIdentity?.theme,
  });
}
