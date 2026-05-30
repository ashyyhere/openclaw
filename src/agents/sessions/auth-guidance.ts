/** User-facing auth guidance strings for missing provider credentials. */
import { join } from "node:path";
import { getDocsPath } from "../config.js";

const UNKNOWN_PROVIDER = "unknown";

/** Build the shared login/help text shown when provider credentials are missing. */
export function getProviderLoginHelp(): string {
  return [
    "Use /login to log into a provider via OAuth or API key. See:",
    `  ${join(getDocsPath(), "providers.md")}`,
    `  ${join(getDocsPath(), "models.md")}`,
  ].join("\n");
}

/** Format the no-models error with provider login guidance. */
export function formatNoModelsAvailableMessage(): string {
  return `No models available. ${getProviderLoginHelp()}`;
}

/** Format the no-selection error with login and /model next-step guidance. */
export function formatNoModelSelectedMessage(): string {
  return `No model selected.\n\n${getProviderLoginHelp()}\n\nThen use /model to select a model.`;
}

/** Format the missing API key error for a provider or selected model. */
export function formatNoApiKeyFoundMessage(provider: string): string {
  const providerDisplay = provider === UNKNOWN_PROVIDER ? "the selected model" : provider;
  return `No API key found for ${providerDisplay}.\n\n${getProviderLoginHelp()}`;
}
