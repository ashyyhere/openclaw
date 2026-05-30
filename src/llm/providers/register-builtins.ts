// Registers built-in LLM API providers through lazy stream-module loaders.
import { registerApiProvider, unregisterApiProviders } from "../api-registry.js";
import type {
  Api,
  AssistantMessage,
  AssistantMessageEvent,
  Context,
  Model,
  SimpleStreamOptions,
  StreamFunction,
  StreamOptions,
} from "../types.js";
import { AssistantMessageEventStream } from "../utils/event-stream.js";
import type { AnthropicOptions } from "./anthropic.js";
import type { AzureOpenAIResponsesOptions } from "./azure-openai-responses.js";
import type { GoogleVertexOptions } from "./google-vertex.js";
import type { GoogleOptions } from "./google.js";
import type { MistralOptions } from "./mistral.js";
import type { OpenAICodexResponsesOptions } from "./openai-codex-responses.js";
import type { OpenAICompletionsOptions } from "./openai-completions.js";
import type { OpenAIResponsesOptions } from "./openai-responses.js";

interface LazyProviderModule<
  TApi extends Api,
  TOptions extends StreamOptions,
  TSimpleOptions extends SimpleStreamOptions,
> {
  stream: (
    model: Model<TApi>,
    context: Context,
    options?: TOptions,
  ) => AsyncIterable<AssistantMessageEvent>;
  streamSimple: (
    model: Model<TApi>,
    context: Context,
    options?: TSimpleOptions,
  ) => AsyncIterable<AssistantMessageEvent>;
}

interface AnthropicProviderModule {
  streamAnthropic: StreamFunction<"anthropic-messages", AnthropicOptions>;
  streamSimpleAnthropic: StreamFunction<"anthropic-messages", SimpleStreamOptions>;
}

interface AzureOpenAIResponsesProviderModule {
  streamAzureOpenAIResponses: StreamFunction<"azure-openai-responses", AzureOpenAIResponsesOptions>;
  streamSimpleAzureOpenAIResponses: StreamFunction<"azure-openai-responses", SimpleStreamOptions>;
}

interface GoogleProviderModule {
  streamGoogle: StreamFunction<"google-generative-ai", GoogleOptions>;
  streamSimpleGoogle: StreamFunction<"google-generative-ai", SimpleStreamOptions>;
}

interface GoogleVertexProviderModule {
  streamGoogleVertex: StreamFunction<"google-vertex", GoogleVertexOptions>;
  streamSimpleGoogleVertex: StreamFunction<"google-vertex", SimpleStreamOptions>;
}

interface MistralProviderModule {
  streamMistral: StreamFunction<"mistral-conversations", MistralOptions>;
  streamSimpleMistral: StreamFunction<"mistral-conversations", SimpleStreamOptions>;
}

interface OpenAICodexResponsesProviderModule {
  streamOpenAICodexResponses: StreamFunction<"openai-codex-responses", OpenAICodexResponsesOptions>;
  streamSimpleOpenAICodexResponses: StreamFunction<"openai-codex-responses", SimpleStreamOptions>;
}

interface OpenAICompletionsProviderModule {
  streamOpenAICompletions: StreamFunction<"openai-completions", OpenAICompletionsOptions>;
  streamSimpleOpenAICompletions: StreamFunction<"openai-completions", SimpleStreamOptions>;
}

interface OpenAIResponsesProviderModule {
  streamOpenAIResponses: StreamFunction<"openai-responses", OpenAIResponsesOptions>;
  streamSimpleOpenAIResponses: StreamFunction<"openai-responses", SimpleStreamOptions>;
}

/** Registry source id used to replace all core built-in provider registrations as one group. */
export const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";

let anthropicProviderModulePromise:
  | Promise<LazyProviderModule<"anthropic-messages", AnthropicOptions, SimpleStreamOptions>>
  | undefined;
let azureOpenAIResponsesProviderModulePromise:
  | Promise<
      LazyProviderModule<"azure-openai-responses", AzureOpenAIResponsesOptions, SimpleStreamOptions>
    >
  | undefined;
let googleProviderModulePromise:
  | Promise<LazyProviderModule<"google-generative-ai", GoogleOptions, SimpleStreamOptions>>
  | undefined;
let googleVertexProviderModulePromise:
  | Promise<LazyProviderModule<"google-vertex", GoogleVertexOptions, SimpleStreamOptions>>
  | undefined;
let mistralProviderModulePromise:
  | Promise<LazyProviderModule<"mistral-conversations", MistralOptions, SimpleStreamOptions>>
  | undefined;
let openAICodexResponsesProviderModulePromise:
  | Promise<
      LazyProviderModule<"openai-codex-responses", OpenAICodexResponsesOptions, SimpleStreamOptions>
    >
  | undefined;
let openAICompletionsProviderModulePromise:
  | Promise<LazyProviderModule<"openai-completions", OpenAICompletionsOptions, SimpleStreamOptions>>
  | undefined;
let openAIResponsesProviderModulePromise:
  | Promise<LazyProviderModule<"openai-responses", OpenAIResponsesOptions, SimpleStreamOptions>>
  | undefined;

function forwardStream(
  target: AssistantMessageEventStream,
  source: AsyncIterable<AssistantMessageEvent>,
): void {
  void (async () => {
    for await (const event of source) {
      target.push(event);
    }
    target.end();
  })();
}

function createLazyLoadErrorMessage<TApi extends Api>(
  model: Model<TApi>,
  error: unknown,
): AssistantMessage {
  return {
    role: "assistant",
    content: [],
    api: model.api,
    provider: model.provider,
    model: model.id,
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp: Date.now(),
  };
}

function createLazyStream<
  TApi extends Api,
  TOptions extends StreamOptions,
  TSimpleOptions extends SimpleStreamOptions,
>(
  loadModule: () => Promise<LazyProviderModule<TApi, TOptions, TSimpleOptions>>,
): StreamFunction<TApi, TOptions> {
  return (model, context, options) => {
    const outer = new AssistantMessageEventStream();

    loadModule()
      .then((module) => {
        const inner = module.stream(model, context, options);
        forwardStream(outer, inner);
      })
      .catch((error) => {
        const message = createLazyLoadErrorMessage(model, error);
        outer.push({ type: "error", reason: "error", error: message });
        outer.end(message);
      });

    return outer;
  };
}

function createLazySimpleStream<
  TApi extends Api,
  TOptions extends StreamOptions,
  TSimpleOptions extends SimpleStreamOptions,
>(
  loadModule: () => Promise<LazyProviderModule<TApi, TOptions, TSimpleOptions>>,
): StreamFunction<TApi, TSimpleOptions> {
  return (model, context, options) => {
    const outer = new AssistantMessageEventStream();

    loadModule()
      .then((module) => {
        const inner = module.streamSimple(model, context, options);
        forwardStream(outer, inner);
      })
      .catch((error) => {
        const message = createLazyLoadErrorMessage(model, error);
        outer.push({ type: "error", reason: "error", error: message });
        outer.end(message);
      });

    return outer;
  };
}

function loadAnthropicProviderModule(): Promise<
  LazyProviderModule<"anthropic-messages", AnthropicOptions, SimpleStreamOptions>
> {
  anthropicProviderModulePromise ||= import("./anthropic.js").then((module) => {
    const provider = module as AnthropicProviderModule;
    return {
      stream: provider.streamAnthropic,
      streamSimple: provider.streamSimpleAnthropic,
    };
  });
  return anthropicProviderModulePromise;
}

function loadAzureOpenAIResponsesProviderModule(): Promise<
  LazyProviderModule<"azure-openai-responses", AzureOpenAIResponsesOptions, SimpleStreamOptions>
> {
  azureOpenAIResponsesProviderModulePromise ||= import("./azure-openai-responses.js").then(
    (module) => {
      const provider = module as AzureOpenAIResponsesProviderModule;
      return {
        stream: provider.streamAzureOpenAIResponses,
        streamSimple: provider.streamSimpleAzureOpenAIResponses,
      };
    },
  );
  return azureOpenAIResponsesProviderModulePromise;
}

function loadGoogleProviderModule(): Promise<
  LazyProviderModule<"google-generative-ai", GoogleOptions, SimpleStreamOptions>
> {
  googleProviderModulePromise ||= import("./google.js").then((module) => {
    const provider = module as GoogleProviderModule;
    return {
      stream: provider.streamGoogle,
      streamSimple: provider.streamSimpleGoogle,
    };
  });
  return googleProviderModulePromise;
}

function loadGoogleVertexProviderModule(): Promise<
  LazyProviderModule<"google-vertex", GoogleVertexOptions, SimpleStreamOptions>
> {
  googleVertexProviderModulePromise ||= import("./google-vertex.js").then((module) => {
    const provider = module as GoogleVertexProviderModule;
    return {
      stream: provider.streamGoogleVertex,
      streamSimple: provider.streamSimpleGoogleVertex,
    };
  });
  return googleVertexProviderModulePromise;
}

function loadMistralProviderModule(): Promise<
  LazyProviderModule<"mistral-conversations", MistralOptions, SimpleStreamOptions>
> {
  mistralProviderModulePromise ||= import("./mistral.js").then((module) => {
    const provider = module as MistralProviderModule;
    return {
      stream: provider.streamMistral,
      streamSimple: provider.streamSimpleMistral,
    };
  });
  return mistralProviderModulePromise;
}

function loadOpenAICodexResponsesProviderModule(): Promise<
  LazyProviderModule<"openai-codex-responses", OpenAICodexResponsesOptions, SimpleStreamOptions>
> {
  openAICodexResponsesProviderModulePromise ||= import("./openai-codex-responses.js").then(
    (module) => {
      const provider = module as OpenAICodexResponsesProviderModule;
      return {
        stream: provider.streamOpenAICodexResponses,
        streamSimple: provider.streamSimpleOpenAICodexResponses,
      };
    },
  );
  return openAICodexResponsesProviderModulePromise;
}

function loadOpenAICompletionsProviderModule(): Promise<
  LazyProviderModule<"openai-completions", OpenAICompletionsOptions, SimpleStreamOptions>
> {
  openAICompletionsProviderModulePromise ||= import("./openai-completions.js").then((module) => {
    const provider = module as OpenAICompletionsProviderModule;
    return {
      stream: provider.streamOpenAICompletions,
      streamSimple: provider.streamSimpleOpenAICompletions,
    };
  });
  return openAICompletionsProviderModulePromise;
}

function loadOpenAIResponsesProviderModule(): Promise<
  LazyProviderModule<"openai-responses", OpenAIResponsesOptions, SimpleStreamOptions>
> {
  openAIResponsesProviderModulePromise ||= import("./openai-responses.js").then((module) => {
    const provider = module as OpenAIResponsesProviderModule;
    return {
      stream: provider.streamOpenAIResponses,
      streamSimple: provider.streamSimpleOpenAIResponses,
    };
  });
  return openAIResponsesProviderModulePromise;
}

/** Lazy Anthropic Messages stream entrypoint. */
export const streamAnthropic = createLazyStream(loadAnthropicProviderModule);
/** Lazy Anthropic Messages simple-stream entrypoint. */
export const streamSimpleAnthropic = createLazySimpleStream(loadAnthropicProviderModule);
/** Lazy Azure OpenAI Responses stream entrypoint. */
export const streamAzureOpenAIResponses = createLazyStream(loadAzureOpenAIResponsesProviderModule);
/** Lazy Azure OpenAI Responses simple-stream entrypoint. */
export const streamSimpleAzureOpenAIResponses = createLazySimpleStream(
  loadAzureOpenAIResponsesProviderModule,
);
/** Lazy Google Generative AI stream entrypoint. */
export const streamGoogle = createLazyStream(loadGoogleProviderModule);
/** Lazy Google Generative AI simple-stream entrypoint. */
export const streamSimpleGoogle = createLazySimpleStream(loadGoogleProviderModule);
/** Lazy Google Vertex stream entrypoint. */
export const streamGoogleVertex = createLazyStream(loadGoogleVertexProviderModule);
/** Lazy Google Vertex simple-stream entrypoint. */
export const streamSimpleGoogleVertex = createLazySimpleStream(loadGoogleVertexProviderModule);
/** Lazy Mistral Conversations stream entrypoint. */
export const streamMistral = createLazyStream(loadMistralProviderModule);
/** Lazy Mistral Conversations simple-stream entrypoint. */
export const streamSimpleMistral = createLazySimpleStream(loadMistralProviderModule);
/** Lazy OpenAI Codex Responses stream entrypoint. */
export const streamOpenAICodexResponses = createLazyStream(loadOpenAICodexResponsesProviderModule);
/** Lazy OpenAI Codex Responses simple-stream entrypoint. */
export const streamSimpleOpenAICodexResponses = createLazySimpleStream(
  loadOpenAICodexResponsesProviderModule,
);
/** Lazy OpenAI Chat Completions stream entrypoint. */
export const streamOpenAICompletions = createLazyStream(loadOpenAICompletionsProviderModule);
/** Lazy OpenAI Chat Completions simple-stream entrypoint. */
export const streamSimpleOpenAICompletions = createLazySimpleStream(
  loadOpenAICompletionsProviderModule,
);
/** Lazy OpenAI Responses stream entrypoint. */
export const streamOpenAIResponses = createLazyStream(loadOpenAIResponsesProviderModule);
/** Lazy OpenAI Responses simple-stream entrypoint. */
export const streamSimpleOpenAIResponses = createLazySimpleStream(
  loadOpenAIResponsesProviderModule,
);

/** Register all core API provider stream implementations in the global API registry. */
export function registerBuiltInApiProviders(): void {
  registerApiProvider(
    {
      api: "anthropic-messages",
      stream: streamAnthropic,
      streamSimple: streamSimpleAnthropic,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );

  registerApiProvider(
    {
      api: "openai-completions",
      stream: streamOpenAICompletions,
      streamSimple: streamSimpleOpenAICompletions,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );

  registerApiProvider(
    {
      api: "mistral-conversations",
      stream: streamMistral,
      streamSimple: streamSimpleMistral,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );

  registerApiProvider(
    {
      api: "openai-responses",
      stream: streamOpenAIResponses,
      streamSimple: streamSimpleOpenAIResponses,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );

  registerApiProvider(
    {
      api: "azure-openai-responses",
      stream: streamAzureOpenAIResponses,
      streamSimple: streamSimpleAzureOpenAIResponses,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );

  registerApiProvider(
    {
      api: "openai-codex-responses",
      stream: streamOpenAICodexResponses,
      streamSimple: streamSimpleOpenAICodexResponses,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );

  registerApiProvider(
    {
      api: "google-generative-ai",
      stream: streamGoogle,
      streamSimple: streamSimpleGoogle,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );

  registerApiProvider(
    {
      api: "google-vertex",
      stream: streamGoogleVertex,
      streamSimple: streamSimpleGoogleVertex,
    },
    BUILT_IN_API_PROVIDER_SOURCE_ID,
  );
}

/** Replace the built-in provider registrations with a freshly registered set. */
export function resetApiProviders(): void {
  unregisterApiProviders(BUILT_IN_API_PROVIDER_SOURCE_ID);
  registerBuiltInApiProviders();
}
