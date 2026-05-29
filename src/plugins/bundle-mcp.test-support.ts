// plugins bundle mcp test support helpers and runtime behavior.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { captureEnv } from "../test-utils/env.js";

/** Reused helper for create Bundle Mcp Temp Harness behavior in src/plugins. */
export function createBundleMcpTempHarness() {
  const tempDirs: string[] = [];

  return {
    async createTempDir(prefix: string): Promise<string> {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
      tempDirs.push(dir);
      return dir;
    },
    async cleanup() {
      await Promise.all(
        tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })),
      );
    },
  };
}

function resolveBundlePluginRoot(homeDir: string, pluginId: string) {
  return path.join(homeDir, ".openclaw", "extensions", pluginId);
}

/** Reused helper for write Claude Bundle Manifest behavior in src/plugins. */
export async function writeClaudeBundleManifest(params: {
  homeDir: string;
  pluginId: string;
  manifest: Record<string, unknown>;
}) {
  const pluginRoot = resolveBundlePluginRoot(params.homeDir, params.pluginId);
  await fs.mkdir(path.join(pluginRoot, ".claude-plugin"), { recursive: true });
  await fs.writeFile(
    path.join(pluginRoot, ".claude-plugin", "plugin.json"),
    `${JSON.stringify(params.manifest, null, 2)}\n`,
    "utf-8",
  );
  return pluginRoot;
}

/** Reused helper for create Enabled Plugin Entries behavior in src/plugins. */
export function createEnabledPluginEntries(pluginIds: readonly string[]) {
  return Object.fromEntries(pluginIds.map((pluginId) => [pluginId, { enabled: true }]));
}

/** Reused helper for create Bundle Probe Plugin behavior in src/plugins. */
export async function createBundleProbePlugin(homeDir: string) {
  const pluginRoot = resolveBundlePluginRoot(homeDir, "bundle-probe");
  const serverPath = path.join(pluginRoot, "servers", "probe.mjs");
  await fs.mkdir(path.dirname(serverPath), { recursive: true });
  await fs.writeFile(serverPath, "export {};\n", "utf-8");
  await writeClaudeBundleManifest({
    homeDir,
    pluginId: "bundle-probe",
    manifest: { name: "bundle-probe" },
  });
  await fs.writeFile(
    path.join(pluginRoot, ".mcp.json"),
    `${JSON.stringify(
      {
        mcpServers: {
          bundleProbe: {
            command: "node",
            args: ["./servers/probe.mjs"],
          },
        },
      },
      null,
      2,
    )}\n`,
    "utf-8",
  );
  return { pluginRoot, serverPath };
}

/** Reused helper for with Bundle Home Env behavior in src/plugins. */
export async function withBundleHomeEnv<T>(
  tempHarness: { createTempDir: (prefix: string) => Promise<string> },
  prefix: string,
  run: (params: { homeDir: string; workspaceDir: string }) => Promise<T>,
): Promise<T> {
  const env = captureEnv(["HOME", "USERPROFILE", "OPENCLAW_HOME", "OPENCLAW_STATE_DIR"]);
  try {
    const homeDir = await tempHarness.createTempDir(`${prefix}-home-`);
    const workspaceDir = await tempHarness.createTempDir(`${prefix}-workspace-`);
    process.env.HOME = homeDir;
    process.env.USERPROFILE = homeDir;
    delete process.env.OPENCLAW_HOME;
    delete process.env.OPENCLAW_STATE_DIR;
    return await run({ homeDir, workspaceDir });
  } finally {
    env.restore();
  }
}
