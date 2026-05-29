// ui/src/ui chat model test helpers helpers and runtime behavior.
import type {
  GatewaySessionRow,
  ModelCatalogEntry,
  SessionsListResult,
  SessionsPatchResult,
} from "./types.ts";

/** Reused constant for OPENAI GPT5 MODEL behavior in ui/src/ui. */
export const OPENAI_GPT5_MODEL: ModelCatalogEntry = {
  id: "gpt-5",
  name: "GPT-5",
  provider: "openai",
};

/** Reused constant for OPENAI GPT5 MINI MODEL behavior in ui/src/ui. */
export const OPENAI_GPT5_MINI_MODEL: ModelCatalogEntry = {
  id: "gpt-5-mini",
  name: "GPT-5 Mini",
  provider: "openai",
};

/** Reused constant for DEEPSEEK CHAT MODEL behavior in ui/src/ui. */
export const DEEPSEEK_CHAT_MODEL: ModelCatalogEntry = {
  id: "deepseek-chat",
  name: "DeepSeek Chat",
  provider: "deepseek",
};

/** Reused constant for DEFAULT CHAT MODEL CATALOG behavior in ui/src/ui. */
export const DEFAULT_CHAT_MODEL_CATALOG = [
  OPENAI_GPT5_MODEL,
  OPENAI_GPT5_MINI_MODEL,
] satisfies ModelCatalogEntry[];

/** Reused helper for create Model Catalog behavior in ui/src/ui. */
export function createModelCatalog(...entries: ModelCatalogEntry[]): ModelCatalogEntry[] {
  return [...entries];
}

/** Reused helper for create Ambiguous Model Catalog behavior in ui/src/ui. */
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

/** Reused helper for create Main Session Row behavior in ui/src/ui. */
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

/** Reused helper for create Sessions List Result behavior in ui/src/ui. */
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

/** Reused helper for create Resolved Model Patch behavior in ui/src/ui. */
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
