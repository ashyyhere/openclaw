// Plugin discovery/control-plane fingerprints for cache invalidation.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { hashJson } from "./installed-plugin-index-hash.js";
import { resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-policy.js";
import type { InstalledPluginIndex } from "./installed-plugin-index.js";
import { resolveInstalledManifestRegistryIndexFingerprint } from "./manifest-registry-installed.js";
import { resolvePluginCacheInputs, type PluginSourceRoots } from "./roots.js";

/** Plugin source roots and load paths that define discovery inputs. */
export type PluginDiscoveryContext = {
  roots: PluginSourceRoots;
  loadPaths: readonly string[];
};

/** Inputs that affect plugin discovery, policy, inventory, and activation state. */
export type PluginControlPlaneContext = {
  discovery: PluginDiscoveryContext;
  policyFingerprint: string;
  inventoryFingerprint?: string;
  activationFingerprint?: string;
};

/** Parameters used to resolve plugin source roots and load paths. */
export type ResolvePluginDiscoveryContextParams = {
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  loadPaths?: readonly string[];
};

/** Parameters used to build a full plugin control-plane fingerprint context. */
export type ResolvePluginControlPlaneContextParams = ResolvePluginDiscoveryContextParams & {
  activationFingerprint?: string;
  index?: InstalledPluginIndex;
  inventoryFingerprint?: string;
  policyHash?: string;
};

function resolveConfiguredPluginLoadPaths(
  config: OpenClawConfig | undefined,
): readonly string[] | undefined {
  const paths = config?.plugins?.load?.paths;
  return Array.isArray(paths) ? paths : undefined;
}

/** Resolves discovery roots and load paths from config, env, and workspace. */
export function resolvePluginDiscoveryContext(
  params: ResolvePluginDiscoveryContextParams = {},
): PluginDiscoveryContext {
  return resolvePluginCacheInputs({
    env: params.env ?? process.env,
    workspaceDir: params.workspaceDir,
    loadPaths: [...(params.loadPaths ?? resolveConfiguredPluginLoadPaths(params.config) ?? [])],
  });
}

/** Resolves and hashes plugin discovery inputs. */
export function resolvePluginDiscoveryFingerprint(
  params: ResolvePluginDiscoveryContextParams = {},
): string {
  return fingerprintPluginDiscoveryContext(resolvePluginDiscoveryContext(params));
}

/** Hashes plugin discovery context for cache keys. */
export function fingerprintPluginDiscoveryContext(context: PluginDiscoveryContext): string {
  return hashJson(context);
}

/** Builds the full plugin control-plane context used for invalidation. */
export function resolvePluginControlPlaneContext(
  params: ResolvePluginControlPlaneContextParams = {},
): PluginControlPlaneContext {
  const inventoryFingerprint =
    params.inventoryFingerprint ??
    (params.index ? resolveInstalledManifestRegistryIndexFingerprint(params.index) : undefined);
  return {
    discovery: resolvePluginDiscoveryContext(params),
    policyFingerprint: params.policyHash ?? resolveInstalledPluginIndexPolicyHash(params.config),
    ...(inventoryFingerprint ? { inventoryFingerprint } : {}),
    ...(params.activationFingerprint
      ? { activationFingerprint: params.activationFingerprint }
      : {}),
  };
}

/** Resolves and hashes the full plugin control-plane context. */
export function resolvePluginControlPlaneFingerprint(
  params: ResolvePluginControlPlaneContextParams = {},
): string {
  return fingerprintPluginControlPlaneContext(resolvePluginControlPlaneContext(params));
}

function fingerprintPluginControlPlaneContext(context: PluginControlPlaneContext): string {
  return hashJson(context);
}
