/** Public SDK barrel for account id, session key, and channel route helpers. */
export {
  buildAgentSessionKey,
  deriveLastRoutePolicy,
  resolveAgentRoute,
  resolveInboundLastRouteSessionKey,
  type ResolvedAgentRoute,
  type RoutePeer,
  type RoutePeerKind,
} from "../routing/resolve-route.js";
/** Session-key builders and parsers used by channel/provider plugins. */
export {
  buildAgentMainSessionKey,
  DEFAULT_ACCOUNT_ID,
  DEFAULT_MAIN_KEY,
  buildGroupHistoryKey,
  isCronSessionKey,
  isAcpSessionKey,
  isSubagentSessionKey,
  normalizeAccountId,
  normalizeAgentId,
  normalizeMainKey,
  normalizeOptionalAccountId,
  parseAgentSessionKey,
  parseThreadSessionSuffix,
  resolveAgentIdFromSessionKey,
  resolveThreadSessionKeys,
  sanitizeAgentId,
} from "../routing/session-key.js";
/** Resolve a configured account entry for a plugin/channel binding. */
export { resolveAccountEntry } from "../routing/account-lookup.js";
/** Account-binding helpers used by plugins that multiplex accounts. */
export { listBoundAccountIds, resolveDefaultAgentBoundAccountId } from "../routing/bindings.js";
/** User-facing default-account warning formatters shared with setup flows. */
export {
  formatSetExplicitDefaultInstruction,
  formatSetExplicitDefaultToConfiguredInstruction,
} from "../routing/default-account-warnings.js";
/** Build the base session key for outbound channel sends. */
export { buildOutboundBaseSessionKey } from "../infra/outbound/base-session-key.js";
/** Normalize outbound thread ids before session-key construction. */
export { normalizeOutboundThreadId } from "../infra/outbound/thread-id.js";
/** Normalize channel labels used in routing and gateway messages. */
export { normalizeMessageChannel, resolveGatewayMessageChannel } from "../utils/message-channel.js";
