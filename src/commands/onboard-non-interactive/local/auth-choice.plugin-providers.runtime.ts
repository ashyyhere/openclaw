// Runtime indirection for plugin-provider auth choice discovery, kept mockable in tests.
import { resolveProviderPluginChoice } from "../../../plugins/provider-wizard.js";
import { resolveOwningPluginIdsForProviderRef } from "../../../plugins/providers.js";
import { resolvePluginProviders } from "../../../plugins/providers.runtime.js";

/** Reused constant for auth Choice Plugin Providers Runtime behavior in src/commands/onboard-non-interactive. */
export const authChoicePluginProvidersRuntime = {
  resolveOwningPluginIdsForProviderRef,
  resolveProviderPluginChoice,
  resolvePluginProviders,
};
