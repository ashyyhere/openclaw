import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Canonical OpenAI API-key provider id. */
export const OPENAI_PROVIDER_ID = "openai";
/** OpenAI provider id backed by Codex/ChatGPT auth. */
export const OPENAI_CODEX_PROVIDER_ID = "openai-codex";

function isOfficialOpenAIBaseUrl(baseUrl: unknown): boolean {
  if (typeof baseUrl !== "string" || !baseUrl.trim()) {
    return true;
  }
  try {
    const url = new URL(baseUrl.trim());
    return (
      url.protocol === "https:" &&
      url.hostname.toLowerCase() === "api.openai.com" &&
      (url.pathname === "" ||
        url.pathname === "/" ||
        url.pathname === "/v1" ||
        url.pathname === "/v1/")
    );
  } catch {
    return false;
  }
}

function openAIProviderUsesCustomBaseUrl(config: OpenClawConfig | undefined): boolean {
  return !isOfficialOpenAIBaseUrl(config?.models?.providers?.openai?.baseUrl);
}

function hasProviderConfig(config: OpenClawConfig | undefined, provider: string): boolean {
  return Boolean(config?.models?.providers?.[provider]);
}

export function isOpenAIProvider(provider: string | undefined): boolean {
  const normalized = normalizeProviderId(provider ?? "");
  return normalized === OPENAI_PROVIDER_ID || normalized === OPENAI_CODEX_PROVIDER_ID;
}

/** Return whether a provider id is the Codex-auth OpenAI provider. */
export function isOpenAICodexProvider(provider: string | undefined): boolean {
  return normalizeProviderId(provider ?? "") === OPENAI_CODEX_PROVIDER_ID;
}

/** Return whether OpenAI should default to Codex runtime/auth for this config. */
export function openAIProviderUsesCodexRuntimeByDefault(params: {
  provider?: string;
  config?: OpenClawConfig;
}): boolean {
  return isOpenAIProvider(params.provider) && !openAIProviderUsesCustomBaseUrl(params.config);
}

/** Parse the provider prefix from a provider/model ref string. */
export function parseModelRefProvider(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const slashIndex = value.trim().indexOf("/");
  if (slashIndex <= 0) {
    return undefined;
  }
  return normalizeProviderId(value.trim().slice(0, slashIndex));
}

/** Return whether a model ref targets the canonical OpenAI provider. */
export function modelRefUsesOpenAIProvider(value: unknown): boolean {
  return parseModelRefProvider(value) === OPENAI_PROVIDER_ID;
}

/** Return whether selecting a model should ensure the Codex plugin is installed. */
export function modelSelectionShouldEnsureCodexPlugin(params: {
  model?: string;
  config?: OpenClawConfig;
}): boolean {
  const provider = parseModelRefProvider(params.model);
  if (provider === OPENAI_CODEX_PROVIDER_ID) {
    return true;
  }
  return provider === OPENAI_PROVIDER_ID && !openAIProviderUsesCustomBaseUrl(params.config);
}

export function listOpenAIAuthProfileProvidersForAgentRuntime(params: {
  provider: string;
  harnessRuntime?: string;
  agentHarnessId?: string;
  config?: OpenClawConfig;
}): string[] {
  if (!isOpenAIProvider(params.provider)) {
    return [params.provider];
  }
  return openAIProviderUsesCodexRuntimeByDefault({
    provider: params.provider,
    config: params.config,
  })
    ? [OPENAI_CODEX_PROVIDER_ID, OPENAI_PROVIDER_ID]
    : [OPENAI_PROVIDER_ID];
}

/** Resolve the provider id used for runtime execution of an OpenAI request. */
export function resolveOpenAIRuntimeProvider(params: {
  provider: string;
  harnessRuntime?: string;
  agentHarnessId?: string;
  authProfileProvider?: string;
  authProfileId?: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
}): string {
  return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}

/** Resolve the provider id displayed for a selected OpenAI model/runtime. */
export function resolveSelectedOpenAIRuntimeProvider(params: {
  provider: string;
  harnessRuntime?: string;
  agentHarnessId?: string;
  authProfileProvider?: string;
  authProfileId?: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
}): string {
  return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}

/** Resolve provider id stored in context config for a runtime selection. */
export function resolveContextConfigProviderForRuntime(params: {
  provider: string;
  runtimeId?: string;
  config?: OpenClawConfig;
}): string {
  if (!isOpenAIProvider(params.provider)) {
    return params.provider;
  }
  if (
    params.runtimeId === "codex" &&
    !hasProviderConfig(params.config, OPENAI_PROVIDER_ID) &&
    hasProviderConfig(params.config, OPENAI_CODEX_PROVIDER_ID)
  ) {
    return OPENAI_CODEX_PROVIDER_ID;
  }
  return OPENAI_PROVIDER_ID;
}
