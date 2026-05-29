// plugins web provider types helpers and runtime behavior.
import type { TSchema } from "typebox";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type {
  RuntimeWebFetchMetadata,
  RuntimeWebSearchMetadata,
} from "../secrets/runtime-web-tools.types.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { SecretInputMode } from "./provider-auth-types.js";

/** Shared type for Web Search Provider Id in src/plugins. */
export type WebSearchProviderId = string;
/** Shared type for Web Fetch Provider Id in src/plugins. */
export type WebFetchProviderId = string;

/** Shared type for Web Search Provider Tool Definition in src/plugins. */
export type WebSearchProviderToolDefinition = {
  description: string;
  parameters: TSchema;
  execute: (
    args: Record<string, unknown>,
    context?: WebSearchProviderToolExecutionContext,
  ) => Promise<Record<string, unknown>>;
};

/** Shared type for Web Fetch Provider Tool Definition in src/plugins. */
export type WebFetchProviderToolDefinition = {
  description: string;
  parameters: TSchema;
  execute: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

/** Shared type for Web Search Provider Context in src/plugins. */
export type WebSearchProviderContext = {
  config?: OpenClawConfig;
  searchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebSearchMetadata;
  agentDir?: string;
};

/** Shared type for Web Search Provider Tool Execution Context in src/plugins. */
export type WebSearchProviderToolExecutionContext = {
  signal?: AbortSignal;
};

/** Shared type for Web Fetch Provider Context in src/plugins. */
export type WebFetchProviderContext = {
  config?: OpenClawConfig;
  fetchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebFetchMetadata;
};

/** Shared type for Web Search Credential Resolution Source in src/plugins. */
export type WebSearchCredentialResolutionSource = "config" | "secretRef" | "env" | "missing";

/** Shared type for Web Search Provider Configured Credential Fallback in src/plugins. */
export type WebSearchProviderConfiguredCredentialFallback = {
  path: string;
  value: unknown;
};

/** Shared type for Web Fetch Provider Configured Credential Fallback in src/plugins. */
export type WebFetchProviderConfiguredCredentialFallback = {
  path: string;
  value: unknown;
};

/** Shared type for Web Search Runtime Metadata Context in src/plugins. */
export type WebSearchRuntimeMetadataContext = {
  config?: OpenClawConfig;
  searchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebSearchMetadata;
  resolvedCredential?: {
    value?: string;
    source: WebSearchCredentialResolutionSource;
    fallbackEnvVar?: string;
  };
};

/** Shared type for Web Search Provider Setup Context in src/plugins. */
export type WebSearchProviderSetupContext = {
  config: OpenClawConfig;
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  quickstartDefaults?: boolean;
  secretInputMode?: SecretInputMode;
};

/** Shared type for Web Fetch Credential Resolution Source in src/plugins. */
export type WebFetchCredentialResolutionSource = "config" | "secretRef" | "env" | "missing";

/** Shared type for Web Fetch Runtime Metadata Context in src/plugins. */
export type WebFetchRuntimeMetadataContext = {
  config?: OpenClawConfig;
  fetchConfig?: Record<string, unknown>;
  runtimeMetadata?: RuntimeWebFetchMetadata;
  resolvedCredential?: {
    value?: string;
    source: WebFetchCredentialResolutionSource;
    fallbackEnvVar?: string;
  };
};

/** Shared type for Web Search Provider Plugin in src/plugins. */
export type WebSearchProviderPlugin = {
  id: WebSearchProviderId;
  label: string;
  hint: string;
  onboardingScopes?: readonly "text-inference"[];
  requiresCredential?: boolean;
  credentialLabel?: string;
  envVars: string[];
  /** Optional model-provider auth profile id that can satisfy this web provider without a tool-specific API key. */
  authProviderId?: string;
  placeholder: string;
  signupUrl: string;
  docsUrl?: string;
  /** Optional note shown before credential collection for provider-specific prerequisites. */
  credentialNote?: string;
  autoDetectOrder?: number;
  credentialPath: string;
  inactiveSecretPaths?: string[];
  getCredentialValue: (searchConfig?: Record<string, unknown>) => unknown;
  setCredentialValue: (searchConfigTarget: Record<string, unknown>, value: unknown) => void;
  getConfiguredCredentialValue?: (config?: OpenClawConfig) => unknown;
  setConfiguredCredentialValue?: (configTarget: OpenClawConfig, value: unknown) => void;
  getConfiguredCredentialFallback?: (
    config?: OpenClawConfig,
  ) => WebSearchProviderConfiguredCredentialFallback | undefined;
  applySelectionConfig?: (config: OpenClawConfig) => OpenClawConfig;
  runSetup?: (ctx: WebSearchProviderSetupContext) => OpenClawConfig | Promise<OpenClawConfig>;
  resolveRuntimeMetadata?: (
    ctx: WebSearchRuntimeMetadataContext,
  ) => Partial<RuntimeWebSearchMetadata> | Promise<Partial<RuntimeWebSearchMetadata>>;
  createTool: (ctx: WebSearchProviderContext) => WebSearchProviderToolDefinition | null;
};

/** Shared type for Plugin Web Search Provider Entry in src/plugins. */
export type PluginWebSearchProviderEntry = WebSearchProviderPlugin & {
  pluginId: string;
};

/** Shared type for Web Fetch Provider Plugin in src/plugins. */
export type WebFetchProviderPlugin = {
  id: WebFetchProviderId;
  label: string;
  hint: string;
  requiresCredential?: boolean;
  credentialLabel?: string;
  envVars: string[];
  placeholder: string;
  signupUrl: string;
  docsUrl?: string;
  autoDetectOrder?: number;
  credentialPath: string;
  inactiveSecretPaths?: string[];
  getCredentialValue: (fetchConfig?: Record<string, unknown>) => unknown;
  setCredentialValue: (fetchConfigTarget: Record<string, unknown>, value: unknown) => void;
  getConfiguredCredentialValue?: (config?: OpenClawConfig) => unknown;
  setConfiguredCredentialValue?: (configTarget: OpenClawConfig, value: unknown) => void;
  getConfiguredCredentialFallback?: (
    config?: OpenClawConfig,
  ) => WebFetchProviderConfiguredCredentialFallback | undefined;
  applySelectionConfig?: (config: OpenClawConfig) => OpenClawConfig;
  resolveRuntimeMetadata?: (
    ctx: WebFetchRuntimeMetadataContext,
  ) => Partial<RuntimeWebFetchMetadata> | Promise<Partial<RuntimeWebFetchMetadata>>;
  createTool: (ctx: WebFetchProviderContext) => WebFetchProviderToolDefinition | null;
};

/** Shared type for Plugin Web Fetch Provider Entry in src/plugins. */
export type PluginWebFetchProviderEntry = WebFetchProviderPlugin & {
  pluginId: string;
};
