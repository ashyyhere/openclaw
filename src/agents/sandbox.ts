/** Public sandbox API barrel for config, backends, bridges, and policies. */
export {
  resolveSandboxBrowserConfig,
  resolveSandboxConfigForAgent,
  resolveSandboxDockerConfig,
  resolveSandboxPruneConfig,
  resolveSandboxScope,
} from "./sandbox/config.js";
/** Re-exported API for src/agents. */
export {
  DEFAULT_SANDBOX_BROWSER_IMAGE,
  DEFAULT_SANDBOX_COMMON_IMAGE,
  DEFAULT_SANDBOX_IMAGE,
} from "./sandbox/constants.js";
/** Re-exported API for src/agents, starting with ensure Sandbox Workspace For Session. */
export { ensureSandboxWorkspaceForSession, resolveSandboxContext } from "./sandbox/context.js";
/** Re-exported API for src/agents. */
export {
  getSandboxBackendFactory,
  getSandboxBackendManager,
  registerSandboxBackend,
  requireSandboxBackendFactory,
} from "./sandbox/backend.js";

/** Re-exported API for src/agents, starting with build Sandbox Create Args. */
export { buildSandboxCreateArgs, isDockerDaemonUnavailable } from "./sandbox/docker.js";
/** Re-exported API for src/agents. */
export {
  listSandboxBrowsers,
  listSandboxContainers,
  removeSandboxBrowserContainer,
  removeSandboxContainer,
  type SandboxBrowserInfo,
  type SandboxContainerInfo,
} from "./sandbox/manage.js";
/** Re-exported API for src/agents. */
export {
  formatSandboxToolPolicyBlockedMessage,
  resolveSandboxRuntimeStatus,
} from "./sandbox/runtime-status.js";

/** Re-exported API for src/agents, starting with is Tool Allowed. */
export { isToolAllowed, resolveSandboxToolPolicyForAgent } from "./sandbox/tool-policy.js";
/** Re-exported API for src/agents, starting with Sandbox Fs Bridge. */
export type { SandboxFsBridge, SandboxFsStat, SandboxResolvedPath } from "./sandbox/fs-bridge.js";
/** Re-exported API for src/agents. */
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
/** Re-exported API for src/agents, starting with sanitize Env Vars. */
export { sanitizeEnvVars } from "./sandbox/sanitize-env-vars.js";
/** Re-exported API for src/agents, starting with create Remote Shell Sandbox Fs Bridge. */
export { createRemoteShellSandboxFsBridge } from "./sandbox/remote-fs-bridge.js";
/** Re-exported API for src/agents, starting with create Writable Rename Target Resolver. */
export { createWritableRenameTargetResolver } from "./sandbox/fs-bridge-rename-targets.js";
/** Re-exported API for src/agents, starting with resolve Writable Rename Targets. */
export { resolveWritableRenameTargets } from "./sandbox/fs-bridge-rename-targets.js";
/** Re-exported API for src/agents, starting with resolve Writable Rename Targets For Bridge. */
export { resolveWritableRenameTargetsForBridge } from "./sandbox/fs-bridge-rename-targets.js";

/** Re-exported API for src/agents. */
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
/** Re-exported API for src/agents, starting with Remote Shell Sandbox Handle. */
export type { RemoteShellSandboxHandle } from "./sandbox/remote-fs-bridge.js";
/** Re-exported API for src/agents. */
export type {
  RunSshSandboxCommandParams,
  SshSandboxSession,
  SshSandboxSettings,
} from "./sandbox/ssh.js";

/** Re-exported API for src/agents. */
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
