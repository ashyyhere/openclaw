// QA Lab WhatsApp live-transport CLI registration lazy-loads the WhatsApp lane.
import {
  createLazyCliRuntimeLoader,
  createLiveTransportQaCliRegistration,
  type LiveTransportQaCliRegistration,
  type LiveTransportQaCommandOptions,
} from "../shared/live-transport-cli.js";

type WhatsAppQaCliRuntime = typeof import("./cli.runtime.js");

const loadWhatsAppQaCliRuntime = createLazyCliRuntimeLoader<WhatsAppQaCliRuntime>(
  () => import("./cli.runtime.js"),
);

async function runQaWhatsApp(opts: LiveTransportQaCommandOptions) {
  const runtime = await loadWhatsAppQaCliRuntime();
  await runtime.runQaWhatsAppCommand(opts);
}

/** CLI registration for the WhatsApp live QA lane. */
export const whatsappQaCliRegistration: LiveTransportQaCliRegistration =
  createLiveTransportQaCliRegistration({
    commandName: "whatsapp",
    credentialOptions: {
      sourceDescription: "Credential source for WhatsApp QA: env or convex (default: env)",
      roleDescription:
        "Credential role for convex auth: maintainer or ci (default: ci in CI, maintainer otherwise)",
    },
    description: "Run the WhatsApp live QA lane against two pre-linked Web sessions",
    outputDirHelp: "WhatsApp QA artifact directory",
    scenarioHelp: "Run only the named WhatsApp QA scenario (repeatable)",
    sutAccountHelp: "Temporary WhatsApp account id inside the QA gateway config",
    run: runQaWhatsApp,
  });
