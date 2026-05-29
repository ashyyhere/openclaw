// extensions/ollama/src model behavior helpers and runtime behavior.
import { isOllamaCloudKimiModelRef } from "./sanitizers/kimi-inline-reasoning.js";

export function shouldWrapOllamaCompatMoonshotThinking(modelId: string): boolean {
  return isOllamaCloudKimiModelRef(modelId);
}
