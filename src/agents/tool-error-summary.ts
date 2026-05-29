/** Extracts compact, redacted summaries from tool errors. */
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import type { FileTarget } from "./tool-mutation.js";

/** Shared type for Tool Error Summary in src/agents. */
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

/** Reused helper for is Exec Like Tool Name behavior in src/agents. */
export function isExecLikeToolName(toolName: string): boolean {
  return EXEC_LIKE_TOOL_NAMES.has(normalizeOptionalLowercaseString(toolName) ?? "");
}
