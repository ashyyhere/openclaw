// Pairing challenge message formatting for channel replies.
import { formatCliCommand } from "../cli/command-format.js";
import type { PairingChannel } from "./pairing-store.types.js";

/** Builds the user-facing pairing reply with approval command and one-time code. */
export function buildPairingReply(params: {
  channel: PairingChannel;
  idLine: string;
  code: string;
}): string {
  const { channel, idLine, code } = params;
  const approveCommand = formatCliCommand(`openclaw pairing approve ${channel} ${code}`);
  return [
    "OpenClaw: access not configured.",
    "",
    idLine,
    "Pairing code:",
    "```",
    code,
    "```",
    "",
    "Ask the bot owner to approve with:",
    formatCliCommand(`openclaw pairing approve ${channel} ${code}`),
    "```",
    approveCommand,
    "```",
  ].join("\n");
}
