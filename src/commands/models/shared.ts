// Shared model command helpers for config mutation, model refs, aliases, and display formatting.
import { listAgentIds } from "../../agents/agent-scope.js";
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from "../../agents/defaults.js";
import {
  buildModelAliasIndex,
  legacyModelKey,
  modelKey,
  parseModelRef,
  resolveModelRefFromString,
} from "../../agents/model-selection.js";
import { formatCliCommand } from "../../cli/command-format.js";
import {
  type OpenClawConfig,
  readConfigFileSnapshot,
  replaceConfigFile,
} from "../../config/config.js";
import { formatConfigIssueLines } from "../../config/issue-format.js";
import { normalizeAgentModelRefForConfig, toAgentModelListLike } from "../../config/model-input.js";
import type { AgentModelEntryConfig } from "../../config/types.agent-defaults.js";
import type { AgentModelConfig } from "../../config/types.agents-shared.js";
import { normalizeAgentId } from "../../routing/session-key.js";
import { canonicalizeModelCatalogProviderRef } from "./provider-aliases.js";
/** Alias-name normalizer shared by model add/remove/list commands. */
export { normalizeAlias } from "./alias-name.js";
/** Local URL detector used when displaying provider endpoints. */
export { isLocalBaseUrl } from "./list.local-url.js";

/** Rejects mutually exclusive model command output modes. */
export const ensureFlagCompatibility = (opts: { json?: boolean; plain?: boolean }) => {
  if (opts.json && opts.plain) {
    throw new Error("Choose either --json or --plain, not both.");
  }
};

/** Formats context/token counts for compact CLI tables. */
export const formatTokenK = (value?: number | null) => {
  if (!value || !Number.isFinite(value)) {
    return "-";
  }
  if (value < 1024) {
    return `${Math.round(value)}`;
  }
  return `${Math.round(value / 1024)}k`;
};

/** Formats latency measurements for compact CLI output. */
export const formatMs = (value?: number | null) => {
  if (value === null || value === undefined) {
    return "-";
  }
  if (!Number.isFinite(value)) {
    return "-";
  }
  if (value < 1000) {
    return `${Math.round(value)}ms`;
  }
  return `${Math.round(value / 100) / 10}s`;
};

/** Loads runtime config for model commands and reports authored config validation errors. */
export async function loadValidConfigOrThrow(): Promise<OpenClawConfig> {
  const snapshot = await readConfigFileSnapshot();
  if (!snapshot.valid) {
    const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
    throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
  }
  return snapshot.runtimeConfig ?? snapshot.config;
}

/** Runtime config supplied to model config mutators alongside the editable source config. */
export type UpdateConfigContext = {
  runtimeConfig: OpenClawConfig;
};

/** Applies a model command config mutator and writes the resulting source config. */
export async function updateConfig(
  mutator: (cfg: OpenClawConfig, context: UpdateConfigContext) => OpenClawConfig,
): Promise<OpenClawConfig> {
  const snapshot = await readConfigFileSnapshot();
  if (!snapshot.valid) {
    const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
    throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
  }
  const sourceConfig = structuredClone(snapshot.sourceConfig ?? snapshot.config);
  const runtimeConfig = structuredClone(snapshot.runtimeConfig ?? snapshot.config);
  const next = mutator(sourceConfig, { runtimeConfig });
  await replaceConfigFile({
    nextConfig: next,
    baseHash: snapshot.hash,
  });
  return next;
}

/** Resolves a CLI model reference or alias into a canonical provider/model pair. */
export function resolveModelTarget(params: { raw: string; cfg: OpenClawConfig }): {
  provider: string;
  model: string;
} {
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: DEFAULT_PROVIDER,
  });
  const resolved = resolveModelRefFromString({
    raw: params.raw,
    defaultProvider: DEFAULT_PROVIDER,
    aliasIndex,
  });
  if (!resolved) {
    throw new Error(`Invalid model reference: ${params.raw}`);
  }
  return canonicalizeModelCatalogProviderRef(resolved.ref, { cfg: params.cfg });
}

function resolveAuthoredModelAliasTarget(params: {
  raw: string;
  cfg: OpenClawConfig;
}): { provider: string; model: string } | undefined {
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: DEFAULT_PROVIDER,
  });
  const resolved = resolveModelRefFromString({
    raw: params.raw,
    defaultProvider: DEFAULT_PROVIDER,
    aliasIndex,
  });
  return resolved?.alias ? resolved.ref : undefined;
}

/** Converts model references from config entries into canonical provider/model keys. */
export function resolveModelKeysFromEntries(params: {
  cfg: OpenClawConfig;
  entries: readonly string[];
}): string[] {
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: DEFAULT_PROVIDER,
  });
  return params.entries
    .map((entry) =>
      resolveModelRefFromString({
        raw: entry,
        defaultProvider: DEFAULT_PROVIDER,
        aliasIndex,
      }),
    )
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .map((entry) => modelKey(entry.ref.provider, entry.ref.model));
}

/** Builds the set of model keys currently allowed in default agent model config. */
export function buildAllowlistSet(cfg: OpenClawConfig): Set<string> {
  const allowed = new Set<string>();
  const models = cfg.agents?.defaults?.models ?? {};
  for (const raw of Object.keys(models)) {
    const parsed = parseModelRef(raw, DEFAULT_PROVIDER);
    if (!parsed) {
      continue;
    }
    allowed.add(modelKey(parsed.provider, parsed.model));
  }
  return allowed;
}

/** Normalizes an optional agent id and rejects ids not present in config. */
export function resolveKnownAgentId(params: {
  cfg: OpenClawConfig;
  rawAgentId?: string | null;
}): string | undefined {
  const raw = params.rawAgentId?.trim();
  if (!raw) {
    return undefined;
  }
  const agentId = normalizeAgentId(raw);
  const knownAgents = listAgentIds(params.cfg);
  if (!knownAgents.includes(agentId)) {
    throw new Error(
      `Unknown agent id "${raw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`,
    );
  }
  return agentId;
}

/** Primary/fallback model selector shape stored on agent defaults. */
export type PrimaryFallbackConfig = { primary?: string; fallbacks?: string[] };

/** Ensures a canonical model config entry exists and folds legacy keys into it. */
export function upsertCanonicalModelConfigEntry(
  models: Record<string, AgentModelEntryConfig>,
  params: { provider: string; model: string },
) {
  const key = modelKey(params.provider, params.model);
  const legacyKeys = [
    legacyModelKey(params.provider, params.model),
    `${params.provider}/${key}`,
  ].filter(
    (legacyKey): legacyKey is string =>
      typeof legacyKey === "string" && legacyKey.length > 0 && legacyKey !== key,
  );
  let legacyEntry: AgentModelEntryConfig | undefined;
  for (const legacyKey of legacyKeys) {
    const entry = models[legacyKey];
    if (!entry) {
      continue;
    }
    Object.assign((legacyEntry ??= {}), entry);
    legacyEntry.params = {
      ...legacyEntry.params,
      ...entry.params,
    };
  }

  if (legacyEntry) {
    models[key] = {
      ...legacyEntry,
      ...models[key],
      params: {
        ...legacyEntry.params,
        ...models[key]?.params,
      },
    };
  } else if (!models[key]) {
    models[key] = {};
  }
  for (const legacyKey of legacyKeys) {
    delete models[legacyKey];
  }
  return key;
}

/** Merges primary/fallback patches while normalizing model refs for config storage. */
export function mergePrimaryFallbackConfig(
  existing: PrimaryFallbackConfig | undefined,
  patch: { primary?: string; fallbacks?: string[] },
): PrimaryFallbackConfig {
  const base = existing && typeof existing === "object" ? existing : undefined;
  const next: PrimaryFallbackConfig = { ...base };
  if (patch.primary !== undefined) {
    next.primary = normalizeAgentModelRefForConfig(patch.primary);
  }
  if (patch.fallbacks !== undefined) {
    next.fallbacks = patch.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
  } else if (next.fallbacks !== undefined) {
    next.fallbacks = next.fallbacks.map((fallback) => normalizeAgentModelRefForConfig(fallback));
  }
  return next;
}

/** Updates the default text or image primary model and keeps its catalog entry canonical. */
export function applyDefaultModelPrimaryUpdate(params: {
  cfg: OpenClawConfig;
  resolveCfg?: OpenClawConfig;
  modelRaw: string;
  field: "model" | "imageModel";
}): OpenClawConfig {
  const resolved =
    params.resolveCfg && params.resolveCfg !== params.cfg
      ? (resolveAuthoredModelAliasTarget({
          raw: params.modelRaw,
          cfg: params.cfg,
        }) ??
        resolveModelTarget({
          raw: params.modelRaw,
          cfg: params.resolveCfg,
        }))
      : resolveModelTarget({
          raw: params.modelRaw,
          cfg: params.cfg,
        });
  const nextModels = {
    ...params.cfg.agents?.defaults?.models,
  } as Record<string, AgentModelEntryConfig>;
  const key = upsertCanonicalModelConfigEntry(nextModels, resolved);

  const defaults = params.cfg.agents?.defaults ?? {};
  const existing = toAgentModelListLike(
    (defaults as Record<string, unknown>)[params.field] as AgentModelConfig | undefined,
  );

  return {
    ...params.cfg,
    agents: {
      ...params.cfg.agents,
      defaults: {
        ...defaults,
        [params.field]: mergePrimaryFallbackConfig(existing, { primary: key }),
        models: nextModels,
      },
    },
  };
}

/** Canonical provider/model key builder shared with model command output. */
export { modelKey };
/** Built-in provider/model defaults used by model command resolution. */
export { DEFAULT_MODEL, DEFAULT_PROVIDER };

/**
 * Model key format: "provider/model"
 *
 * The model key is displayed in `/model status` and used to reference models.
 * When using `/model <key>`, use the exact format shown (e.g., "openrouter/moonshotai/kimi-k2").
 *
 * For providers with hierarchical model IDs (e.g., OpenRouter), the model ID may include
 * sub-providers (e.g., "moonshotai/kimi-k2"), resulting in a key like "openrouter/moonshotai/kimi-k2".
 */
