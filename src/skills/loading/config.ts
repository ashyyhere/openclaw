// src/skills/loading config helpers and runtime behavior.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SkillConfig } from "../../config/types.skills.js";
import {
  evaluateRuntimeEligibility,
  hasBinary,
  isConfigPathTruthyWithDefaults,
  resolveConfigPath,
  resolveRuntimePlatform,
} from "../../shared/config-eval.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";
import { normalizeStringEntries } from "../../shared/string-normalization.js";
import type { SkillEligibilityContext, SkillEntry, SkillsInstallPreferences } from "../types.js";
import { resolveSkillKey } from "./frontmatter.js";
import { resolveSkillSource } from "./source.js";

const DEFAULT_CONFIG_VALUES: Record<string, boolean> = {
  "browser.enabled": true,
  "browser.evaluateEnabled": true,
};

/** Re-exported API for src/skills/loading, starting with has Binary. */
export { hasBinary, resolveConfigPath, resolveRuntimePlatform };

/** Reused helper for resolve Skills Install Preferences behavior in src/skills/loading. */
export function resolveSkillsInstallPreferences(config?: OpenClawConfig): SkillsInstallPreferences {
  const raw = config?.skills?.install;
  const preferBrew = raw?.preferBrew ?? true;
  const manager = normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw?.nodeManager));
  const nodeManager: SkillsInstallPreferences["nodeManager"] =
    manager === "pnpm" || manager === "yarn" || manager === "bun" || manager === "npm"
      ? manager
      : "npm";
  return { preferBrew, nodeManager };
}

/** Reused helper for is Config Path Truthy behavior in src/skills/loading. */
export function isConfigPathTruthy(config: OpenClawConfig | undefined, pathStr: string): boolean {
  return isConfigPathTruthyWithDefaults(config, pathStr, DEFAULT_CONFIG_VALUES);
}

/** Reused helper for resolve Skill Config behavior in src/skills/loading. */
export function resolveSkillConfig(
  config: OpenClawConfig | undefined,
  skillKey: string,
): SkillConfig | undefined {
  const skills = config?.skills?.entries;
  if (!skills || typeof skills !== "object") {
    return undefined;
  }
  const entry = (skills as Record<string, SkillConfig | undefined>)[skillKey];
  if (!entry || typeof entry !== "object") {
    return undefined;
  }
  return entry;
}

function normalizeAllowlist(input: unknown): ReadonlySet<string> | undefined {
  if (!input) {
    return undefined;
  }
  if (!Array.isArray(input)) {
    return undefined;
  }
  const normalized = normalizeStringEntries(input);
  return normalized.length > 0 ? new Set(normalized) : undefined;
}

const BUNDLED_SOURCES = new Set(["openclaw-bundled"]);

function isBundledSkill(entry: SkillEntry): boolean {
  return BUNDLED_SOURCES.has(resolveSkillSource(entry.skill));
}

export function resolveBundledAllowlist(config?: OpenClawConfig): ReadonlySet<string> | undefined {
  return normalizeAllowlist(config?.skills?.allowBundled);
}

export function isBundledSkillAllowed(entry: SkillEntry, allowlist?: ReadonlySet<string>): boolean {
  if (!allowlist || allowlist.size === 0) {
    return true;
  }
  if (!isBundledSkill(entry)) {
    return true;
  }
  const key = resolveSkillKey(entry.skill, entry);
  return allowlist.has(key) || allowlist.has(entry.skill.name);
}

/** Reused helper for should Include Skill behavior in src/skills/loading. */
export function shouldIncludeSkill(params: {
  entry: SkillEntry;
  config?: OpenClawConfig;
  bundledAllowlist: ReadonlySet<string> | undefined;
  eligibility?: SkillEligibilityContext;
}): boolean {
  const { entry, config, bundledAllowlist, eligibility } = params;
  const skillKey = resolveSkillKey(entry.skill, entry);
  const skillConfig = resolveSkillConfig(config, skillKey);

  if (skillConfig?.enabled === false) {
    return false;
  }
  if (!isBundledSkillAllowed(entry, bundledAllowlist)) {
    return false;
  }
  return evaluateRuntimeEligibility({
    os: entry.metadata?.os,
    remotePlatforms: eligibility?.remote?.platforms,
    always: entry.metadata?.always,
    requires: entry.metadata?.requires,
    hasBin: hasBinary,
    hasRemoteBin: eligibility?.remote?.hasBin,
    hasAnyRemoteBin: eligibility?.remote?.hasAnyBin,
    hasEnv: (envName) =>
      Boolean(
        process.env[envName] ||
        skillConfig?.env?.[envName] ||
        (skillConfig?.apiKey && entry.metadata?.primaryEnv === envName),
      ),
    isConfigPathTruthy: (configPath) => isConfigPathTruthy(config, configPath),
  });
}
