// Builds outbound session keys from channel route peers and config scope.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { buildAgentSessionKey, type RoutePeer } from "../../routing/resolve-route.js";

/** Builds the canonical base session key for outbound delivery routing. */
export function buildOutboundBaseSessionKey(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel: string;
  accountId?: string | null;
  peer: RoutePeer;
}): string {
  return buildAgentSessionKey({
    agentId: params.agentId,
    channel: params.channel,
    accountId: params.accountId,
    peer: params.peer,
    dmScope: params.cfg.session?.dmScope ?? "main",
    identityLinks: params.cfg.session?.identityLinks,
  });
}
