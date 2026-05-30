/** Public sandbox API barrel for config, backends, bridges, and policies. */
export {
  resolveSandboxBrowserConfig,
  resolveSandboxConfigForAgent,
  resolveSandboxDockerConfig,
  resolveSandboxPruneConfig,
  resolveSandboxScope,
} from "./sandbox/config.js";
/** Default sandbox image constants used by config resolution and Docker setup. */
export {
  DEFAULT_SANDBOX_BROWSER_IMAGE,
  DEFAULT_SANDBOX_COMMON_IMAGE,
  DEFAULT_SANDBOX_IMAGE,
} from "./sandbox/constants.js";
/** Workspace/context helpers that prepare per-session sandbox directories. */
export { ensureSandboxWorkspaceForSession, resolveSandboxContext } from "./sandbox/context.js";
/** Backend registry helpers for selecting and requiring sandbox implementations. */
export {
  getSandboxBackendFactory,
  getSandboxBackendManager,
  registerSandboxBackend,
  requireSandboxBackendFactory,
} from "./sandbox/backend.js";

/** Docker sandbox command helpers and daemon availability detection. */
export { buildSandboxCreateArgs, isDockerDaemonUnavailable } from "./sandbox/docker.js";
/** Sandbox container/browser management helpers used by prune and status commands. */
export {
  listSandboxBrowsers,
  listSandboxContainers,
  removeSandboxBrowserContainer,
  removeSandboxContainer,
  type SandboxBrowserInfo,
  type SandboxContainerInfo,
} from "./sandbox/manage.js";
/** Runtime status and policy-blocked message helpers for sandbox tools. */
export {
  formatSandboxToolPolicyBlockedMessage,
  resolveSandboxRuntimeStatus,
} from "./sandbox/runtime-status.js";

/** Sandbox tool policy resolution and allow/deny checks. */
export { isToolAllowed, resolveSandboxToolPolicyForAgent } from "./sandbox/tool-policy.js";
/** Filesystem bridge contracts for local and remote sandbox path resolution. */
export type { SandboxFsBridge, SandboxFsStat, SandboxResolvedPath } from "./sandbox/fs-bridge.js";
/** SSH sandbox command/session helpers plus remote upload support. */
export {
  buildExecRemoteCommand,
  buildRemoteCommand,
  buildSshSandboxArgv,
  buildValidatedExecRemoteCommand,
  createSshSandboxSessionFromConfigText,
  createSshSandboxSessionFromSettings,
  disposeSshSandboxSession,
  runSshSandboxCommand,
  shellEscape,
  uploadDirectoryToSshTarget,
} from "./sandbox/ssh.js";
/** Environment sanitization helper for sandbox command execution. */
export { sanitizeEnvVars } from "./sandbox/sanitize-env-vars.js";
/** Remote shell filesystem bridge factory for SSH-backed sandboxes. */
export { createRemoteShellSandboxFsBridge } from "./sandbox/remote-fs-bridge.js";
/** Factory for resolving writable rename targets through a sandbox bridge. */
export { createWritableRenameTargetResolver } from "./sandbox/fs-bridge-rename-targets.js";
/** Resolves writable rename targets from sandbox workspace access rules. */
export { resolveWritableRenameTargets } from "./sandbox/fs-bridge-rename-targets.js";
/** Resolves writable rename targets using an already constructed filesystem bridge. */
export { resolveWritableRenameTargetsForBridge } from "./sandbox/fs-bridge-rename-targets.js";

/** Backend registry and command execution contracts. */
export type {
  CreateSandboxBackendParams,
  SandboxBackendCommandParams,
  SandboxBackendCommandResult,
  SandboxBackendExecSpec,
  SandboxBackendFactory,
  SandboxBackendHandle,
  SandboxBackendId,
  SandboxBackendManager,
  SandboxBackendRegistration,
  SandboxBackendRuntimeInfo,
} from "./sandbox/backend.js";
/** Remote shell sandbox handle exposed by the remote filesystem bridge. */
export type { RemoteShellSandboxHandle } from "./sandbox/remote-fs-bridge.js";
/** SSH sandbox session and command parameter contracts. */
export type {
  RunSshSandboxCommandParams,
  SshSandboxSession,
  SshSandboxSettings,
} from "./sandbox/ssh.js";

/** Public sandbox config, context, policy, and workspace contracts. */
export type {
  SandboxBrowserConfig,
  SandboxBrowserContext,
  SandboxConfig,
  SandboxContext,
  SandboxDockerConfig,
  SandboxPruneConfig,
  SandboxScope,
  SandboxSshConfig,
  SandboxToolPolicy,
  SandboxToolPolicyResolved,
  SandboxToolPolicySource,
  SandboxWorkspaceAccess,
  SandboxWorkspaceInfo,
} from "./sandbox/types.js";
