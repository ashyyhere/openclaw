// plugins legacy npm declaration helpers and runtime behavior.
import path from "node:path";
import { tryReadJsonSync } from "../infra/json-files.js";
import { parseRegistryNpmSpec } from "../infra/npm-registry-spec.js";
import { isRecord } from "../shared/record-coerce.js";
import { validatePluginId } from "./install-paths.js";

/** Reused constant for LEGACY NPM DECLARATION FILE behavior in src/plugins. */
export const LEGACY_NPM_DECLARATION_FILE = "openclaw.extension.json";

/** Shared type for Legacy Npm Plugin Declaration in src/plugins. */
export type LegacyNpmPluginDeclaration = {
  pluginId: string;
  npmSpec: string;
  source: string;
};

/** Reused helper for read Legacy Npm Plugin Declaration behavior in src/plugins. */
export function readLegacyNpmPluginDeclaration(
  pluginDir: string,
): LegacyNpmPluginDeclaration | null {
  const source = path.join(pluginDir, LEGACY_NPM_DECLARATION_FILE);
  const parsed = tryReadJsonSync(source);
  if (!isRecord(parsed) || parsed.type !== "npm") {
    return null;
  }
  const pluginId = typeof parsed.name === "string" ? parsed.name.trim() : "";
  const npmSpec = typeof parsed.npmSpec === "string" ? parsed.npmSpec.trim() : "";
  if (!pluginId || validatePluginId(pluginId) || !parseRegistryNpmSpec(npmSpec)) {
    return null;
  }
  return { pluginId, npmSpec, source };
}
