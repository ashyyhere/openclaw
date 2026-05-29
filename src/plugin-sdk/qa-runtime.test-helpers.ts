/** Test helpers for QA runtime filesystem and fixture setup. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { expect, vi } from "vitest";

type QaRuntimeModule = {
  loadQaRuntimeModule: () => unknown;
};

type SurfaceLoaderMock = ReturnType<typeof vi.fn>;

/** Reused helper for cleanup Temp Dirs behavior in src/plugin-sdk. */
export function cleanupTempDirs(tempDirs: string[]): void {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** Reused helper for restore Private Qa Cli Env behavior in src/plugin-sdk. */
export function restorePrivateQaCliEnv(originalPrivateQaCli: string | undefined): void {
  if (originalPrivateQaCli === undefined) {
    delete process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI;
  } else {
    process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI = originalPrivateQaCli;
  }
}

/** Reused helper for make Private Qa Source Root behavior in src/plugin-sdk. */
export function makePrivateQaSourceRoot(tempDirs: string[], prefix: string): string {
  const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(sourceRoot);
  fs.mkdirSync(path.join(sourceRoot, "src"), { recursive: true });
  fs.mkdirSync(path.join(sourceRoot, "extensions"), { recursive: true });
  fs.writeFileSync(path.join(sourceRoot, ".git"), "gitdir: /tmp/mock\n", "utf8");
  process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI = "1";
  return sourceRoot;
}

function makeQaRuntimeSurface() {
  return {
    defaultQaRuntimeModelForMode: vi.fn(),
    startQaLiveLaneGateway: vi.fn(),
  };
}

/** Reused helper for expect Qa Lab Runtime Surface Load behavior in src/plugin-sdk. */
export async function expectQaLabRuntimeSurfaceLoad(params: {
  importRuntime: () => Promise<QaRuntimeModule>;
  loadBundledPluginPublicSurfaceModuleSync: SurfaceLoaderMock;
}) {
  const runtimeSurface = makeQaRuntimeSurface();
  params.loadBundledPluginPublicSurfaceModuleSync.mockReturnValue(runtimeSurface);

  const module = await params.importRuntime();

  expect(module.loadQaRuntimeModule()).toBe(runtimeSurface);
  expect(params.loadBundledPluginPublicSurfaceModuleSync).toHaveBeenCalledWith({
    dirName: "qa-lab",
    artifactBasename: "runtime-api.js",
  });
}

/** Reused helper for expect Private Qa Lab Runtime Surface Load behavior in src/plugin-sdk. */
export async function expectPrivateQaLabRuntimeSurfaceLoad(params: {
  tempDirs: string[];
  importRuntime: () => Promise<QaRuntimeModule>;
  loadBundledPluginPublicSurfaceModuleSync: SurfaceLoaderMock;
  resolveOpenClawPackageRootSync: SurfaceLoaderMock;
}) {
  const sourceRoot = makePrivateQaSourceRoot(params.tempDirs, "openclaw-qa-runtime-root-");
  params.resolveOpenClawPackageRootSync.mockReturnValue(sourceRoot);

  const runtimeSurface = makeQaRuntimeSurface();
  params.loadBundledPluginPublicSurfaceModuleSync.mockReturnValue(runtimeSurface);

  const module = await params.importRuntime();

  expect(module.loadQaRuntimeModule()).toBe(runtimeSurface);
  expect(params.loadBundledPluginPublicSurfaceModuleSync).toHaveBeenCalledWith({
    dirName: "qa-lab",
    artifactBasename: "runtime-api.js",
    env: expect.objectContaining({
      OPENCLAW_ENABLE_PRIVATE_QA_CLI: "1",
      OPENCLAW_BUNDLED_PLUGINS_DIR: path.join(sourceRoot, "extensions"),
    }),
  });
}
