// Bundled extension manifest checks validate install metadata for release packaging.
import { validateMinHostVersion } from "../../src/plugins/min-host-version.ts";
import { isRecord } from "../../src/utils.js";

/** Package manifest fields read by bundled extension manifest checks. */
export type ExtensionPackageJson = {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  openclaw?: {
    install?: unknown;
    releaseChecks?: unknown;
  };
};

/** Bundled extension manifest paired with its extension id. */
export type BundledExtension = { id: string; packageJson: ExtensionPackageJson };

/** Collects install metadata validation errors for bundled extension manifests. */
export function collectBundledExtensionManifestErrors(extensions: BundledExtension[]): string[] {
  const errors: string[] = [];

  for (const extension of extensions) {
    const install = extension.packageJson.openclaw?.install;
    if (install !== undefined && !isRecord(install)) {
      errors.push(
        `bundled extension '${extension.id}' manifest invalid | openclaw.install must be an object`,
      );
      continue;
    }
    const hasNpmSpec = isRecord(install) && "npmSpec" in install;
    if (
      hasNpmSpec &&
      (!install.npmSpec || typeof install.npmSpec !== "string" || !install.npmSpec.trim())
    ) {
      errors.push(
        `bundled extension '${extension.id}' manifest invalid | openclaw.install.npmSpec must be a non-empty string`,
      );
    }
    const minHostVersionError = validateMinHostVersion(install?.minHostVersion);
    if (minHostVersionError) {
      errors.push(`bundled extension '${extension.id}' manifest invalid | ${minHostVersionError}`);
    }
  }

  return errors;
}
