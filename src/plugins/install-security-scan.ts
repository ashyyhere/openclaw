// plugins install security scan helpers and runtime behavior.
type InstallScanLogger = {
  warn?: (message: string) => void;
};

/** Re-exported API for src/plugins, starting with Install Safety Overrides. */
export type { InstallSafetyOverrides } from "./install-security-scan.types.js";
import type { InstallSafetyOverrides } from "./install-security-scan.types.js";

/** Shared type for Install Security Scan Result in src/plugins. */
export type InstallSecurityScanResult = {
  blocked?: {
    code?: "security_scan_blocked" | "security_scan_failed";
    reason: string;
  };
};

/** Shared type for Plugin Install Request Kind in src/plugins. */
export type PluginInstallRequestKind =
  | "plugin-dir"
  | "plugin-archive"
  | "plugin-file"
  | "plugin-npm"
  | "plugin-git";

/** Shared type for Skill Install Spec Metadata in src/plugins. */
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

/** Shared type for Package Executable Scan Metadata in src/plugins. */
export type PackageExecutableScanMetadata = {
  runtimeExtensions?: readonly string[];
  runtimeSetupEntry?: string;
  setupEntry?: string;
};

async function loadInstallSecurityScanRuntime() {
  return await import("./install-security-scan.runtime.js");
}

/** Reused helper for scan Bundle Install Source behavior in src/plugins. */
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

/** Reused helper for scan Package Install Source behavior in src/plugins. */
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

/** Reused helper for scan Installed Package Dependency Tree behavior in src/plugins. */
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

/** Reused helper for scan File Install Source behavior in src/plugins. */
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

/** Reused helper for scan Skill Install Source behavior in src/plugins. */
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
