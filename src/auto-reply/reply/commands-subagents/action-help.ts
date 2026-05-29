// Subagent command action for help output.
import type { CommandHandlerResult } from "../commands-types.js";
import { buildSubagentsHelp, stopWithText } from "./shared.js";

/** Reused helper for handle Subagents Help Action behavior in src/auto-reply/reply. */
export function handleSubagentsHelpAction(): CommandHandlerResult {
  return stopWithText(buildSubagentsHelp());
}
