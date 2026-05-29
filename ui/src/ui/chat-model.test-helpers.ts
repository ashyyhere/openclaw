// Test fixtures for Control UI model/session tests. These helpers build small
// gateway-shaped payloads so tests can exercise model-selection behavior without
// duplicating full session responses.
import type {
  GatewaySessionRow,
  ModelCatalogEntry,
  SessionsListResult,
  SessionsPatchResult,
} from "./types.ts";

/** Canonical OpenAI GPT-5 catalog entry used in model-selection tests. */
export const OPENAI_GPT5_MODEL: ModelCatalogEntry = {
  id: "gpt-5",
  name: "GPT-5",
  provider: "openai",
};

/** Canonical OpenAI GPT-5 Mini catalog entry used in model-selection tests. */
export const OPENAI_GPT5_MINI_MODEL: ModelCatalogEntry = {
  id: "gpt-5-mini",
  name: "GPT-5 Mini",
  provider: "openai",
};

/** DeepSeek catalog entry used to prove provider disambiguation. */
export const DEEPSEEK_CHAT_MODEL: ModelCatalogEntry = {
  id: "deepseek-chat",
  name: "DeepSeek Chat",
  provider: "deepseek",
};

/** Default compact catalog used by chat model tests. */
export const DEFAULT_CHAT_MODEL_CATALOG = [
  OPENAI_GPT5_MODEL,
  OPENAI_GPT5_MINI_MODEL,
] satisfies ModelCatalogEntry[];

/** Clone catalog entries into a mutable test catalog. */
export function createModelCatalog(...entries: ModelCatalogEntry[]): ModelCatalogEntry[] {
  return [...entries];
}

/** Build duplicate model ids across providers for ambiguity tests. */
export function createAmbiguousModelCatalog(
  id: string,
  ...providers: string[]
): ModelCatalogEntry[] {
  return providers.map((provider) => ({
    id,
    name: id,
    provider,
  }));
}

/** Build a minimal main-session row with caller overrides. */
export function createMainSessionRow(
  overrides: Partial<GatewaySessionRow> = {},
): GatewaySessionRow {
  return {
    key: "main",
    kind: "direct",
    updatedAt: null,
    ...overrides,
  };
}

/** Build a minimal sessions-list response for model/default resolution tests. */
export function createSessionsListResult(
  params: {
    model?: string | null;
    modelProvider?: string | null;
    defaultsModel?: string | null;
    defaultsProvider?: string | null;
    defaultsThinkingLevels?: SessionsListResult["defaults"]["thinkingLevels"];
    defaultsThinkingOptions?: string[];
    defaultsThinkingDefault?: string;
    thinkingDefault?: string;
    omitSessionFromList?: boolean;
  } = {},
): SessionsListResult {
  const {
    model = null,
    modelProvider = model ? "openai" : null,
    defaultsModel = "gpt-5",
    defaultsProvider = defaultsModel ? "openai" : null,
    defaultsThinkingLevels,
    defaultsThinkingOptions,
    defaultsThinkingDefault,
    thinkingDefault,
    omitSessionFromList = false,
  } = params;

  return {
    ts: 0,
    path: "",
    count: omitSessionFromList ? 0 : 1,
    defaults: {
      modelProvider: defaultsProvider,
      model: defaultsModel,
      contextTokens: null,
      ...(defaultsThinkingLevels ? { thinkingLevels: defaultsThinkingLevels } : {}),
      ...(defaultsThinkingOptions ? { thinkingOptions: defaultsThinkingOptions } : {}),
      ...(defaultsThinkingDefault ? { thinkingDefault: defaultsThinkingDefault } : {}),
    },
    sessions: omitSessionFromList
      ? []
      : [
          createMainSessionRow({
            ...(modelProvider ? { modelProvider } : {}),
            ...(model ? { model } : {}),
            ...(thinkingDefault ? { thinkingDefault } : {}),
          }),
        ],
  };
}

/** Build a successful model patch response with resolved provider/model fields. */
export function createResolvedModelPatch(
  model: string,
  modelProvider?: string | null,
): SessionsPatchResult {
  return {
    ok: true,
    path: "",
    key: "main",
    entry: {
      sessionId: "main",
    },
    resolved: {
      model,
      modelProvider: modelProvider ?? undefined,
    },
  };
}
