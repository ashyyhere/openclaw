import type { Command } from "commander";
import { formatDocsLink } from "../../packages/terminal-core/src/links.js";
import { theme } from "../../packages/terminal-core/src/theme.js";
import { registerQrCli } from "./qr-cli.js";

/** Register legacy clawbot aliases that still route through the QR pairing command. */
export function registerClawbotCli(program: Command) {
  const clawbot = program
    .command("clawbot")
    .description("Legacy clawbot command aliases")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/clawbot", "docs.openclaw.ai/cli/clawbot")}\n`,
    );
  registerQrCli(clawbot);
}
