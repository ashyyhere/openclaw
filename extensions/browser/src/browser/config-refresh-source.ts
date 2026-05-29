// extensions/browser/src/browser config refresh source helpers and runtime behavior.
import {
  getRuntimeConfig,
  getRuntimeConfigSourceSnapshot,
  type OpenClawConfig,
} from "../config/config.js";

export function loadBrowserConfigForRuntimeRefresh(): OpenClawConfig {
  return getRuntimeConfigSourceSnapshot() ?? getRuntimeConfig();
}
