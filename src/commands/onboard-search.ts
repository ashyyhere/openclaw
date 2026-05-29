/** Public barrel for search provider onboarding helpers. */
export {
  applySearchKey,
  applySearchProviderSelection,
  hasExistingKey,
  hasKeyInEnv,
  listSearchProviderOptions,
  resolveExistingKey,
  resolveSearchProviderOptions,
  runSearchSetupFlow as setupSearch,
} from "../flows/search-setup.js";
/** Re-exported API for src/commands, starting with Search Provider. */
export type { SearchProvider, SetupSearchOptions } from "../flows/search-setup.js";
