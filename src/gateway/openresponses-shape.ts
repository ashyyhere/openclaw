// gateway openresponses shape helpers and runtime behavior.
import type { OutputItem } from "./open-responses.schema.js";

/** Reused helper for create Assistant Output Item behavior in src/gateway. */
export function createAssistantOutputItem(params: {
  id: string;
  text: string;
  phase?: "commentary" | "final_answer";
  status?: "in_progress" | "completed";
}): OutputItem {
  return {
    type: "message",
    id: params.id,
    role: "assistant",
    content: [{ type: "output_text", text: params.text }],
    ...(params.phase ? { phase: params.phase } : {}),
    status: params.status,
  };
}

/** Reused helper for create Function Call Output Item behavior in src/gateway. */
export function createFunctionCallOutputItem(params: {
  id: string;
  callId: string;
  name: string;
  arguments: string;
  status?: "in_progress" | "completed";
}): OutputItem {
  return {
    type: "function_call",
    id: params.id,
    call_id: params.callId,
    name: params.name,
    arguments: params.arguments,
    status: params.status,
  };
}
