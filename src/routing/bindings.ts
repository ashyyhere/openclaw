// Reads route bindings and derives account bindings by channel and agent.
import { resolveDefaultAgentId } from "../agents/agent-scope.js";
import { listRouteBindings } from "../config/bindings.js";
import type { AgentRouteBinding } from "../config/types.agents.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  normalizeRouteBindingChannelId,
  resolveNormalizedRouteBindingMatch,
} from "./binding-scope.js";
import { normalizeAgentId } from "./session-key.js";

/** Returns configured agent route bindings from the OpenClaw config. */
export function listBindings(cfg: OpenClawConfig): AgentRouteBinding[] {
  return listRouteBindings(cfg);
}

/** Lists account ids bound to any agent for a channel. */
export function listBoundAccountIds(cfg: OpenClawConfig, channelId: string): string[] {
  const normalizedChannel = normalizeRouteBindingChannelId(channelId);
  if (!normalizedChannel) {
    return [];
  }
  const ids = new Set<string>();
  for (const binding of listBindings(cfg)) {
    const resolved = resolveNormalizedRouteBindingMatch(binding);
    if (!resolved || resolved.channelId !== normalizedChannel) {
      continue;
    }
    ids.add(resolved.accountId);
  }
  return Array.from(ids).toSorted((a, b) => a.localeCompare(b));
}

/** Returns the first account bound to the default agent for a channel. */
export function resolveDefaultAgentBoundAccountId(
  cfg: OpenClawConfig,
  channelId: string,
): string | null {
  const normalizedChannel = normalizeRouteBindingChannelId(channelId);
  if (!normalizedChannel) {
    return null;
  }
  const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(cfg));
  for (const binding of listBindings(cfg)) {
    const resolved = resolveNormalizedRouteBindingMatch(binding);
    if (
      !resolved ||
      resolved.channelId !== normalizedChannel ||
      resolved.agentId !== defaultAgentId
    ) {
      continue;
    }
    return resolved.accountId;
  }
  return null;
}

/** Builds a channel -> agent -> account-id map from normalized route bindings. */
export function buildChannelAccountBindings(cfg: OpenClawConfig) {
  const map = new Map<string, Map<string, string[]>>();
  for (const binding of listBindings(cfg)) {
    const resolved = resolveNormalizedRouteBindingMatch(binding);
    if (!resolved) {
      continue;
    }
    const byAgent = map.get(resolved.channelId) ?? new Map<string, string[]>();
    const list = byAgent.get(resolved.agentId) ?? [];
    if (!list.includes(resolved.accountId)) {
      list.push(resolved.accountId);
    }
    byAgent.set(resolved.agentId, list);
    map.set(resolved.channelId, byAgent);
  }
  return map;
}

/** Chooses a bound account when available, otherwise the configured default account. */
export function resolvePreferredAccountId(params: {
  accountIds: string[];
  defaultAccountId: string;
  boundAccounts: string[];
}): string {
  if (params.boundAccounts.length > 0) {
    return params.boundAccounts[0];
  }
  return params.defaultAccountId;
}
