/** Bundled Anthropic Vertex stream facade loader. */
import { loadBundledPluginPublicSurfaceModuleSync } from "../plugin-sdk/facade-runtime.js";
import type { StreamFn } from "./runtime/index.js";

type AnthropicVertexStreamFacade = {
  createAnthropicVertexStreamFn: (
    projectId: string | undefined,
    region: string,
    baseURL?: string,
  ) => StreamFn;
  createAnthropicVertexStreamFnForModel: (
    model: { baseUrl?: string },
    env?: NodeJS.ProcessEnv,
  ) => StreamFn;
};

function loadAnthropicVertexStreamFacade(): AnthropicVertexStreamFacade {
  return loadBundledPluginPublicSurfaceModuleSync<AnthropicVertexStreamFacade>({
    dirName: "anthropic-vertex",
    artifactBasename: "api.js",
  });
}

/** Resolve the Anthropic Vertex stream function for a model/env pair. */
export function createAnthropicVertexStreamFnForModel(
  model: { baseUrl?: string },
  env: NodeJS.ProcessEnv = process.env,
): StreamFn {
  return loadAnthropicVertexStreamFacade().createAnthropicVertexStreamFnForModel(model, env);
}
