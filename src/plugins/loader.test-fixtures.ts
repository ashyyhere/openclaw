// plugins loader test fixtures helpers and runtime behavior.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resetDiagnosticEventsForTest } from "../infra/diagnostic-events.js";
import { withEnv } from "../test-utils/env.js";
import { clearPluginLoaderCache, loadOpenClawPlugins } from "./loader.js";
import { resetPluginRuntimeStateForTest } from "./runtime.js";

/** Shared type for Temp Plugin in src/plugins. */
export type TempPlugin = { dir: string; file: string; id: string };
/** Shared type for Plugin Load Config in src/plugins. */
export type PluginLoadConfig = NonNullable<Parameters<typeof loadOpenClawPlugins>[0]>["config"];
/** Shared type for Plugin Registry in src/plugins. */
export type PluginRegistry = ReturnType<typeof loadOpenClawPlugins>;

function chmodSafeDir(dir: string) {
  if (process.platform === "win32") {
    return;
  }
  fs.chmodSync(dir, 0o755);
}

function mkdtempSafe(prefix: string) {
  const dir = fs.mkdtempSync(prefix);
  chmodSafeDir(dir);
  return dir;
}

/** Reused helper for mkdir Safe behavior in src/plugins. */
export function mkdirSafe(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
  chmodSafeDir(dir);
}

const fixtureRoot = mkdtempSafe(path.join(os.tmpdir(), "openclaw-plugin-"));
let tempDirIndex = 0;
const prevBundledDir = process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
const prevDisableBundledPlugins = process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;

/** Reused constant for EMPTY PLUGIN SCHEMA behavior in src/plugins. */
export const EMPTY_PLUGIN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {},
};

/** Reused helper for inline Channel Plugin Entry Factory Source behavior in src/plugins. */
export function inlineChannelPluginEntryFactorySource(): string {
  return `function defineChannelPluginEntry(options) {
  return {
    id: options.id,
    name: options.name,
    description: options.description,
    configSchema: { schema: { type: "object" } },
    channelPlugin: options.plugin,
    setChannelRuntime: options.setRuntime,
    register(api) {
      if (api.registrationMode === "cli-metadata") {
        options.registerCliMetadata?.(api);
        return;
      }
      api.registerChannel({ plugin: options.plugin });
      options.setRuntime?.(api.runtime);
      if (api.registrationMode === "discovery") {
        options.registerCliMetadata?.(api);
        return;
      }
      if (api.registrationMode !== "full") {
        return;
      }
      options.registerCliMetadata?.(api);
      options.registerFull?.(api);
    },
  };
}
`;
}

/** Reused helper for make Temp Dir behavior in src/plugins. */
export function makeTempDir() {
  const dir = path.join(fixtureRoot, `case-${tempDirIndex++}`);
  mkdirSafe(dir);
  return dir;
}

/** Reused helper for write Plugin behavior in src/plugins. */
export function writePlugin(params: {
  id: string;
  body: string;
  dir?: string;
  filename?: string;
  configSchema?: Record<string, unknown>;
}): TempPlugin {
  const dir = params.dir ?? makeTempDir();
  const filename = params.filename ?? `${params.id}.cjs`;
  mkdirSafe(dir);
  const file = path.join(dir, filename);
  fs.writeFileSync(file, params.body, "utf-8");
  fs.writeFileSync(
    path.join(dir, "openclaw.plugin.json"),
    JSON.stringify(
      {
        id: params.id,
        configSchema: params.configSchema ?? EMPTY_PLUGIN_SCHEMA,
      },
      null,
      2,
    ),
    "utf-8",
  );
  return { dir, file, id: params.id };
}

/** Reused helper for use No Bundled Plugins behavior in src/plugins. */
export function useNoBundledPlugins() {
  process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS = "1";
  delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
}

/** Reused helper for load Bundle Fixture behavior in src/plugins. */
export function loadBundleFixture(params: {
  pluginId: string;
  build: (bundleRoot: string) => void;
  env?: NodeJS.ProcessEnv;
  onlyPluginIds?: string[];
}) {
  useNoBundledPlugins();
  const workspaceDir = makeTempDir();
  const stateDir = makeTempDir();
  const bundleRoot = path.join(workspaceDir, ".openclaw", "extensions", params.pluginId);
  params.build(bundleRoot);
  return withEnv({ OPENCLAW_STATE_DIR: stateDir, ...params.env }, () =>
    loadOpenClawPlugins({
      workspaceDir,
      onlyPluginIds: params.onlyPluginIds ?? [params.pluginId],
      config: {
        plugins: {
          entries: {
            [params.pluginId]: {
              enabled: true,
            },
          },
        },
      },
      cache: false,
    }),
  );
}

/** Reused helper for reset Plugin Loader Test State For Test behavior in src/plugins. */
export function resetPluginLoaderTestStateForTest() {
  clearPluginLoaderCache();
  resetPluginRuntimeStateForTest();
  resetDiagnosticEventsForTest();
  if (prevBundledDir === undefined) {
    delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
  } else {
    process.env.OPENCLAW_BUNDLED_PLUGINS_DIR = prevBundledDir;
  }
  if (prevDisableBundledPlugins === undefined) {
    delete process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;
  } else {
    process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS = prevDisableBundledPlugins;
  }
}

/** Reused helper for cleanup Plugin Loader Fixtures For Test behavior in src/plugins. */
export function cleanupPluginLoaderFixturesForTest() {
  try {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  } catch {
    // ignore cleanup failures in tests
  }
  if (prevDisableBundledPlugins === undefined) {
    delete process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;
  } else {
    process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS = prevDisableBundledPlugins;
  }
}
