/** Shared sandbox config/context types. */
import type { SandboxBackendHandle, SandboxBackendId } from "./backend-handle.types.js";
import type { SandboxFsBridge } from "./fs-bridge.types.js";
import type { SandboxDockerConfig } from "./types.docker.js";

/** Docker-specific sandbox configuration re-exported with core sandbox types. */
export type { SandboxDockerConfig } from "./types.docker.js";

/** Allow/deny lists controlling which tools may run inside a sandbox. */
export type SandboxToolPolicy = {
  allow?: string[];
  deny?: string[];
};

/** Human-facing source metadata for a resolved sandbox tool policy list. */
export type SandboxToolPolicySource = {
  source: "agent" | "global" | "default";
  /**
   * Config key path hint for humans.
   * (Arrays use `agents.list[].…` form.)
   */
  key: string;
};

/** Fully resolved sandbox tool policy plus source attribution. */
export type SandboxToolPolicyResolved = {
  allow: string[];
  deny: string[];
  sources: {
    allow: SandboxToolPolicySource;
    deny: SandboxToolPolicySource;
  };
};

/** Workspace mount/access mode exposed to a sandbox runtime. */
export type SandboxWorkspaceAccess = "none" | "ro" | "rw";

/** Browser container settings for sandboxed browser automation. */
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

/** Retention policy for pruning idle or old sandbox runtimes. */
export type SandboxPruneConfig = {
  idleHours: number;
  maxAgeDays: number;
};

/** SSH backend configuration used to reach a remote sandbox workspace. */
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

/** Lifetime/scope used when naming or reusing sandbox runtimes. */
export type SandboxScope = "session" | "agent" | "shared";

/** Complete sandbox configuration after defaults and backend choices resolve. */
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

/** Runtime browser endpoints exposed by an active sandbox. */
export type SandboxBrowserContext = {
  bridgeUrl: string;
  noVncUrl?: string;
  containerName: string;
};

/** Active sandbox runtime context passed to agent execution and tools. */
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

/** Host/container workspace path pair for sandbox-aware tools. */
export type SandboxWorkspaceInfo = {
  workspaceDir: string;
  containerWorkdir: string;
};
