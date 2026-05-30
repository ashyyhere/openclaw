// Barrel for the OpenClaw-owned installable provider index.
/** Re-export provider index loader. */
export { loadOpenClawProviderIndex } from "./load.js";
/** Re-export provider index normalizer. */
export { normalizeOpenClawProviderIndex } from "./normalize.js";
/** Re-export provider index data contracts. */
export type {
  OpenClawProviderIndex,
  OpenClawProviderIndexPluginInstall,
  OpenClawProviderIndexPlugin,
  OpenClawProviderIndexProviderAuthChoice,
  OpenClawProviderIndexProvider,
} from "./types.js";
