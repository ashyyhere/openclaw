// extensions/brave test api helpers and runtime behavior.
import {
  mapBraveLlmContextResults,
  normalizeBraveCountry,
  normalizeBraveLanguageParams,
  resolveBraveMode,
} from "./src/brave-web-search-provider.shared.js";

export const testing = {
  normalizeBraveCountry,
  normalizeBraveLanguageParams,
  resolveBraveMode,
  mapBraveLlmContextResults,
} as const;
export { testing as __testing };
