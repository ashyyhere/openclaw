// Node TLS environment helpers for system CA bundle discovery.
import fs from "node:fs";

/** Common Linux system CA bundle paths checked when Node does not inherit OS trust. */
export const LINUX_CA_BUNDLE_PATHS = [
  "/etc/ssl/certs/ca-certificates.crt",
  "/etc/pki/tls/certs/ca-bundle.crt",
  "/etc/ssl/ca-bundle.pem",
] as const;

/** Mutable environment map used by startup environment resolvers. */
export type EnvMap = Record<string, string | undefined>;
type AccessSyncFn = (path: string, mode?: number) => void;

/** Resolve the first readable Linux system CA bundle path. */
export function resolveLinuxSystemCaBundle(
  params: {
    platform?: NodeJS.Platform;
    accessSync?: AccessSyncFn;
  } = {},
): string | undefined {
  const platform = params.platform ?? process.platform;
  if (platform !== "linux") {
    return undefined;
  }

  const accessSync = params.accessSync ?? fs.accessSync.bind(fs);
  for (const candidate of LINUX_CA_BUNDLE_PATHS) {
    try {
      accessSync(candidate, fs.constants.R_OK);
      return candidate;
    } catch {
      continue;
    }
  }
  return undefined;
}

/** Return true when the current Node binary appears managed by a version manager. */
export function isNodeVersionManagerRuntime(
  env: EnvMap = process.env as EnvMap,
  execPath: string = process.execPath,
): boolean {
  if (env.NVM_DIR?.trim()) {
    return true;
  }
  return execPath.includes("/.nvm/");
}

/** Resolve automatic NODE_EXTRA_CA_CERTS when the current runtime needs explicit CA trust. */
export function resolveAutoNodeExtraCaCerts(
  params: {
    env?: EnvMap;
    platform?: NodeJS.Platform;
    execPath?: string;
    accessSync?: AccessSyncFn;
  } = {},
): string | undefined {
  const env = params.env ?? (process.env as EnvMap);
  if (env.NODE_EXTRA_CA_CERTS?.trim()) {
    return undefined;
  }

  const platform = params.platform ?? process.platform;
  const execPath = params.execPath ?? process.execPath;
  if (platform !== "linux" || !isNodeVersionManagerRuntime(env, execPath)) {
    return undefined;
  }

  return resolveLinuxSystemCaBundle({
    platform,
    accessSync: params.accessSync,
  });
}
