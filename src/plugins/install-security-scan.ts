// Lazy public entrypoints for plugin and skill install security scans.
type InstallScanLogger = {
  warn?: (message: string) => void;
};

/** Safety override flags accepted by install scan entrypoints. */
export type { InstallSafetyOverrides } from "./install-security-scan.types.js";
import type { InstallSafetyOverrides } from "./install-security-scan.types.js";

/** Scan outcome returned when an install should be blocked or treated as failed. */
export type InstallSecurityScanResult = {
  blocked?: {
    code?: "security_scan_blocked" | "security_scan_failed";
    reason: string;
  };
};

/** Source kind used to tailor install scan policy and diagnostics. */
export type PluginInstallRequestKind =
  | "plugin-dir"
  | "plugin-archive"
  | "plugin-file"
  | "plugin-npm"
  | "plugin-git";

/** Metadata for external tools declared by a skill install spec. */
export type SkillInstallSpecMetadata = {
  id?: string;
  kind: "brew" | "node" | "go" | "uv" | "download";
  label?: string;
  bins?: string[];
  os?: string[];
  formula?: string;
  package?: string;
  module?: string;
  url?: string;
  archive?: string;
  extract?: boolean;
  stripComponents?: number;
  targetDir?: string;
};

/** Package metadata used to decide which executable entrypoints need scanning. */
export type PackageExecutableScanMetadata = {
  runtimeExtensions?: readonly string[];
  runtimeSetupEntry?: string;
  setupEntry?: string;
};

async function loadInstallSecurityScanRuntime() {
  return await import("./install-security-scan.runtime.js");
}

/** Scans an unpacked plugin bundle before install or update proceeds. */
export async function scanBundleInstallSource(
  params: InstallSafetyOverrides & {
    logger: InstallScanLogger;
    pluginId: string;
    sourceDir: string;
    requestKind?: PluginInstallRequestKind;
    requestedSpecifier?: string;
    mode?: "install" | "update";
    version?: string;
  },
): Promise<InstallSecurityScanResult | undefined> {
  const { scanBundleInstallSourceRuntime } = await loadInstallSecurityScanRuntime();
  return await scanBundleInstallSourceRuntime(params);
}

/** Scans an npm/package plugin source, including runtime/setup entrypoint metadata. */
export async function scanPackageInstallSource(
  params: InstallSafetyOverrides & {
    extensions: string[];
    logger: InstallScanLogger;
    packageDir: string;
    packageMetadata?: PackageExecutableScanMetadata;
    pluginId: string;
    requestKind?: PluginInstallRequestKind;
    requestedSpecifier?: string;
    mode?: "install" | "update";
    packageName?: string;
    manifestId?: string;
    version?: string;
  },
): Promise<InstallSecurityScanResult | undefined> {
  const { scanPackageInstallSourceRuntime } = await loadInstallSecurityScanRuntime();
  return await scanPackageInstallSourceRuntime(params);
}

/** Scans an installed package dependency tree for unsafe executable dependency shapes. */
export async function scanInstalledPackageDependencyTree(params: {
  additionalPackageDirs?: string[];
  allowManagedNpmRootPackagePeerSymlinks?: boolean;
  dangerouslyForceUnsafeInstall?: boolean;
  dependencyScanRootDir?: string;
  logger: InstallScanLogger;
  packageDir: string;
  pluginId: string;
  trustedSourceLinkedOfficialInstall?: boolean;
}): Promise<InstallSecurityScanResult | undefined> {
  const { scanInstalledPackageDependencyTreeRuntime } = await loadInstallSecurityScanRuntime();
  return await scanInstalledPackageDependencyTreeRuntime(params);
}

/** Scans a single plugin file install source before it is accepted. */
export async function scanFileInstallSource(
  params: InstallSafetyOverrides & {
    filePath: string;
    logger: InstallScanLogger;
    mode?: "install" | "update";
    pluginId: string;
    requestedSpecifier?: string;
  },
): Promise<InstallSecurityScanResult | undefined> {
  const { scanFileInstallSourceRuntime } = await loadInstallSecurityScanRuntime();
  return await scanFileInstallSourceRuntime(params);
}

/** Scans a skill install source and declared tool install specs. */
export async function scanSkillInstallSource(params: {
  dangerouslyForceUnsafeInstall?: boolean;
  installId: string;
  installSpec?: SkillInstallSpecMetadata;
  logger: InstallScanLogger;
  origin: string;
  skillName: string;
  sourceDir: string;
}): Promise<InstallSecurityScanResult | undefined> {
  const { scanSkillInstallSourceRuntime } = await loadInstallSecurityScanRuntime();
  return await scanSkillInstallSourceRuntime(params);
}
