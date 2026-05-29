// infra/outbound identity helpers and runtime behavior.
import { resolveAgentAvatar } from "../../agents/identity-avatar.js";
import { resolveAgentIdentity } from "../../agents/identity.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { normalizeOptionalString } from "../../shared/string-coerce.js";
import type { OutboundIdentity } from "./identity-types.js";

/** Re-exported API for src/infra/outbound, starting with Outbound Identity. */
export type { OutboundIdentity } from "./identity-types.js";

/** Reused helper for normalize Outbound Identity behavior in src/infra/outbound. */
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

/** Reused helper for resolve Agent Outbound Identity behavior in src/infra/outbound. */
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
