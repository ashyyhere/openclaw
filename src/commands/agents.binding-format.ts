/** Formats agent route bindings for CLI output. */
import type { AgentRouteBinding } from "../config/types.js";

/** Reused helper for describe Binding behavior in src/commands. */
export function describeBinding(binding: AgentRouteBinding): string {
  const match = binding.match;
  const parts = [match.channel];
  if (match.accountId) {
    parts.push(`accountId=${match.accountId}`);
  }
  if (match.peer) {
    parts.push(`peer=${match.peer.kind}:${match.peer.id}`);
  }
  if (match.guildId) {
    parts.push(`guild=${match.guildId}`);
  }
  if (match.teamId) {
    parts.push(`team=${match.teamId}`);
  }
  return parts.join(" ");
}
