/** Shared sandbox config/context types. */
import type { SandboxBackendHandle, SandboxBackendId } from "./backend-handle.types.js";
import type { SandboxFsBridge } from "./fs-bridge.types.js";
import type { SandboxDockerConfig } from "./types.docker.js";

/** Re-exported API for src/agents/sandbox, starting with Sandbox Docker Config. */
export type { SandboxDockerConfig } from "./types.docker.js";

/** Shared type for Sandbox Tool Policy in src/agents/sandbox. */
export type SandboxToolPolicy = {
  allow?: string[];
  deny?: string[];
};

/** Shared type for Sandbox Tool Policy Source in src/agents/sandbox. */
export type SandboxToolPolicySource = {
  source: "agent" | "global" | "default";
  /**
   * Config key path hint for humans.
   * (Arrays use `agents.list[].…` form.)
   */
  key: string;
};

/** Shared type for Sandbox Tool Policy Resolved in src/agents/sandbox. */
export type SandboxToolPolicyResolved = {
  allow: string[];
  deny: string[];
  sources: {
    allow: SandboxToolPolicySource;
    deny: SandboxToolPolicySource;
  };
};

/** Shared type for Sandbox Workspace Access in src/agents/sandbox. */
export type SandboxWorkspaceAccess = "none" | "ro" | "rw";

/** Shared type for Sandbox Browser Config in src/agents/sandbox. */
export type SandboxBrowserConfig = {
  enabled: boolean;
  image: string;
  containerPrefix: string;
  network: string;
  cdpPort: number;
  cdpSourceRange?: string;
  vncPort: number;
  noVncPort: number;
  headless: boolean;
  enableNoVnc: boolean;
  allowHostControl: boolean;
  autoStart: boolean;
  autoStartTimeoutMs: number;
  binds?: string[];
};

/** Shared type for Sandbox Prune Config in src/agents/sandbox. */
export type SandboxPruneConfig = {
  idleHours: number;
  maxAgeDays: number;
};

/** Shared type for Sandbox Ssh Config in src/agents/sandbox. */
export type SandboxSshConfig = {
  target?: string;
  command: string;
  workspaceRoot: string;
  strictHostKeyChecking: boolean;
  updateHostKeys: boolean;
  identityFile?: string;
  certificateFile?: string;
  knownHostsFile?: string;
  identityData?: string;
  certificateData?: string;
  knownHostsData?: string;
};

/** Shared type for Sandbox Scope in src/agents/sandbox. */
export type SandboxScope = "session" | "agent" | "shared";

/** Shared type for Sandbox Config in src/agents/sandbox. */
export type SandboxConfig = {
  mode: "off" | "non-main" | "all";
  backend: SandboxBackendId;
  scope: SandboxScope;
  workspaceAccess: SandboxWorkspaceAccess;
  workspaceRoot: string;
  docker: SandboxDockerConfig;
  ssh: SandboxSshConfig;
  browser: SandboxBrowserConfig;
  tools: SandboxToolPolicy;
  prune: SandboxPruneConfig;
};

/** Shared type for Sandbox Browser Context in src/agents/sandbox. */
export type SandboxBrowserContext = {
  bridgeUrl: string;
  noVncUrl?: string;
  containerName: string;
};

/** Shared type for Sandbox Context in src/agents/sandbox. */
export type SandboxContext = {
  enabled: boolean;
  backendId: SandboxBackendId;
  sessionKey: string;
  workspaceDir: string;
  agentWorkspaceDir: string;
  workspaceAccess: SandboxWorkspaceAccess;
  runtimeId: string;
  runtimeLabel: string;
  containerName: string;
  containerWorkdir: string;
  docker: SandboxDockerConfig;
  tools: SandboxToolPolicy;
  browserAllowHostControl: boolean;
  browser?: SandboxBrowserContext;
  fsBridge?: SandboxFsBridge;
  backend?: SandboxBackendHandle;
};

/** Shared type for Sandbox Workspace Info in src/agents/sandbox. */
export type SandboxWorkspaceInfo = {
  workspaceDir: string;
  containerWorkdir: string;
};
