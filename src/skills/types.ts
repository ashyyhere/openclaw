// Shared types for src/skills types behavior.
import type { Skill } from "./loading/skill-contract.js";

/** Shared type for Skill Install Spec in src/skills. */
export type SkillInstallSpec = {
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

/** Shared type for Open Claw Skill Metadata in src/skills. */
export type OpenClawSkillMetadata = {
  always?: boolean;
  skillKey?: string;
  primaryEnv?: string;
  emoji?: string;
  homepage?: string;
  os?: string[];
  requires?: {
    bins?: string[];
    anyBins?: string[];
    env?: string[];
    config?: string[];
  };
  install?: SkillInstallSpec[];
};

/** Shared type for Skill Invocation Policy in src/skills. */
export type SkillInvocationPolicy = {
  userInvocable: boolean;
  disableModelInvocation: boolean;
};

/** Shared type for Skill Command Dispatch Spec in src/skills. */
export type SkillCommandDispatchSpec = {
  kind: "tool";
  /** Name of the tool to invoke (AnyAgentTool.name). */
  toolName: string;
  /**
   * How to forward user-provided args to the tool.
   * - raw: forward the raw args string (no core parsing).
   */
  argMode?: "raw";
};

/** Shared type for Skill Telemetry Source in src/skills. */
export type SkillTelemetrySource = "bundled" | "unknown" | "workspace";

/** Shared type for Skill Command Spec in src/skills. */
export type SkillCommandSpec = {
  name: string;
  skillName: string;
  description: string;
  /** Bounded source label used for diagnostics. */
  skillSource?: SkillTelemetrySource;
  /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  /** Optional deterministic dispatch behavior for this command. */
  dispatch?: SkillCommandDispatchSpec;
  /** Native prompt template used by Claude-bundle command markdown files. */
  promptTemplate?: string;
  /** Source markdown path for bundle-backed commands. */
  sourceFilePath?: string;
};

/** Shared type for Skills Install Preferences in src/skills. */
export type SkillsInstallPreferences = {
  preferBrew: boolean;
  nodeManager: "npm" | "pnpm" | "yarn" | "bun";
};

/** Shared type for Parsed Skill Frontmatter in src/skills. */
export type ParsedSkillFrontmatter = Record<string, string>;

/** Shared type for Skill Exposure in src/skills. */
export type SkillExposure = {
  includeInRuntimeRegistry: boolean;
  includeInAvailableSkillsPrompt: boolean;
  userInvocable: boolean;
};

/** Shared type for Skill Entry in src/skills. */
export type SkillEntry = {
  skill: Skill;
  frontmatter: ParsedSkillFrontmatter;
  metadata?: OpenClawSkillMetadata;
  invocation?: SkillInvocationPolicy;
  exposure?: SkillExposure;
  syncSourceDir?: string;
  syncDirName?: string;
};

/** Shared type for Skill Eligibility Context in src/skills. */
export type SkillEligibilityContext = {
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};

/** Shared type for Skill Snapshot in src/skills. */
export type SkillSnapshot = {
  prompt: string;
  skills: Array<{ name: string; primaryEnv?: string; requiredEnv?: string[] }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  resolvedSkills?: Skill[];
  version?: number;
};
