// Chat command handler for Crestodian integration controls.
import { logVerbose } from "../../globals.js";
import type { CommandHandler } from "./commands-types.js";

/** Reused constant for handle Crestodian Command behavior in src/auto-reply/reply. */
export const handleCrestodianCommand: CommandHandler = async (params, allowTextCommands) => {
  if (!allowTextCommands) {
    return null;
  }
  const { extractCrestodianRescueMessage, runCrestodianRescueMessage } =
    await import("../../crestodian/rescue-message.js");
  if (extractCrestodianRescueMessage(params.command.commandBodyNormalized) === null) {
    return null;
  }
  if (!params.command.isAuthorizedSender) {
    logVerbose(
      `Ignoring /crestodian from unauthorized sender: ${params.command.senderId || "<unknown>"}`,
    );
    return { shouldContinue: false };
  }
  return {
    shouldContinue: false,
    reply: {
      text:
        (await runCrestodianRescueMessage({
          cfg: params.cfg,
          command: params.command,
          commandBody: params.command.commandBodyNormalized,
          agentId: params.agentId,
          isGroup: params.isGroup,
        })) ?? "Crestodian did not find a rescue request.",
    },
  };
};
