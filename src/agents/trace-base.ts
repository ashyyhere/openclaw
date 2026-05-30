/** Shared base fields attached to agent trace events. */
type AgentTraceBase = {
  runId?: string;
  sessionId?: string;
  sessionKey?: string;
  provider?: string;
  modelId?: string;
  modelApi?: string | null;
  workspaceDir?: string;
};

/** Builds the common trace fields attached to agent runtime telemetry. */
export function buildAgentTraceBase(params: AgentTraceBase): AgentTraceBase {
  return {
    runId: params.runId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    provider: params.provider,
    modelId: params.modelId,
    modelApi: params.modelApi,
    workspaceDir: params.workspaceDir,
  };
}
