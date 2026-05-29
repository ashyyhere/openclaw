// Runtime boundary for plugins provider auth choice runtime behavior.
import {
  resolveProviderPluginChoice as resolveProviderPluginChoiceImpl,
  runProviderModelSelectedHook as runProviderModelSelectedHookImpl,
} from "./provider-wizard.js";
import { resolvePluginProviders as resolvePluginProvidersImpl } from "./providers.runtime.js";
import { resolvePluginSetupProvider as resolvePluginSetupProviderImpl } from "./setup-registry.js";

type ResolveProviderPluginChoice =
  typeof import("./provider-wizard.js").resolveProviderPluginChoice;
type RunProviderModelSelectedHook =
  typeof import("./provider-wizard.js").runProviderModelSelectedHook;
type ResolvePluginProviders = typeof import("./providers.runtime.js").resolvePluginProviders;
type ResolvePluginSetupProvider = typeof import("./setup-registry.js").resolvePluginSetupProvider;

/** Reused helper for resolve Provider Plugin Choice behavior in src/plugins. */
export function resolveProviderPluginChoice(
  ...args: Parameters<ResolveProviderPluginChoice>
): ReturnType<ResolveProviderPluginChoice> {
  return resolveProviderPluginChoiceImpl(...args);
}

/** Reused helper for run Provider Model Selected Hook behavior in src/plugins. */
export function runProviderModelSelectedHook(
  ...args: Parameters<RunProviderModelSelectedHook>
): ReturnType<RunProviderModelSelectedHook> {
  return runProviderModelSelectedHookImpl(...args);
}

/** Reused helper for resolve Plugin Providers behavior in src/plugins. */
export function resolvePluginProviders(
  ...args: Parameters<ResolvePluginProviders>
): ReturnType<ResolvePluginProviders> {
  return resolvePluginProvidersImpl(...args);
}

/** Reused helper for resolve Plugin Setup Provider behavior in src/plugins. */
export function resolvePluginSetupProvider(
  ...args: Parameters<ResolvePluginSetupProvider>
): ReturnType<ResolvePluginSetupProvider> {
  return resolvePluginSetupProviderImpl(...args);
}
