/** Backend manager/factory contracts for sandbox runtimes. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SandboxBackendHandle } from "./backend-handle.types.js";
import type { SandboxRegistryEntry } from "./registry.js";
import type { SandboxConfig } from "./types.js";

/** Runtime status summary returned by sandbox backend managers. */
export type SandboxBackendRuntimeInfo = {
  running: boolean;
  actualConfigLabel?: string;
  configLabelMatch: boolean;
};

/** Optional manager contract for inspecting and removing sandbox runtimes. */
export type SandboxBackendManager = {
  describeRuntime(params: {
    entry: SandboxRegistryEntry;
    config: OpenClawConfig;
    agentId?: string;
  }): Promise<SandboxBackendRuntimeInfo>;
  removeRuntime(params: {
    entry: SandboxRegistryEntry;
    config: OpenClawConfig;
    agentId?: string;
  }): Promise<void>;
};

/** Inputs required to create a sandbox backend handle for one session. */
export type CreateSandboxBackendParams = {
  sessionKey: string;
  scopeKey: string;
  workspaceDir: string;
  agentWorkspaceDir: string;
  cfg: SandboxConfig;
};

/** Factory that creates a concrete sandbox backend handle. */
export type SandboxBackendFactory = (
  params: CreateSandboxBackendParams,
) => Promise<SandboxBackendHandle>;

/** Registration shape for sandbox backends with optional runtime management. */
export type SandboxBackendRegistration =
  | SandboxBackendFactory
  | {
      factory: SandboxBackendFactory;
      manager?: SandboxBackendManager;
    };

/** Normalized sandbox backend registration stored by the registry. */
export type RegisteredSandboxBackend = {
  factory: SandboxBackendFactory;
  manager?: SandboxBackendManager;
};

/** Sandbox backend handle and id contracts exposed by backend factories. */
export type { SandboxBackendHandle, SandboxBackendId } from "./backend-handle.types.js";
/** Command and filesystem bridge contracts exposed by sandbox backends. */
export type {
  SandboxBackendCommandParams,
  SandboxBackendCommandResult,
  SandboxBackendExecSpec,
  SandboxFsBridgeContext,
} from "./backend-handle.types.js";
