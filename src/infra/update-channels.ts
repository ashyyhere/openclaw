// infra update channels helpers and runtime behavior.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import { parseComparableSemver } from "./semver-compare.js";

/** Shared type for Update Channel in src/infra. */
export type UpdateChannel = "stable" | "beta" | "dev";
/** Shared type for Update Channel Source in src/infra. */
export type UpdateChannelSource =
  | "config"
  | "git-tag"
  | "git-branch"
  | "installed-version"
  | "default";

/** Reused constant for DEFAULT PACKAGE CHANNEL behavior in src/infra. */
export const DEFAULT_PACKAGE_CHANNEL: UpdateChannel = "stable";
/** Reused constant for DEFAULT GIT CHANNEL behavior in src/infra. */
export const DEFAULT_GIT_CHANNEL: UpdateChannel = "dev";
/** Reused constant for DEV BRANCH behavior in src/infra. */
export const DEV_BRANCH = "main";

/** Reused helper for normalize Update Channel behavior in src/infra. */
export function normalizeUpdateChannel(value?: string | null): UpdateChannel | null {
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) {
    return null;
  }
  if (normalized === "stable" || normalized === "beta" || normalized === "dev") {
    return normalized;
  }
  return null;
}

/** Reused helper for channel To Npm Tag behavior in src/infra. */
export function channelToNpmTag(channel: UpdateChannel): string {
  if (channel === "beta") {
    return "beta";
  }
  if (channel === "dev") {
    return "dev";
  }
  return "latest";
}

/** Reused helper for is Beta Tag behavior in src/infra. */
export function isBetaTag(tag: string): boolean {
  return /(?:^|[.-])beta(?:[.-]|$)/i.test(tag);
}

/** Reused helper for is Prerelease Tag behavior in src/infra. */
export function isPrereleaseTag(tag: string): boolean {
  const parsed = parseComparableSemver(tag, { normalizeLegacyDotBeta: true });
  if (parsed) {
    return Boolean(parsed.prerelease?.some((part) => !/^[0-9]+$/.test(part)));
  }
  return /(?:^|[.-])(alpha|beta|rc|pre|preview|canary|dev|next|nightly|experimental)(?:[.-]|$)/i.test(
    tag,
  );
}

/** Reused helper for is Stable Tag behavior in src/infra. */
export function isStableTag(tag: string): boolean {
  return !isPrereleaseTag(tag);
}

/** Reused helper for resolve Registry Update Channel behavior in src/infra. */
export function resolveRegistryUpdateChannel(params: {
  configChannel?: UpdateChannel | null;
  currentVersion?: string | null;
}): UpdateChannel {
  if (
    params.currentVersion &&
    isBetaTag(params.currentVersion) &&
    params.configChannel !== "beta" &&
    params.configChannel !== "dev"
  ) {
    return "beta";
  }
  return params.configChannel ?? DEFAULT_PACKAGE_CHANNEL;
}

/** Reused helper for resolve Effective Update Channel behavior in src/infra. */
export function resolveEffectiveUpdateChannel(params: {
  configChannel?: UpdateChannel | null;
  currentVersion?: string | null;
  installKind: "git" | "package" | "unknown";
  git?: { tag?: string | null; branch?: string | null };
}): { channel: UpdateChannel; source: UpdateChannelSource } {
  if (
    params.currentVersion &&
    isBetaTag(params.currentVersion) &&
    params.configChannel !== "beta" &&
    params.configChannel !== "dev"
  ) {
    return { channel: "beta", source: "installed-version" };
  }

  if (params.configChannel) {
    return { channel: params.configChannel, source: "config" };
  }

  if (params.installKind === "git") {
    const tag = params.git?.tag;
    if (tag) {
      return {
        channel: isBetaTag(tag) ? "beta" : isStableTag(tag) ? "stable" : "dev",
        source: "git-tag",
      };
    }
    const branch = params.git?.branch;
    if (branch && branch !== "HEAD") {
      return { channel: "dev", source: "git-branch" };
    }
    return { channel: DEFAULT_GIT_CHANNEL, source: "default" };
  }

  if (params.installKind === "package") {
    return { channel: DEFAULT_PACKAGE_CHANNEL, source: "default" };
  }

  return { channel: DEFAULT_PACKAGE_CHANNEL, source: "default" };
}

/** Reused helper for format Update Channel Label behavior in src/infra. */
export function formatUpdateChannelLabel(params: {
  channel: UpdateChannel;
  source: UpdateChannelSource;
  gitTag?: string | null;
  gitBranch?: string | null;
}): string {
  if (params.source === "config") {
    return `${params.channel} (config)`;
  }
  if (params.source === "git-tag") {
    return params.gitTag ? `${params.channel} (${params.gitTag})` : `${params.channel} (tag)`;
  }
  if (params.source === "git-branch") {
    return params.gitBranch
      ? `${params.channel} (${params.gitBranch})`
      : `${params.channel} (branch)`;
  }
  if (params.source === "installed-version") {
    return "beta (installed version)";
  }
  return `${params.channel} (default)`;
}

/** Reused helper for resolve Update Channel Display behavior in src/infra. */
export function resolveUpdateChannelDisplay(params: {
  configChannel?: UpdateChannel | null;
  currentVersion?: string | null;
  installKind: "git" | "package" | "unknown";
  gitTag?: string | null;
  gitBranch?: string | null;
}): { channel: UpdateChannel; source: UpdateChannelSource; label: string } {
  const channelInfo = resolveEffectiveUpdateChannel({
    configChannel: params.configChannel,
    currentVersion: params.currentVersion,
    installKind: params.installKind,
    git:
      params.gitTag || params.gitBranch
        ? { tag: params.gitTag ?? null, branch: params.gitBranch ?? null }
        : undefined,
  });
  return {
    channel: channelInfo.channel,
    source: channelInfo.source,
    label: formatUpdateChannelLabel({
      channel: channelInfo.channel,
      source: channelInfo.source,
      gitTag: params.gitTag ?? null,
      gitBranch: params.gitBranch ?? null,
    }),
  };
}
