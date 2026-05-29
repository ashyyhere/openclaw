// ui/src/ui/controllers agent identity helpers and runtime behavior.
import type { GatewayBrowserClient } from "../gateway.ts";
import type { AgentIdentityResult } from "../types.ts";

/** Shared type for Agent Identity State in ui/src/ui/controllers. */
export type AgentIdentityState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  agentIdentityLoading: boolean;
  agentIdentityError: string | null;
  agentIdentityById: Record<string, AgentIdentityResult>;
};

/** Reused helper for load Agent Identity behavior in ui/src/ui/controllers. */
export async function loadAgentIdentity(state: AgentIdentityState, agentId: string) {
  if (!state.client || !state.connected || state.agentIdentityLoading) {
    return;
  }
  if (state.agentIdentityById[agentId]) {
    return;
  }
  state.agentIdentityLoading = true;
  state.agentIdentityError = null;
  try {
    const res = await state.client.request<AgentIdentityResult | null>("agent.identity.get", {
      agentId,
    });
    if (res) {
      state.agentIdentityById = { ...state.agentIdentityById, [agentId]: res };
    }
  } catch (err) {
    state.agentIdentityError = String(err);
  } finally {
    state.agentIdentityLoading = false;
  }
}

/** Reused helper for load Agent Identities behavior in ui/src/ui/controllers. */
export async function loadAgentIdentities(state: AgentIdentityState, agentIds: string[]) {
  if (!state.client || !state.connected || state.agentIdentityLoading) {
    return;
  }
  const missing = agentIds.filter((id) => !state.agentIdentityById[id]);
  if (missing.length === 0) {
    return;
  }
  state.agentIdentityLoading = true;
  state.agentIdentityError = null;
  try {
    for (const agentId of missing) {
      const res = await state.client.request<AgentIdentityResult | null>("agent.identity.get", {
        agentId,
      });
      if (res) {
        state.agentIdentityById = { ...state.agentIdentityById, [agentId]: res };
      }
    }
  } catch (err) {
    state.agentIdentityError = String(err);
  } finally {
    state.agentIdentityLoading = false;
  }
}
