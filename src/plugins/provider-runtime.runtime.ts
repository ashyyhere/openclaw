// Runtime boundary for plugins provider runtime runtime behavior.
import { createLazyImportLoader } from "../shared/lazy-promise.js";

type ProviderRuntimeModule = typeof import("./provider-runtime.js");

type AugmentModelCatalogWithProviderPlugins =
  ProviderRuntimeModule["augmentModelCatalogWithProviderPlugins"];
type BuildProviderAuthDoctorHintWithPlugin =
  ProviderRuntimeModule["buildProviderAuthDoctorHintWithPlugin"];
type BuildProviderMissingAuthMessageWithPlugin =
  ProviderRuntimeModule["buildProviderMissingAuthMessageWithPlugin"];
type FormatProviderAuthProfileApiKeyWithPlugin =
  ProviderRuntimeModule["formatProviderAuthProfileApiKeyWithPlugin"];
type PrepareProviderRuntimeAuth = ProviderRuntimeModule["prepareProviderRuntimeAuth"];
type RefreshProviderOAuthCredentialWithPlugin =
  ProviderRuntimeModule["refreshProviderOAuthCredentialWithPlugin"];

const providerRuntimeLoader = createLazyImportLoader<ProviderRuntimeModule>(
  () => import("./provider-runtime.js"),
);

async function loadProviderRuntime(): Promise<ProviderRuntimeModule> {
  // Keep the heavy provider runtime behind an actual async boundary so callers
  // can import this wrapper eagerly without collapsing the lazy chunk.
  return await providerRuntimeLoader.load();
}

/** Reused helper for augment Model Catalog With Provider Plugins behavior in src/plugins. */
export async function augmentModelCatalogWithProviderPlugins(
  ...args: Parameters<AugmentModelCatalogWithProviderPlugins>
): Promise<Awaited<ReturnType<AugmentModelCatalogWithProviderPlugins>>> {
  const runtime = await loadProviderRuntime();
  return runtime.augmentModelCatalogWithProviderPlugins(...args);
}

/** Reused helper for build Provider Auth Doctor Hint With Plugin behavior in src/plugins. */
export async function buildProviderAuthDoctorHintWithPlugin(
  ...args: Parameters<BuildProviderAuthDoctorHintWithPlugin>
): Promise<Awaited<ReturnType<BuildProviderAuthDoctorHintWithPlugin>>> {
  const runtime = await loadProviderRuntime();
  return runtime.buildProviderAuthDoctorHintWithPlugin(...args);
}

/** Reused helper for build Provider Missing Auth Message With Plugin behavior in src/plugins. */
export async function buildProviderMissingAuthMessageWithPlugin(
  ...args: Parameters<BuildProviderMissingAuthMessageWithPlugin>
): Promise<Awaited<ReturnType<BuildProviderMissingAuthMessageWithPlugin>>> {
  const runtime = await loadProviderRuntime();
  return runtime.buildProviderMissingAuthMessageWithPlugin(...args);
}

/** Reused helper for format Provider Auth Profile Api Key With Plugin behavior in src/plugins. */
export async function formatProviderAuthProfileApiKeyWithPlugin(
  ...args: Parameters<FormatProviderAuthProfileApiKeyWithPlugin>
): Promise<Awaited<ReturnType<FormatProviderAuthProfileApiKeyWithPlugin>>> {
  const runtime = await loadProviderRuntime();
  return runtime.formatProviderAuthProfileApiKeyWithPlugin(...args);
}

/** Reused helper for prepare Provider Runtime Auth behavior in src/plugins. */
export async function prepareProviderRuntimeAuth(
  ...args: Parameters<PrepareProviderRuntimeAuth>
): Promise<Awaited<ReturnType<PrepareProviderRuntimeAuth>>> {
  const runtime = await loadProviderRuntime();
  return runtime.prepareProviderRuntimeAuth(...args);
}

/** Reused helper for refresh Provider OAuth Credential With Plugin behavior in src/plugins. */
export async function refreshProviderOAuthCredentialWithPlugin(
  ...args: Parameters<RefreshProviderOAuthCredentialWithPlugin>
): Promise<Awaited<ReturnType<RefreshProviderOAuthCredentialWithPlugin>>> {
  const runtime = await loadProviderRuntime();
  return runtime.refreshProviderOAuthCredentialWithPlugin(...args);
}
