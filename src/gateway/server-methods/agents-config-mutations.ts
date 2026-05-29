// gateway/server-methods agents config mutations helpers and runtime behavior.
import { resolveAgentDir, resolveAgentWorkspaceDir } from "../../agents/agent-scope.js";
import {
  applyAgentConfig,
  findAgentEntryIndex,
  listAgentEntries,
  pruneAgentConfig,
} from "../../commands/agents.config.js";
import { mutateConfigFileWithRetry } from "../../config/config.js";
import { resolveSessionTranscriptsDirForAgent } from "../../config/sessions.js";
import type { IdentityConfig } from "../../config/types.base.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";

/** Shared type for Agent Delete Mutation Result in src/gateway/server-methods. */
export type AgentDeleteMutationResult = {
  workspaceDir: string;
  agentDir: string;
  sessionsDir: string;
  removedBindings: number;
};

/** Reused class for Agent Config Precondition Error behavior in src/gateway/server-methods. */
export class AgentConfigPreconditionError extends Error {
  constructor(
    readonly kind: "already-exists" | "not-found",
    readonly agentId: string,
  ) {
    super(
      kind === "already-exists"
        ? `agent "${agentId}" already exists`
        : `agent "${agentId}" not found`,
    );
    this.name = "AgentConfigPreconditionError";
  }
}

/** Reused helper for is Configured Agent behavior in src/gateway/server-methods. */
export function isConfiguredAgent(cfg: OpenClawConfig, agentId: string): boolean {
  return findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
}

/** Reused helper for create Agent Config Entry behavior in src/gateway/server-methods. */
export async function createAgentConfigEntry(params: {
  agentId: string;
  name: string;
  workspace: string;
  model?: string;
  identity?: IdentityConfig;
  agentDir: string;
}): Promise<void> {
  await mutateConfigFileWithRetry({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (isConfiguredAgent(draft, params.agentId)) {
        throw new AgentConfigPreconditionError("already-exists", params.agentId);
      }
      const latestNextConfig = applyAgentConfig(draft, {
        agentId: params.agentId,
        name: params.name,
        workspace: params.workspace,
        model: params.model,
        identity: params.identity,
        agentDir: params.agentDir,
      });
      Object.assign(draft, latestNextConfig);
    },
  });
}

/** Reused helper for update Agent Config Entry behavior in src/gateway/server-methods. */
export async function updateAgentConfigEntry(params: {
  agentId: string;
  name?: string;
  workspace?: string;
  model?: string;
  identity?: IdentityConfig;
}): Promise<void> {
  await mutateConfigFileWithRetry({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (!isConfiguredAgent(draft, params.agentId)) {
        throw new AgentConfigPreconditionError("not-found", params.agentId);
      }
      const latestNextConfig = applyAgentConfig(draft, {
        agentId: params.agentId,
        ...(params.name ? { name: params.name } : {}),
        ...(params.workspace ? { workspace: params.workspace } : {}),
        ...(params.model ? { model: params.model } : {}),
        ...(params.identity ? { identity: params.identity } : {}),
      });
      Object.assign(draft, latestNextConfig);
    },
  });
}

/** Reused helper for delete Agent Config Entry behavior in src/gateway/server-methods. */
export async function deleteAgentConfigEntry(params: { agentId: string }): Promise<{
  nextConfig: OpenClawConfig;
  result: AgentDeleteMutationResult | undefined;
}> {
  const committed = await mutateConfigFileWithRetry<AgentDeleteMutationResult>({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (!isConfiguredAgent(draft, params.agentId)) {
        throw new AgentConfigPreconditionError("not-found", params.agentId);
      }
      const workspaceDir = resolveAgentWorkspaceDir(draft, params.agentId);
      const agentDir = resolveAgentDir(draft, params.agentId);
      const sessionsDir = resolveSessionTranscriptsDirForAgent(params.agentId);
      const result = pruneAgentConfig(draft, params.agentId);
      Object.assign(draft, result.config);
      return {
        workspaceDir,
        agentDir,
        sessionsDir,
        removedBindings: result.removedBindings,
      };
    },
  });
  return {
    nextConfig: committed.nextConfig,
    result: committed.result,
  };
}
