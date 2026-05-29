// plugins/capability-runtime-vitest-shims config runtime helpers and runtime behavior.
import { resolveActiveTalkProviderConfig } from "../../config/talk.js";
import type { OpenClawConfig } from "../../config/types.js";

/** Re-exported API for src/plugins/capability-runtime-vitest-shims, starting with resolve Active Talk Provider Config. */
export { resolveActiveTalkProviderConfig };

/** Reused helper for get Runtime Config Snapshot behavior in src/plugins/capability-runtime-vitest-shims. */
export function getRuntimeConfigSnapshot(): OpenClawConfig | null {
  return null;
}
