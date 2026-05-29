// infra package update utils helpers and runtime behavior.
import fsSync from "node:fs";
import path from "node:path";
import { readRootJsonObjectSync } from "@openclaw/fs-safe/json";
import { isRecord } from "../shared/record-coerce.js";

/** Reused helper for expected Integrity For Update behavior in src/infra. */
export function expectedIntegrityForUpdate(
  spec: string | undefined,
  integrity: string | undefined,
): string | undefined {
  if (!integrity || !spec) {
    return undefined;
  }
  const value = spec.trim();
  if (!value) {
    return undefined;
  }
  const at = value.lastIndexOf("@");
  if (at <= 0 || at >= value.length - 1) {
    return undefined;
  }
  const version = value.slice(at + 1).trim();
  if (!/^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
    return undefined;
  }
  return integrity;
}

function readInstalledPackageManifest(dir: string): Record<string, unknown> | undefined {
  const result = readRootJsonObjectSync({
    rootDir: dir,
    relativePath: "package.json",
    boundaryLabel: "installed package directory",
  });
  return result.ok ? result.value : undefined;
}

/** Reused helper for read Installed Package Version behavior in src/infra. */
export async function readInstalledPackageVersion(dir: string): Promise<string | undefined> {
  const manifest = readInstalledPackageManifest(dir);
  return typeof manifest?.version === "string" ? manifest.version : undefined;
}

/** Reused helper for read Installed Package Peer Dependencies behavior in src/infra. */
export function readInstalledPackagePeerDependencies(dir: string): Record<string, string> {
  const manifest = readInstalledPackageManifest(dir);
  const peerDependencies = isRecord(manifest?.peerDependencies) ? manifest.peerDependencies : {};
  return Object.fromEntries(
    Object.entries(peerDependencies).filter((entry): entry is [string, string] => {
      const [, value] = entry;
      return typeof value === "string";
    }),
  );
}

/** Reused helper for installed Package Needs Open Claw Peer Link Repair behavior in src/infra. */
export function installedPackageNeedsOpenClawPeerLinkRepair(dir: string): boolean {
  const peerDependencies = readInstalledPackagePeerDependencies(dir);
  if (!Object.hasOwn(peerDependencies, "openclaw")) {
    return false;
  }

  try {
    fsSync.statSync(path.join(dir, "node_modules", "openclaw"));
    return false;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException | undefined)?.code;
    return code === "ENOENT" || code === "ENOTDIR";
  }
}
