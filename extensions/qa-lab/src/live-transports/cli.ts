// QA Lab live-transports CLI registry collects built-in and plugin-provided lanes.
import { listQaRunnerCliContributions } from "openclaw/plugin-sdk/qa-runner-runtime";
import { discordQaCliRegistration } from "./discord/cli.js";
import type { LiveTransportQaCliRegistration } from "./shared/live-transport-cli.js";
import { slackQaCliRegistration } from "./slack/cli.js";
import { telegramQaCliRegistration } from "./telegram/cli.js";
import { whatsappQaCliRegistration } from "./whatsapp/cli.js";

function createBlockedQaRunnerCliRegistration(params: {
  commandName: string;
  description?: string;
  pluginId: string;
}): LiveTransportQaCliRegistration {
  return {
    commandName: params.commandName,
    register(qa) {
      qa.command(params.commandName)
        .description(params.description ?? `Run the ${params.commandName} live QA lane`)
        .action(() => {
          throw new Error(
            `QA runner "${params.commandName}" is installed but not active. Enable or allow plugin "${params.pluginId}" in your OpenClaw config, then try again.`,
          );
        });
    },
  };
}

// Disabled plugin runners still get a visible command so operators see the
// missing plugin/config state at invocation time instead of wondering why the
// lane disappeared from the QA CLI.
function createQaRunnerCliRegistration(
  runner: ReturnType<typeof listQaRunnerCliContributions>[number],
): LiveTransportQaCliRegistration {
  if (runner.status === "available") {
    return runner.registration;
  }
  return createBlockedQaRunnerCliRegistration({
    commandName: runner.commandName,
    description: runner.description,
    pluginId: runner.pluginId,
  });
}

const LIVE_TRANSPORT_QA_CLI_REGISTRATIONS: readonly LiveTransportQaCliRegistration[] = [
  telegramQaCliRegistration,
  discordQaCliRegistration,
  slackQaCliRegistration,
  whatsappQaCliRegistration,
];

/** Lists all live-transport QA CLI registrations available in the current runtime. */
export function listLiveTransportQaCliRegistrations(): readonly LiveTransportQaCliRegistration[] {
  const liveRegistrations = [...LIVE_TRANSPORT_QA_CLI_REGISTRATIONS];
  const discoveredRunners = listQaRunnerCliContributions();

  for (const runner of discoveredRunners) {
    liveRegistrations.push(createQaRunnerCliRegistration(runner));
  }

  return liveRegistrations;
}
