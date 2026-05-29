// Command handler for context report generation requests.
import { logVerbose } from "../../globals.js";
import { buildContextReply } from "./commands-context-report.js";
import type { CommandHandler } from "./commands-types.js";

/** Reused constant for handle Context Command behavior in src/auto-reply/reply. */
export const handleContextCommand: CommandHandler = async (params, allowTextCommands) => {
  if (!allowTextCommands) {
    return null;
  }
  const normalized = params.command.commandBodyNormalized;
  if (normalized !== "/context" && !normalized.startsWith("/context ")) {
    return null;
  }
  if (!params.command.isAuthorizedSender) {
    logVerbose(
      `Ignoring /context from unauthorized sender: ${params.command.senderId || "<unknown>"}`,
    );
    return { shouldContinue: false };
  }
  return { shouldContinue: false, reply: await buildContextReply(params) };
};
