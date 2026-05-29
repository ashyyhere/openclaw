// gateway agent event assistant text helpers and runtime behavior.
import type { AgentEventPayload } from "../infra/agent-events.js";

/** Reused helper for resolve Assistant Stream Delta Text behavior in src/gateway. */
export function resolveAssistantStreamDeltaText(evt: AgentEventPayload): string {
  const delta = evt.data.delta;
  const text = evt.data.text;
  return typeof delta === "string" ? delta : typeof text === "string" ? text : "";
}
