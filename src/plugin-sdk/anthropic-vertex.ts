/** Public SDK facade for Anthropic Vertex provider helpers owned by the bundled plugin. */
import type { ModelProviderConfig } from "../config/types.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";

type FacadeModule = {
  resolveAnthropicVertexClientRegion: (params?: {
    baseUrl?: string;
    env?: NodeJS.ProcessEnv;
  }) => string;
  resolveAnthropicVertexProjectId: (env?: NodeJS.ProcessEnv) => string | undefined;
  buildAnthropicVertexProvider: (params?: { env?: NodeJS.ProcessEnv }) => ModelProviderConfig;
  resolveImplicitAnthropicVertexProvider: (params?: {
    env?: NodeJS.ProcessEnv;
  }) => ModelProviderConfig | null;
  mergeImplicitAnthropicVertexProvider: (params: {
    existing?: ModelProviderConfig;
    implicit: ModelProviderConfig;
  }) => ModelProviderConfig;
};

function loadFacadeModule(): FacadeModule {
  // Keep the SDK subpath light at startup; the provider implementation loads only when callers
  // actually ask for Anthropic Vertex helpers.
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "anthropic-vertex",
    artifactBasename: "api.js",
  });
}

/** Resolve the Anthropic Vertex client region through the bundled plugin facade. */
export const resolveAnthropicVertexClientRegion: FacadeModule["resolveAnthropicVertexClientRegion"] =
  ((...args) =>
    loadFacadeModule().resolveAnthropicVertexClientRegion(
      ...args,
    )) as FacadeModule["resolveAnthropicVertexClientRegion"];

/** Resolve the Anthropic Vertex project id through the bundled plugin facade. */
export const resolveAnthropicVertexProjectId: FacadeModule["resolveAnthropicVertexProjectId"] = ((
  ...args
) =>
  loadFacadeModule().resolveAnthropicVertexProjectId(
    ...args,
  )) as FacadeModule["resolveAnthropicVertexProjectId"];
