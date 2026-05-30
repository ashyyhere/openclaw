import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import type { FileTarget } from "./tool-mutation.js";

/** Redacted tool error details used for diagnostics and loop detection. */
export type ToolErrorSummary = {
  toolName: string;
  meta?: string;
  errorCode?: string;
  error?: string;
  timedOut?: boolean;
  middlewareError?: boolean;
  mutatingAction?: boolean;
  actionFingerprint?: string;
  fileTarget?: FileTarget;
};

const EXEC_LIKE_TOOL_NAMES = new Set(["exec", "bash"]);

/** Return whether a tool name should be treated as shell/exec-like. */
export function isExecLikeToolName(toolName: string): boolean {
  return EXEC_LIKE_TOOL_NAMES.has(normalizeOptionalLowercaseString(toolName) ?? "");
}
