// Shared skill metadata, command, exposure, and snapshot contracts used by
// loading, install, and runtime prompt assembly.
import type { Skill } from "./loading/skill-contract.js";

/** Declarative install recipe embedded in skill metadata. */
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

/** OpenClaw-specific frontmatter metadata parsed from a skill. */
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

/** Model/user invocation flags resolved for a skill. */
export type SkillInvocationPolicy = {
  userInvocable: boolean;
  disableModelInvocation: boolean;
};

/** Deterministic dispatch target for a user-invocable skill command. */
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

/** Bounded source label for skill command diagnostics and telemetry. */
export type SkillTelemetrySource = "bundled" | "unknown" | "workspace";

/** Native command surface contributed by a skill. */
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

/** Operator preferences used when installing skill prerequisites. */
export type SkillsInstallPreferences = {
  preferBrew: boolean;
  nodeManager: "npm" | "pnpm" | "yarn" | "bun";
};

/** String metadata parsed from a skill Markdown frontmatter block. */
export type ParsedSkillFrontmatter = Record<string, string>;

/** Resolved exposure flags controlling registry and prompt visibility. */
export type SkillExposure = {
  includeInRuntimeRegistry: boolean;
  includeInAvailableSkillsPrompt: boolean;
  userInvocable: boolean;
};

/** Loaded skill plus parsed metadata used by runtime filtering. */
export type SkillEntry = {
  skill: Skill;
  frontmatter: ParsedSkillFrontmatter;
  metadata?: OpenClawSkillMetadata;
  invocation?: SkillInvocationPolicy;
  exposure?: SkillExposure;
  syncSourceDir?: string;
  syncDirName?: string;
};

/** Runtime facts used to decide whether a skill is eligible on a host. */
export type SkillEligibilityContext = {
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};

/** Prepared skill prompt snapshot and the skills that produced it. */
export type SkillSnapshot = {
  prompt: string;
  skills: Array<{ name: string; primaryEnv?: string; requiredEnv?: string[] }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  resolvedSkills?: Skill[];
  version?: number;
};
