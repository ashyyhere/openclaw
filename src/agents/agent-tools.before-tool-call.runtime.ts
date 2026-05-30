import { getDiagnosticSessionState } from "../logging/diagnostic-session-state.js";
import { logToolLoopAction } from "../logging/diagnostic.js";
import {
  detectToolCallLoop,
  recordToolCall,
  recordToolCallOutcome,
} from "./tool-loop-detection.js";

/** Runtime dependencies injected into before-tool-call hook processing. */
export const beforeToolCallRuntime = {
  getDiagnosticSessionState,
  logToolLoopAction,
  detectToolCallLoop,
  recordToolCall,
  recordToolCallOutcome,
};
