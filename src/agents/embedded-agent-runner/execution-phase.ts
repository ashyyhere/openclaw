/** Embedded-agent execution phase ids and labels. */
export const EMBEDDED_AGENT_EXECUTION_PHASES = [
  "runner_entered",
  "workspace",
  "runtime_plugins",
  "before_agent_reply",
  "model_resolution",
  "auth",
  "context_engine",
  "attempt_dispatch",
  "context_assembled",
  "turn_accepted",
  "process_spawned",
  "tool_execution_started",
  "assistant_output_started",
  "model_call_started",
] as const;

/** Shared type for Embedded Agent Execution Phase in src/agents/embedded-agent-runner. */
export type EmbeddedAgentExecutionPhase = (typeof EMBEDDED_AGENT_EXECUTION_PHASES)[number];

/** Reused constant for EMBEDDED AGENT EXECUTION PHASE LABELS behavior in src/agents/embedded-agent-runner. */
export const EMBEDDED_AGENT_EXECUTION_PHASE_LABELS = {
  runner_entered: "runner-entered",
  workspace: "workspace",
  runtime_plugins: "runtime-plugins",
  before_agent_reply: "before-agent-reply",
  model_resolution: "model-resolution",
  auth: "auth",
  context_engine: "context-engine",
  attempt_dispatch: "attempt-dispatch",
  context_assembled: "context-assembled",
  turn_accepted: "turn-accepted",
  process_spawned: "process-spawned",
  tool_execution_started: "tool-execution-started",
  assistant_output_started: "assistant-output-started",
  model_call_started: "model-call-started",
} as const satisfies Record<EmbeddedAgentExecutionPhase, string>;

/** Reused helper for format Embedded Agent Execution Phase behavior in src/agents/embedded-agent-runner. */
export function formatEmbeddedAgentExecutionPhase(
  phase?: EmbeddedAgentExecutionPhase,
): string | undefined {
  return phase ? EMBEDDED_AGENT_EXECUTION_PHASE_LABELS[phase] : undefined;
}
