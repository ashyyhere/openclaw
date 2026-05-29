/** Backend manager/factory contracts for sandbox runtimes. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SandboxBackendHandle } from "./backend-handle.types.js";
import type { SandboxRegistryEntry } from "./registry.js";
import type { SandboxConfig } from "./types.js";

/** Shared type for Sandbox Backend Runtime Info in src/agents/sandbox. */
export type SandboxBackendRuntimeInfo = {
  running: boolean;
  actualConfigLabel?: string;
  configLabelMatch: boolean;
};

/** Shared type for Sandbox Backend Manager in src/agents/sandbox. */
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

/** Shared type for Create Sandbox Backend Params in src/agents/sandbox. */
export type CreateSandboxBackendParams = {
  sessionKey: string;
  scopeKey: string;
  workspaceDir: string;
  agentWorkspaceDir: string;
  cfg: SandboxConfig;
};

/** Shared type for Sandbox Backend Factory in src/agents/sandbox. */
export type SandboxBackendFactory = (
  params: CreateSandboxBackendParams,
) => Promise<SandboxBackendHandle>;

/** Shared type for Sandbox Backend Registration in src/agents/sandbox. */
export type SandboxBackendRegistration =
  | SandboxBackendFactory
  | {
      factory: SandboxBackendFactory;
      manager?: SandboxBackendManager;
    };

/** Shared type for Registered Sandbox Backend in src/agents/sandbox. */
export type RegisteredSandboxBackend = {
  factory: SandboxBackendFactory;
  manager?: SandboxBackendManager;
};

/** Re-exported API for src/agents/sandbox, starting with Sandbox Backend Handle. */
export type { SandboxBackendHandle, SandboxBackendId } from "./backend-handle.types.js";
/** Re-exported API for src/agents/sandbox. */
export type {
  SandboxBackendCommandParams,
  SandboxBackendCommandResult,
  SandboxBackendExecSpec,
  SandboxFsBridgeContext,
} from "./backend-handle.types.js";
