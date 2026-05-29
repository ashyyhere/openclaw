/** Registry accessors for channel setup plugins and setup wizards. */
import { listChannelSetupPlugins } from "../../channels/plugins/setup-registry.js";
import { buildChannelSetupWizardAdapterFromSetupWizard } from "../../channels/plugins/setup-wizard.js";
import type { ChannelSetupWizard } from "../../channels/plugins/setup-wizard.js";
import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelChoice } from "../onboard-types.js";
import type { ChannelSetupWizardAdapter } from "./types.js";

const setupWizardAdapters = new WeakMap<object, ChannelSetupWizardAdapter>();

function isChannelSetupWizardAdapter(
  setupWizard: ChannelPlugin["setupWizard"],
): setupWizard is ChannelSetupWizardAdapter {
  return Boolean(
    setupWizard &&
    typeof setupWizard === "object" &&
    "getStatus" in setupWizard &&
    typeof setupWizard.getStatus === "function" &&
    "configure" in setupWizard &&
    typeof setupWizard.configure === "function",
  );
}

function isDeclarativeChannelSetupWizard(
  setupWizard: ChannelPlugin["setupWizard"],
): setupWizard is ChannelSetupWizard {
  return Boolean(
    setupWizard &&
    typeof setupWizard === "object" &&
    "status" in setupWizard &&
    "credentials" in setupWizard,
  );
}

/** Reused helper for resolve Channel Setup Wizard Adapter For Plugin behavior in src/commands/channel-setup. */
export function resolveChannelSetupWizardAdapterForPlugin(
  plugin?: ChannelPlugin,
): ChannelSetupWizardAdapter | undefined {
  if (!plugin) {
    return undefined;
  }
  const { setupWizard } = plugin;
  if (isChannelSetupWizardAdapter(setupWizard)) {
    return setupWizard;
  }
  if (isDeclarativeChannelSetupWizard(setupWizard)) {
    const cached = setupWizardAdapters.get(plugin);
    if (cached) {
      return cached;
    }
    const adapter = buildChannelSetupWizardAdapterFromSetupWizard({
      plugin,
      wizard: setupWizard,
    });
    setupWizardAdapters.set(plugin, adapter);
    return adapter;
  }
  return undefined;
}

const getChannelSetupWizardAdapterMap = () => {
  const adapters = new Map<ChannelChoice, ChannelSetupWizardAdapter>();
  for (const plugin of listChannelSetupPlugins()) {
    const adapter = resolveChannelSetupWizardAdapterForPlugin(plugin);
    if (!adapter) {
      continue;
    }
    adapters.set(plugin.id, adapter);
  }
  return adapters;
};

/** Reused helper for get Channel Setup Wizard Adapter behavior in src/commands/channel-setup. */
export function getChannelSetupWizardAdapter(
  channel: ChannelChoice,
): ChannelSetupWizardAdapter | undefined {
  return getChannelSetupWizardAdapterMap().get(channel);
}
