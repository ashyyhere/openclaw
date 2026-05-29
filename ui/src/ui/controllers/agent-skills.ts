// ui/src/ui/controllers agent skills helpers and runtime behavior.
import type { GatewayBrowserClient } from "../gateway.ts";
import type { SkillStatusReport } from "../types.ts";

/** Shared type for Agent Skills State in ui/src/ui/controllers. */
export type AgentSkillsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  agentSkillsLoading: boolean;
  agentSkillsError: string | null;
  agentSkillsReport: SkillStatusReport | null;
  agentSkillsAgentId: string | null;
};

/** Reused helper for load Agent Skills behavior in ui/src/ui/controllers. */
export async function loadAgentSkills(state: AgentSkillsState, agentId: string) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.agentSkillsLoading) {
    return;
  }
  state.agentSkillsLoading = true;
  state.agentSkillsError = null;
  try {
    const res = await state.client.request("skills.status", { agentId });
    if (res) {
      state.agentSkillsReport = res as SkillStatusReport;
      state.agentSkillsAgentId = agentId;
    }
  } catch (err) {
    state.agentSkillsError = String(err);
  } finally {
    state.agentSkillsLoading = false;
  }
}
