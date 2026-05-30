// Public auth/onboarding helpers for provider plugins.

import path from "node:path";
import { resolveDefaultAgentDir } from "../agents/agent-scope-config.js";
import { externalCliDiscoveryForProviderAuth } from "../agents/auth-profiles/external-cli-discovery.js";
import { resolveApiKeyForProfile } from "../agents/auth-profiles/oauth.js";
import { resolveAuthProfileOrder } from "../agents/auth-profiles/order.js";
import { listProfilesForProvider } from "../agents/auth-profiles/profiles.js";
import {
  ensureAuthProfileStore,
  loadAuthProfileStoreForSecretsRuntime,
  loadAuthProfileStoreWithoutExternalProfiles,
} from "../agents/auth-profiles/store.js";
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { AuthProfileCredential } from "../agents/auth-profiles/types.js";
import {
  COPILOT_INTEGRATION_ID,
  buildCopilotIdeHeaders,
} from "../agents/copilot-dynamic-headers.js";
import { resolveEnvApiKey } from "../agents/model-auth-env.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveStateDir } from "../config/paths.js";
import { loadJsonFile, saveJsonFile } from "../infra/json-file.js";
import {
  asDateTimestampMs,
  resolveExpiresAtMsFromEpochSeconds,
  parseStrictNonNegativeInteger,
} from "../shared/number-coercion.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import { resolveProviderEndpoint } from "./provider-model-shared.js";

/** OpenClaw config type used by provider auth helpers. */
export type { OpenClawConfig } from "../config/config.js";
/** Secret input type accepted by provider auth config. */
export type { SecretInput } from "../config/types.secrets.js";
/** Secret input mode selected during provider setup. */
export type { SecretInputMode } from "../plugins/provider-auth-types.js";
/** Provider auth result returned by auth methods. */
export type { ProviderAuthResult } from "../plugins/types.js";
/** Provider auth context passed to plugin auth methods. */
export type { ProviderAuthContext } from "../plugins/types.js";
/** Auth profile store and OAuth credential types exposed to provider plugins. */
export type { AuthProfileStore, OAuthCredential } from "../agents/auth-profiles/types.js";

/** Built-in CLI auth profile ids exposed for provider auth integrations. */
export { CLAUDE_CLI_PROFILE_ID, CODEX_CLI_PROFILE_ID } from "../agents/auth-profiles/constants.js";
/** Auth profile store helpers for loading and locked updates. */
export {
  ensureAuthProfileStore,
  ensureAuthProfileStoreForLocalUpdate,
  updateAuthProfileStoreWithLock,
} from "../agents/auth-profiles/store.js";
/** Auth profile list/upsert/remove helpers for provider setup flows. */
export {
  listProfilesForProvider,
  removeProviderAuthProfilesWithLock,
  upsertAuthProfile,
  upsertAuthProfileWithLock,
} from "../agents/auth-profiles/profiles.js";
/** Resolves provider API keys from supported environment variables. */
export { resolveEnvApiKey } from "../agents/model-auth-env.js";
/** Cached external CLI credential readers for provider auth integrations. */
export {
  readClaudeCliCredentialsCached,
  readCodexCliCredentialsCached,
} from "../agents/cli-credentials.js";
/** Suggests OAuth profile ids for repairing legacy default auth state. */
export { suggestOAuthProfileIdForLegacyDefault } from "../agents/auth-profiles/repair.js";
/** API key marker helpers used to distinguish env, OAuth, and local auth sentinels. */
export {
  CUSTOM_LOCAL_AUTH_MARKER,
  MINIMAX_OAUTH_MARKER,
  isKnownEnvApiKeyMarker,
  isNonSecretApiKeyMarker,
  resolveOAuthApiKeyMarker,
  resolveNonEnvSecretRefApiKeyMarker,
} from "../agents/model-auth-markers.js";
/** API key input preview, normalization, and validation helpers. */
export {
  formatApiKeyPreview,
  normalizeApiKeyInput,
  validateApiKeyInput,
} from "../plugins/provider-auth-input.js";
/** Prompt/env helpers for collecting API keys during provider setup. */
export {
  ensureApiKeyFromEnvOrPrompt,
  ensureApiKeyFromOptionEnvOrPrompt,
  normalizeSecretInputModeInput,
  promptSecretRefForSetup,
  resolveSecretInputModeForEnvSelection,
} from "../plugins/provider-auth-input.js";
/** Normalizes API key config into the canonical SecretInput shape. */
export { normalizeApiKeyConfig } from "../agents/models-config.providers.secrets.js";
/** Token profile id and Anthropic setup-token validation helpers. */
export {
  buildTokenProfileId,
  validateAnthropicSetupToken,
} from "../plugins/provider-auth-token.js";
/** Provider auth profile mutation and credential persistence helpers. */
export {
  applyAuthProfileConfig,
  buildApiKeyCredential,
  upsertApiKeyProfile,
  writeOAuthCredentials,
  type ApiKeyStorageOptions,
  type WriteOAuthCredentialsOptions,
} from "../plugins/provider-auth-helpers.js";
/** Creates a provider auth method backed by API key setup/resolution. */
export { createProviderApiKeyAuthMethod } from "../plugins/provider-api-key-auth.js";
/** SecretRef coercion and configured SecretInput checks. */
export { coerceSecretRef, hasConfiguredSecretInput } from "../config/types.secrets.js";
/** Resolves the default provider alias for a SecretRef source. */
export { resolveDefaultSecretProviderAlias } from "../secrets/ref-contract.js";
/** Resolves the required home directory for provider auth files. */
export { resolveRequiredHomeDir } from "../infra/home-dir.js";
/** Resolves the OpenClaw agent directory through the SDK compatibility seam. */
export { resolveOpenClawAgentDir } from "./agent-dir-compat.js";
/** Optional/required SecretInput normalizers used by provider setup. */
export {
  normalizeOptionalSecretInput,
  normalizeSecretInput,
} from "../utils/normalize-secret-input.js";
/** Provider environment variable helpers for auth-sensitive env filtering. */
export {
  listKnownProviderAuthEnvVarNames,
  omitEnvKeysCaseInsensitive,
} from "../secrets/provider-env-vars.js";
/** Builds provider auth results from OAuth profile state. */
export { buildOauthProviderAuthResult } from "./provider-auth-result.js";
/** PKCE and form-url-encoding helpers for OAuth provider flows. */
export {
  buildOpenAICodexCredentialExtra,
  decodeOpenAICodexJwtPayload,
  resolveOpenAICodexAccessTokenExpiry,
  resolveOpenAICodexAuthIdentity,
  resolveOpenAICodexImportProfileName,
  type OpenAICodexAuthIdentity,
} from "./provider-openai-codex-auth.js";
export {
  generateHexPkceVerifierChallenge,
  generatePkceVerifierChallenge,
  toFormUrlEncoded,
} from "./oauth-utils.js";
/** OAuth credential freshness helpers and refresh margin constants. */
export {
  DEFAULT_OAUTH_REFRESH_MARGIN_MS,
  hasUsableOAuthCredential,
} from "../agents/auth-profiles/credential-state.js";
/** GitHub Copilot dynamic header constants and builder. */
export {
  COPILOT_EDITOR_PLUGIN_VERSION,
  COPILOT_EDITOR_VERSION,
  COPILOT_GITHUB_API_VERSION,
  COPILOT_INTEGRATION_ID,
  COPILOT_USER_AGENT,
  buildCopilotIdeHeaders,
} from "../agents/copilot-dynamic-headers.js";

const COPILOT_TOKEN_URL = "https://api.github.com/copilot_internal/v2/token";

/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
export const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";

/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
export type CachedCopilotToken = {
  token: string;
  expiresAt: number;
  updatedAt: number;
  integrationId?: string;
};

function resolveCopilotTokenCachePath(env: NodeJS.ProcessEnv = process.env) {
  return path.join(resolveStateDir(env), "credentials", "github-copilot.token.json");
}

function isCopilotTokenUsable(cache: CachedCopilotToken, now = Date.now()): boolean {
  const expiresAt = asDateTimestampMs(cache.expiresAt);
  return (
    cache.integrationId === COPILOT_INTEGRATION_ID &&
    expiresAt !== undefined &&
    expiresAt - now > 5 * 60 * 1000
  );
}

function resolveCopilotTokenExpiresAtMs(expiresAt: unknown): number | undefined {
  const parsed =
    typeof expiresAt === "number" && Number.isFinite(expiresAt)
      ? expiresAt
      : typeof expiresAt === "string" && expiresAt.trim().length > 0
        ? parseStrictNonNegativeInteger(expiresAt)
        : undefined;
  if (parsed === undefined) {
    return undefined;
  }
  return parsed < 100_000_000_000
    ? resolveExpiresAtMsFromEpochSeconds(parsed)
    : asDateTimestampMs(parsed);
}

function parseCopilotTokenResponse(value: unknown): {
  token: string;
  expiresAt: number;
} {
  if (!value || typeof value !== "object") {
    throw new Error("Unexpected response from GitHub Copilot token endpoint");
  }
  const asRecord = value as Record<string, unknown>;
  const token = asRecord.token;
  const expiresAt = asRecord.expires_at;
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("Copilot token response missing token");
  }

  const expiresAtMs = resolveCopilotTokenExpiresAtMs(expiresAt);
  if (
    expiresAt === undefined ||
    expiresAt === null ||
    (typeof expiresAt === "string" && expiresAt.trim().length === 0)
  ) {
    throw new Error("Copilot token response missing expires_at");
  }
  if (expiresAtMs === undefined) {
    throw new Error("Copilot token response has invalid expires_at");
  }

  return { token, expiresAt: expiresAtMs };
}

function resolveCopilotProxyHost(proxyEp: string): string | null {
  const trimmed = proxyEp.trim();
  if (!trimmed) {
    return null;
  }

  const urlText = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(urlText);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return normalizeLowercaseStringOrEmpty(url.hostname);
  } catch {
    return null;
  }
}

/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
export function deriveCopilotApiBaseUrlFromToken(token: string): string | null {
  const trimmed = token.trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(/(?:^|;)\s*proxy-ep=([^;\s]+)/i);
  const proxyEp = match?.[1]?.trim();
  if (!proxyEp) {
    return null;
  }

  const proxyHost = resolveCopilotProxyHost(proxyEp);
  if (!proxyHost) {
    return null;
  }
  const host = proxyHost.replace(/^proxy\./i, "api.");

  const baseUrl = `https://${host}`;
  return resolveProviderEndpoint(baseUrl).endpointClass === "invalid" ? null : baseUrl;
}

/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
export async function resolveCopilotApiToken(params: {
  githubToken: string;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
  cachePath?: string;
  loadJsonFileImpl?: (path: string) => unknown;
  saveJsonFileImpl?: (path: string, value: CachedCopilotToken) => void;
}): Promise<{
  token: string;
  expiresAt: number;
  source: string;
  baseUrl: string;
}> {
  const env = params.env ?? process.env;
  const cachePath = params.cachePath?.trim() || resolveCopilotTokenCachePath(env);
  const loadJsonFileFn = params.loadJsonFileImpl ?? loadJsonFile;
  const saveJsonFileFn = params.saveJsonFileImpl ?? saveJsonFile;
  const cached = loadJsonFileFn(cachePath) as CachedCopilotToken | undefined;
  if (cached && typeof cached.token === "string" && typeof cached.expiresAt === "number") {
    if (isCopilotTokenUsable(cached)) {
      return {
        token: cached.token,
        expiresAt: cached.expiresAt,
        source: `cache:${cachePath}`,
        baseUrl: deriveCopilotApiBaseUrlFromToken(cached.token) ?? DEFAULT_COPILOT_API_BASE_URL,
      };
    }
  }

  const fetchImpl = params.fetchImpl ?? fetch;
  const res = await fetchImpl(COPILOT_TOKEN_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${params.githubToken}`,
      "Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
      ...buildCopilotIdeHeaders({ includeApiVersion: true }),
    },
  });

  if (!res.ok) {
    throw new Error(`Copilot token exchange failed: HTTP ${res.status}`);
  }

  const json = parseCopilotTokenResponse(await res.json());
  const payload: CachedCopilotToken = {
    token: json.token,
    expiresAt: json.expiresAt,
    updatedAt: Date.now(),
    integrationId: COPILOT_INTEGRATION_ID,
  };
  saveJsonFileFn(cachePath, payload);

  return {
    token: payload.token,
    expiresAt: payload.expiresAt,
    source: `fetched:${COPILOT_TOKEN_URL}`,
    baseUrl: deriveCopilotApiBaseUrlFromToken(payload.token) ?? DEFAULT_COPILOT_API_BASE_URL,
  };
}

/** Reports whether a provider has env or profile-backed API key auth configured. */
export function isProviderApiKeyConfigured(params: {
  provider: string;
  agentDir?: string;
  profileTypes?: readonly AuthProfileCredential["type"][];
}): boolean {
  if (resolveEnvApiKey(params.provider)?.apiKey) {
    return true;
  }
  const agentDir = params.agentDir?.trim();
  if (!agentDir) {
    return false;
  }
  const store = ensureAuthProfileStore(agentDir, {
    allowKeychainPrompt: false,
  });
  const profileIds = listProfilesForProvider(store, params.provider);
  if (!params.profileTypes?.length) {
    return profileIds.length > 0;
  }
  const allowedTypes = new Set(params.profileTypes);
  return profileIds.some((profileId) => {
    const type = store.profiles[profileId]?.type;
    return type !== undefined && allowedTypes.has(type);
  });
}

/** Lists usable auth profile ids for a provider, optionally including external CLI auth. */
export function listUsableProviderAuthProfileIds(params: {
  provider: string;
  cfg?: OpenClawConfig;
  agentDir?: string;
  allowKeychainPrompt?: boolean;
  includeExternalCliAuth?: boolean;
}): { agentDir: string; profileIds: string[] } {
  try {
    const { agentDir, profileIds } = resolveUsableProviderAuthProfiles(params);
    return { agentDir, profileIds };
  } catch {
    return { agentDir: "", profileIds: [] };
  }
}

/** Reports whether any usable auth profile is configured for a provider. */
export function isProviderAuthProfileConfigured(params: {
  provider: string;
  cfg?: OpenClawConfig;
  agentDir?: string;
  allowKeychainPrompt?: boolean;
  includeExternalCliAuth?: boolean;
}): boolean {
  return listUsableProviderAuthProfileIds(params).profileIds.length > 0;
}

/** Resolves the first usable provider auth profile API key. */
export async function resolveProviderAuthProfileApiKey(params: {
  provider: string;
  cfg?: OpenClawConfig;
  agentDir?: string;
  allowKeychainPrompt?: boolean;
  includeExternalCliAuth?: boolean;
}): Promise<string | undefined> {
  const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles(params);
  if (!agentDir || profileIds.length === 0) {
    return undefined;
  }
  for (const profileId of profileIds) {
    const resolved = await resolveApiKeyForProfile({
      cfg: params.cfg,
      store,
      agentDir,
      profileId,
    });
    if (resolved?.apiKey) {
      return resolved.apiKey;
    }
  }
  return undefined;
}

function resolveUsableProviderAuthProfiles(params: {
  provider: string;
  cfg?: OpenClawConfig;
  agentDir?: string;
  allowKeychainPrompt?: boolean;
  includeExternalCliAuth?: boolean;
}): { agentDir: string; profileIds: string[]; store: AuthProfileStore } {
  const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.cfg ?? {});
  const externalCli = params.includeExternalCliAuth
    ? externalCliDiscoveryForProviderAuth({
        cfg: params.cfg,
        provider: params.provider,
        allowKeychainPrompt: params.allowKeychainPrompt,
      })
    : undefined;
  const store = externalCli
    ? loadAuthProfileStoreForSecretsRuntime(agentDir, { externalCli })
    : loadAuthProfileStoreForSecretsRuntime(agentDir);
  const profileIds = resolveAuthProfileOrder({
    cfg: params.cfg,
    store,
    provider: params.provider,
  });
  if (profileIds.length > 0) {
    return { agentDir, profileIds, store };
  }

  const fallbackStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir, {
    allowKeychainPrompt: params.allowKeychainPrompt ?? false,
    resolveLegacyOAuthSidecars: true,
  });
  return {
    agentDir,
    profileIds: resolveAuthProfileOrder({
      cfg: params.cfg,
      store: fallbackStore,
      provider: params.provider,
    }),
    store: fallbackStore,
  };
}
