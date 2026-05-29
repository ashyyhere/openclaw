// infra install from npm spec helpers and runtime behavior.
import type { NpmIntegrityDriftPayload } from "./npm-integrity.js";
import {
  finalizeNpmSpecArchiveInstall,
  installFromNpmSpecArchiveWithInstaller,
  type NpmSpecArchiveFinalInstallResult,
} from "./npm-pack-install.js";
import { validateRegistryNpmSpec } from "./npm-registry-spec.js";

/** Reused helper for install From Validated Npm Spec Archive behavior in src/infra. */
export async function installFromValidatedNpmSpecArchive<
  TResult extends { ok: boolean },
  TArchiveInstallParams extends { archivePath: string },
>(params: {
  spec: string;
  timeoutMs: number;
  tempDirPrefix: string;
  expectedIntegrity?: string;
  onIntegrityDrift?: (payload: NpmIntegrityDriftPayload) => boolean | Promise<boolean>;
  warn?: (message: string) => void;
  installFromArchive: (params: TArchiveInstallParams) => Promise<TResult>;
  archiveInstallParams: Omit<TArchiveInstallParams, "archivePath">;
}): Promise<NpmSpecArchiveFinalInstallResult<TResult>> {
  const spec = params.spec.trim();
  const specError = validateRegistryNpmSpec(spec);
  if (specError) {
    return { ok: false, error: specError };
  }
  const flowResult = await installFromNpmSpecArchiveWithInstaller({
    tempDirPrefix: params.tempDirPrefix,
    spec,
    timeoutMs: params.timeoutMs,
    expectedIntegrity: params.expectedIntegrity,
    onIntegrityDrift: params.onIntegrityDrift,
    warn: params.warn,
    installFromArchive: params.installFromArchive,
    archiveInstallParams: params.archiveInstallParams,
  });
  return finalizeNpmSpecArchiveInstall(flowResult);
}
