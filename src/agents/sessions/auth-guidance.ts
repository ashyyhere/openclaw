/** User-facing auth guidance strings for missing provider credentials. */
import { join } from "node:path";
import { getDocsPath } from "../config.js";

const UNKNOWN_PROVIDER = "unknown";

/** Reused helper for get Provider Login Help behavior in src/agents/sessions. */
export function getProviderLoginHelp(): string {
  return [
    "Use /login to log into a provider via OAuth or API key. See:",
    `  ${join(getDocsPath(), "providers.md")}`,
    `  ${join(getDocsPath(), "models.md")}`,
  ].join("\n");
}

/** Reused helper for format No Models Available Message behavior in src/agents/sessions. */
export function formatNoModelsAvailableMessage(): string {
  return `No models available. ${getProviderLoginHelp()}`;
}

/** Reused helper for format No Model Selected Message behavior in src/agents/sessions. */
export function formatNoModelSelectedMessage(): string {
  return `No model selected.\n\n${getProviderLoginHelp()}\n\nThen use /model to select a model.`;
}

/** Reused helper for format No Api Key Found Message behavior in src/agents/sessions. */
export function formatNoApiKeyFoundMessage(provider: string): string {
  const providerDisplay = provider === UNKNOWN_PROVIDER ? "the selected model" : provider;
  return `No API key found for ${providerDisplay}.\n\n${getProviderLoginHelp()}`;
}
