// Test fixtures for plugin loader suites. Helpers create isolated temp plugins,
// disable bundled plugin discovery, and reset loader/runtime globals between tests.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resetDiagnosticEventsForTest } from "../infra/diagnostic-events.js";
import { withEnv } from "../test-utils/env.js";
import { clearPluginLoaderCache, loadOpenClawPlugins } from "./loader.js";
import { resetPluginRuntimeStateForTest } from "./runtime.js";

/** Paths and id for a generated temporary plugin fixture. */
export type TempPlugin = { dir: string; file: string; id: string };
/** Config shape accepted by `loadOpenClawPlugins` in tests. */
export type PluginLoadConfig = NonNullable<Parameters<typeof loadOpenClawPlugins>[0]>["config"];
/** Registry shape returned by `loadOpenClawPlugins` in tests. */
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

/** Creates a fixture directory and relaxes permissions for cross-user test access. */
export function mkdirSafe(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
  chmodSafeDir(dir);
}

const fixtureRoot = mkdtempSafe(path.join(os.tmpdir(), "openclaw-plugin-"));
let tempDirIndex = 0;
const prevBundledDir = process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
const prevDisableBundledPlugins = process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS;

/** Minimal config schema used by generated plugin manifests. */
export const EMPTY_PLUGIN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {},
};

/** Returns inline CJS source for channel plugin entry fixtures. */
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

/** Creates a unique directory under the shared loader fixture root. */
export function makeTempDir() {
  const dir = path.join(fixtureRoot, `case-${tempDirIndex++}`);
  mkdirSafe(dir);
  return dir;
}

/** Writes a plugin source file plus `openclaw.plugin.json` manifest. */
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

/** Disables bundled plugin discovery for tests that need isolated fixtures. */
export function useNoBundledPlugins() {
  process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS = "1";
  delete process.env.OPENCLAW_BUNDLED_PLUGINS_DIR;
}

/** Builds and loads one workspace-scoped bundled-plugin fixture. */
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

/** Resets loader/runtime globals and restores bundled-plugin env flags. */
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

/** Removes shared fixture files and restores bundled-plugin disablement env. */
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
