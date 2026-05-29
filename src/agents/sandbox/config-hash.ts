/** Computes restart hashes for sandbox Docker and browser configs. */
import { hashTextSha256 } from "./hash.js";
import type { SandboxBrowserConfig, SandboxDockerConfig, SandboxWorkspaceAccess } from "./types.js";

/** Reused constant for SANDBOX DOCKER EXPLICIT ENV POLICY EPOCH behavior in src/agents/sandbox. */
export const SANDBOX_DOCKER_EXPLICIT_ENV_POLICY_EPOCH = "explicit-config-env-v1";

type SandboxHashInput = {
  docker: SandboxDockerConfig;
  dockerEnvPolicyEpoch?: string;
  workspaceAccess: SandboxWorkspaceAccess;
  workspaceDir: string;
  agentWorkspaceDir: string;
  mountFormatVersion: number;
  readOnlyWorkspaceSkillMounts?: readonly string[];
};

type SandboxBrowserHashInput = {
  docker: SandboxDockerConfig;
  dockerEnvPolicyEpoch?: string;
  browser: Pick<
    SandboxBrowserConfig,
    | "cdpPort"
    | "cdpSourceRange"
    | "vncPort"
    | "noVncPort"
    | "headless"
    | "enableNoVnc"
    | "autoStartTimeoutMs"
  >;
  securityEpoch: string;
  workspaceAccess: SandboxWorkspaceAccess;
  workspaceDir: string;
  agentWorkspaceDir: string;
  mountFormatVersion: number;
  readOnlyWorkspaceSkillMounts?: readonly string[];
};

function normalizeForHash(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeForHash).filter((item): item is unknown => item !== undefined);
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b));
    const normalized: Record<string, unknown> = {};
    for (const [key, entryValue] of entries) {
      const next = normalizeForHash(entryValue);
      if (next !== undefined) {
        normalized[key] = next;
      }
    }
    return normalized;
  }
  return value;
}

/** Hashes sandbox config fields that require container recreation when changed. */
export function computeSandboxConfigHash(input: SandboxHashInput): string {
  return computeHash(input);
}

/** Hashes browser config fields that require browser container recreation. */
export function computeSandboxBrowserConfigHash(input: SandboxBrowserHashInput): string {
  return computeHash(input);
}

function computeHash(input: unknown): string {
  const payload = normalizeForHash(input);
  const raw = JSON.stringify(payload);
  return hashTextSha256(raw);
}
