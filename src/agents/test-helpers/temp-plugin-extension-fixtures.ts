/** Temporary plugin registry fixtures for extension tests. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { clearPluginLoaderCache } from "../../plugins/loader.js";
import { createEmptyPluginRegistry } from "../../plugins/registry.js";
import { setActivePluginRegistry } from "../../plugins/runtime.js";

const EMPTY_PLUGIN_SCHEMA = { type: "object", additionalProperties: false, properties: {} };

/** Creates a temporary plugin directory. */
export function createTempPluginDir(
  tempDirs: string[],
  prefix: string,
  options?: { parentDir?: string },
): string {
  const parentDir = options?.parentDir ?? os.tmpdir();
  fs.mkdirSync(parentDir, { recursive: true });
  const dir = fs.mkdtempSync(path.join(parentDir, prefix));
  tempDirs.push(dir);
  return dir;
}

/** Writes a temporary plugin manifest and optional entry file. */
export function writeTempPlugin(params: {
  dir: string;
  id: string;
  body: string;
  manifest?: Record<string, unknown>;
  filename?: string;
}): string {
  const pluginDir = path.join(params.dir, params.id);
  fs.mkdirSync(pluginDir, { recursive: true });
  const file = path.join(pluginDir, params.filename ?? `${params.id}.mjs`);
  fs.writeFileSync(file, params.body, "utf-8");
  fs.writeFileSync(
    path.join(pluginDir, "openclaw.plugin.json"),
    JSON.stringify(
      {
        id: params.id,
        ...params.manifest,
        configSchema: EMPTY_PLUGIN_SCHEMA,
      },
      null,
      2,
    ),
    "utf-8",
  );
  return file;
}

/** Cleans temporary plugin directories and restores registry state. */
export function cleanupTempPluginTestEnvironment(
  tempDirs: string[],
  originalBundledPluginsDir: string | undefined,
  originalDisableBundledPlugins?: string,
) {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  clearPluginLoaderCache();
  setActivePluginRegistry(createEmptyPluginRegistry());
  if (originalBundledPluginsDir === undefined) {
    delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
  } else {
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = originalBundledPluginsDir;
  }
  if (originalDisableBundledPlugins === undefined) {
    delete process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;
  } else {
    process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS = originalDisableBundledPlugins;
  }
}

/** Resets active plugin registry state for tests. */
export function resetActivePluginRegistryForTest() {
  setActivePluginRegistry(createEmptyPluginRegistry());
}
