// extensions/anthropic-vertex api helpers and runtime behavior.
import type { StreamFn } from "openclaw/plugin-sdk/agent-core";
import type { AnthropicVertexStreamDeps } from "./stream-runtime.js";

/** Re-exported anthropic-vertex plugin public API. */
export {
  ANTHROPIC_VERTEX_DEFAULT_MODEL_ID,
  buildAnthropicVertexProvider,
} from "./provider-catalog.js";
/** Re-exported anthropic-vertex plugin public API. */
export {
  hasAnthropicVertexAvailableAuth,
  hasAnthropicVertexCredentials,
  resolveAnthropicVertexClientRegion,
  resolveAnthropicVertexConfigApiKey,
  resolveAnthropicVertexProjectId,
  resolveAnthropicVertexRegion,
  resolveAnthropicVertexRegionFromBaseUrl,
} from "./region.js";
import { buildAnthropicVertexProvider } from "./provider-catalog.js";
import { hasAnthropicVertexAvailableAuth } from "./region.js";

let streamRuntimeModulePromise: Promise<typeof import("./stream-runtime.js")> | null = null;

const loadStreamRuntimeModule = async () => {
  streamRuntimeModulePromise ??= import("./stream-runtime.js");
  return await streamRuntimeModulePromise;
};

export function mergeImplicitAnthropicVertexProvider(params: {
  existing?: ReturnType<typeof buildAnthropicVertexProvider>;
  implicit: ReturnType<typeof buildAnthropicVertexProvider>;
}) {
  const { existing, implicit } = params;
  if (!existing) {
    return implicit;
  }
  return {
    ...implicit,
    ...existing,
    models:
      Array.isArray(existing.models) && existing.models.length > 0
        ? existing.models
        : implicit.models,
  };
}

/** Public anthropic-vertex plugin helper for resolve Implicit Anthropic Vertex Provider behavior. */
export function resolveImplicitAnthropicVertexProvider(params?: { env?: NodeJS.ProcessEnv }) {
  const env = params?.env ?? process.env;
  if (!hasAnthropicVertexAvailableAuth(env)) {
    return null;
  }

  return buildAnthropicVertexProvider({ env });
}

/** Public anthropic-vertex plugin helper for create Anthropic Vertex Stream Fn behavior. */
export function createAnthropicVertexStreamFn(
  projectId: string | undefined,
  region: string,
  baseURL?: string,
  deps?: AnthropicVertexStreamDeps,
): StreamFn {
  const streamFnPromise = loadStreamRuntimeModule().then((runtime) =>
    runtime.createAnthropicVertexStreamFn(projectId, region, baseURL, deps),
  );
  return async (model, context, options) => {
    const streamFn = await streamFnPromise;
    return streamFn(model, context, options);
  };
}

/** Public anthropic-vertex plugin helper for create Anthropic Vertex Stream Fn For Model behavior. */
export function createAnthropicVertexStreamFnForModel(
  model: { baseUrl?: string },
  env: NodeJS.ProcessEnv = process.env,
  deps?: AnthropicVertexStreamDeps,
): StreamFn {
  const streamFnPromise = loadStreamRuntimeModule().then((runtime) =>
    runtime.createAnthropicVertexStreamFnForModel(model, env, deps),
  );
  return async (...args) => {
    const streamFn = await streamFnPromise;
    return streamFn(...args);
  };
}
