// Chat command handler for session and runtime status.
import { logVerbose } from "../../globals.js";
import { buildStatusText } from "../../status/status-text.js";
import type { BuildStatusTextParams } from "../../status/status-text.types.js";
import type { ReplyPayload } from "../types.js";
import type { CommandContext } from "./commands-types.js";
/** Re-exported API for src/auto-reply/reply, starting with build Status Text. */
export { buildStatusText } from "../../status/status-text.js";

type BuildStatusReplyParams = Omit<BuildStatusTextParams, "statusChannel"> & {
  command: CommandContext;
};

/** Reused helper for build Status Reply behavior in src/auto-reply/reply. */
export async function buildStatusReply(
  params: BuildStatusReplyParams,
): Promise<ReplyPayload | undefined> {
  const { command } = params;
  if (!command.isAuthorizedSender) {
    logVerbose(`Ignoring /status from unauthorized sender: ${command.senderId || "<unknown>"}`);
    return undefined;
  }

  return {
    text: await buildStatusText({
      ...params,
      statusChannel: command.channel,
    }),
  };
}
