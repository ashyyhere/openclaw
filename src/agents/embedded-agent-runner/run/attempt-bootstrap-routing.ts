/** Resolves which bootstrap context files should feed an embedded attempt. */
import type { BootstrapMode } from "../../bootstrap-mode.js";
import { resolveBootstrapMode } from "../../bootstrap-mode.js";
import { DEFAULT_BOOTSTRAP_FILENAME, type WorkspaceBootstrapFile } from "../../workspace.js";

/** Shared type for Attempt Bootstrap Routing Input in src/agents/embedded-agent-runner. */
export type AttemptBootstrapRoutingInput = {
  workspaceBootstrapPending: boolean;
  bootstrapContextRunKind?: "default" | "heartbeat" | "cron";
  trigger?: string;
  sessionKey?: string;
  isPrimaryRun: boolean;
  isCanonicalWorkspace?: boolean;
  effectiveWorkspace: string;
  resolvedWorkspace: string;
  hasBootstrapFileAccess: boolean;
};

/** Shared type for Attempt Bootstrap Routing in src/agents/embedded-agent-runner. */
export type AttemptBootstrapRouting = {
  bootstrapMode: BootstrapMode;
  includeBootstrapInSystemContext: boolean;
  includeBootstrapInRuntimeContext: boolean;
};

/** Shared type for Attempt Workspace Bootstrap Routing Input in src/agents/embedded-agent-runner. */
export type AttemptWorkspaceBootstrapRoutingInput = Omit<
  AttemptBootstrapRoutingInput,
  "workspaceBootstrapPending"
> & {
  isWorkspaceBootstrapPending: (workspaceDir: string) => Promise<boolean>;
  bootstrapFiles?: readonly WorkspaceBootstrapFile[];
};

/** Selects bootstrap injection targets for default, heartbeat, and cron attempts. */
export function resolveBootstrapContextTargets(params: {
  bootstrapMode: BootstrapMode;
}): Pick<
  AttemptBootstrapRouting,
  "includeBootstrapInSystemContext" | "includeBootstrapInRuntimeContext"
> {
  return {
    includeBootstrapInSystemContext: params.bootstrapMode === "full",
    includeBootstrapInRuntimeContext: false,
  };
}

function resolveAttemptBootstrapRouting(
  params: AttemptBootstrapRoutingInput,
): AttemptBootstrapRouting {
  const bootstrapMode = resolveBootstrapMode({
    bootstrapPending: params.workspaceBootstrapPending,
    runKind: params.bootstrapContextRunKind ?? "default",
    isInteractiveUserFacing: params.trigger === "user" || params.trigger === "manual",
    isPrimaryRun: params.isPrimaryRun,
    isCanonicalWorkspace:
      (params.isCanonicalWorkspace ?? true) &&
      params.effectiveWorkspace === params.resolvedWorkspace,
    hasBootstrapFileAccess: params.hasBootstrapFileAccess,
  });

  return {
    bootstrapMode,
    ...resolveBootstrapContextTargets({ bootstrapMode }),
  };
}

/** Checks whether any bootstrap file has content worth injecting. */
export function hasBootstrapFileContent(files?: readonly WorkspaceBootstrapFile[]): boolean {
  return (
    files?.some(
      (file) =>
        file.name === DEFAULT_BOOTSTRAP_FILENAME &&
        !file.missing &&
        typeof file.content === "string" &&
        file.content.trim().length > 0,
    ) ?? false
  );
}

/** Resolves workspace bootstrap routing after pending-file content is loaded. */
export async function resolveAttemptWorkspaceBootstrapRouting(
  params: AttemptWorkspaceBootstrapRoutingInput,
): Promise<AttemptBootstrapRouting> {
  const workspaceBootstrapPending = await params.isWorkspaceBootstrapPending(
    params.resolvedWorkspace,
  );
  const hasHookBootstrapContent = hasBootstrapFileContent(params.bootstrapFiles);
  return resolveAttemptBootstrapRouting({
    ...params,
    workspaceBootstrapPending: workspaceBootstrapPending || hasHookBootstrapContent,
    hasBootstrapFileAccess: params.hasBootstrapFileAccess || hasHookBootstrapContent,
  });
}
