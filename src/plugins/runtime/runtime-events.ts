// plugins/runtime runtime events helpers and runtime behavior.
import { onAgentEvent } from "../../infra/agent-events.js";
import { onSessionTranscriptUpdate } from "../../sessions/transcript-events.js";
import type { PluginRuntime } from "./types.js";

/** Reused helper for create Runtime Events behavior in src/plugins/runtime. */
export function createRuntimeEvents(): PluginRuntime["events"] {
  return {
    onAgentEvent,
    onSessionTranscriptUpdate,
  };
}
