// plugin-sdk channel setup helpers and runtime behavior.
import type { ChannelSetupWizard } from "../channels/plugins/setup-wizard-types.js";
import type { ChannelSetupAdapter } from "../channels/plugins/types.adapters.js";
import {
  createOptionalChannelSetupAdapter,
  createOptionalChannelSetupWizard,
} from "./optional-channel-setup.js";

/** Re-exported API for src/plugin-sdk, starting with Channel Setup Adapter. */
export type { ChannelSetupAdapter } from "../channels/plugins/types.adapters.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Setup Input. */
export type { ChannelSetupInput } from "../channels/plugins/types.core.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Setup Dm Policy. */
export type { ChannelSetupDmPolicy, ChannelSetupWizard } from "./setup.js";
/** Re-exported API for src/plugin-sdk. */
export {
  DEFAULT_ACCOUNT_ID,
  createTopLevelChannelDmPolicy,
  formatDocsLink,
  setSetupChannelEnabled,
  splitSetupEntries,
} from "./setup.js";

/** Metadata used to advertise an optional channel plugin during setup flows. */
type OptionalChannelSetupParams = {
  channel: string;
  label: string;
  npmSpec?: string;
  docsPath?: string;
};

/** Paired setup adapter + setup wizard for channels that may not be installed yet. */
export type OptionalChannelSetupSurface = {
  setupAdapter: ChannelSetupAdapter;
  setupWizard: ChannelSetupWizard;
};

/** Re-exported API for src/plugin-sdk. */
export {
  createOptionalChannelSetupAdapter,
  createOptionalChannelSetupWizard,
} from "./optional-channel-setup.js";

/** Build both optional setup surfaces from one metadata object. */
export function createOptionalChannelSetupSurface(
  params: OptionalChannelSetupParams,
): OptionalChannelSetupSurface {
  return {
    setupAdapter: createOptionalChannelSetupAdapter(params),
    setupWizard: createOptionalChannelSetupWizard(params),
  };
}
