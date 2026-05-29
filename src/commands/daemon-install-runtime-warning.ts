/** Warns when daemon install runtime differs from the system Node runtime. */
import { renderSystemNodeWarning, resolveSystemNodeInfo } from "../daemon/runtime-paths.js";

/** Shared type for Daemon Install Warn Fn in src/commands. */
export type DaemonInstallWarnFn = (message: string, title?: string) => void;

/** Reused helper for emit Node Runtime Warning behavior in src/commands. */
export async function emitNodeRuntimeWarning(params: {
  env: Record<string, string | undefined>;
  runtime: string;
  nodeProgram?: string;
  warn?: DaemonInstallWarnFn;
  title: string;
}): Promise<void> {
  if (params.runtime !== "node") {
    return;
  }
  const systemNode = await resolveSystemNodeInfo({ env: params.env });
  const warning = renderSystemNodeWarning(systemNode, params.nodeProgram);
  if (warning) {
    params.warn?.(warning, params.title);
  }
}
