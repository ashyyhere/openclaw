/** Applies workspace-only path guards to the nodes tool. */
import { wrapToolWorkspaceRootGuardWithOptions } from "./agent-tools.read.js";
import type { ToolFsPolicy } from "./tool-fs-policy.js";
import type { AnyAgentTool } from "./tools/common.js";

/** Wrap nodes tool outputs/paths when fs policy restricts access to workspace. */
export function applyNodesToolWorkspaceGuard(
  nodesToolBase: AnyAgentTool,
  options: {
    fsPolicy?: ToolFsPolicy;
    sandboxContainerWorkdir?: string;
    sandboxRoot?: string;
    workspaceDir: string;
  },
): AnyAgentTool {
  if (options.fsPolicy?.workspaceOnly !== true) {
    return nodesToolBase;
  }
  return wrapToolWorkspaceRootGuardWithOptions(
    nodesToolBase,
    options.sandboxRoot ?? options.workspaceDir,
    {
      containerWorkdir: options.sandboxContainerWorkdir,
      normalizeGuardedPathParams: true,
      pathParamKeys: ["outPath"],
    },
  );
}
