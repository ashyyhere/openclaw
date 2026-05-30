import {
  buildNpmResolutionFields,
  type NpmSpecResolution as NpmResolutionMetadata,
} from "../infra/install-source-utils.js";

/** Chooses the install-record spec for `--pin`, warning when exact resolution is unavailable. */
export function resolvePinnedNpmSpec(params: {
  rawSpec: string;
  pin: boolean;
  resolvedSpec?: string;
}): { recordSpec: string; pinWarning?: string; pinNotice?: string } {
  const recordSpec = params.pin && params.resolvedSpec ? params.resolvedSpec : params.rawSpec;
  if (!params.pin) {
    return { recordSpec };
  }
  if (!params.resolvedSpec) {
    return {
      recordSpec,
      pinWarning: "Could not resolve exact npm version for --pin; storing original npm spec.",
    };
  }
  return {
    recordSpec,
    pinNotice: `Pinned npm install record to ${params.resolvedSpec}.`,
  };
}

/** Converts npm resolution metadata into persisted install-record fields. */
export function mapNpmResolutionMetadata(resolution?: NpmResolutionMetadata): {
  resolvedName?: string;
  resolvedVersion?: string;
  resolvedSpec?: string;
  integrity?: string;
  shasum?: string;
  resolvedAt?: string;
} {
  return buildNpmResolutionFields(resolution);
}

/** Builds the npm-specific install-record fields persisted after plugin install. */
export function buildNpmInstallRecordFields(params: {
  spec: string;
  installPath: string;
  version?: string;
  resolution?: NpmResolutionMetadata;
}): {
  source: "npm";
  spec: string;
  installPath: string;
  version?: string;
  resolvedName?: string;
  resolvedVersion?: string;
  resolvedSpec?: string;
  integrity?: string;
  shasum?: string;
  resolvedAt?: string;
} {
  return {
    source: "npm",
    spec: params.spec,
    installPath: params.installPath,
    version: params.version,
    ...buildNpmResolutionFields(params.resolution),
  };
}

/** Builds a pinned npm install record and emits any pinning notice/warning. */
export function resolvePinnedNpmInstallRecord(params: {
  rawSpec: string;
  pin: boolean;
  installPath: string;
  version?: string;
  resolution?: NpmResolutionMetadata;
  log: (message: string) => void;
  warn: (message: string) => void;
}): ReturnType<typeof buildNpmInstallRecordFields> {
  const pinInfo = resolvePinnedNpmSpec({
    rawSpec: params.rawSpec,
    pin: params.pin,
    resolvedSpec: params.resolution?.resolvedSpec,
  });
  logPinnedNpmSpecMessages(pinInfo, params.log, params.warn);
  return buildNpmInstallRecordFields({
    spec: pinInfo.recordSpec,
    installPath: params.installPath,
    version: params.version,
    resolution: params.resolution,
  });
}

/** CLI adapter for pinned npm install records that formats warnings before logging. */
export function resolvePinnedNpmInstallRecordForCli(
  rawSpec: string,
  pin: boolean,
  installPath: string,
  version: string | undefined,
  resolution: NpmResolutionMetadata | undefined,
  log: (message: string) => void,
  warnFormat: (message: string) => string,
): ReturnType<typeof buildNpmInstallRecordFields> {
  return resolvePinnedNpmInstallRecord({
    rawSpec,
    pin,
    installPath,
    version,
    resolution,
    log,
    warn: (message) => log(warnFormat(message)),
  });
}

/** Emits the warning/notice pair returned by `resolvePinnedNpmSpec`. */
export function logPinnedNpmSpecMessages(
  pinInfo: { pinWarning?: string; pinNotice?: string },
  log: (message: string) => void,
  logWarn: (message: string) => void,
): void {
  if (pinInfo.pinWarning) {
    logWarn(pinInfo.pinWarning);
  }
  if (pinInfo.pinNotice) {
    log(pinInfo.pinNotice);
  }
}
