// Dispatch helpers for subagent command operations.
import type { SubagentRunRecord } from "../../agents/subagent-registry.types.js";
import type { HandleCommandsParams } from "./commands-types.js";

/** Re-exported API for src/auto-reply/reply. */
export {
  COMMAND,
  resolveHandledPrefix,
  resolveRequesterSessionKey,
  resolveSubagentsAction,
  stopWithText,
} from "./commands-subagents/shared.js";

/** Shared type for Subagents Command Context in src/auto-reply/reply. */
export type SubagentsCommandContext = {
  params: HandleCommandsParams;
  handledPrefix: string;
  requesterKey: string;
  runs: SubagentRunRecord[];
  restTokens: string[];
};
