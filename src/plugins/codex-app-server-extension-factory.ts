// plugins codex app server extension factory helpers and runtime behavior.
import { getActivePluginRegistry } from "./runtime.js";

/** Reused constant for CODEX APP SERVER EXTENSION RUNTIME ID behavior in src/plugins. */
export const CODEX_APP_SERVER_EXTENSION_RUNTIME_ID = "codex-app-server";

/** Reused helper for list Codex App Server Extension Factories behavior in src/plugins. */
export function listCodexAppServerExtensionFactories() {
  return (
    getActivePluginRegistry()?.codexAppServerExtensionFactories?.map((entry) => entry.factory) ?? []
  );
}
