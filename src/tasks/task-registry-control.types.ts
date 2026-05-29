// Control-runtime contracts for cancelling ACP sessions and killing subagent runs.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Admin hook that cancels an ACP session with a reason. */
export type CancelAcpSessionAdmin = (params: {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: string;
}) => Promise<void>;

/** Result from attempting to kill a subagent run and any cascaded children. */
export type KillSubagentRunAdminResult = {
  found: boolean;
  killed: boolean;
  runId?: string;
  sessionKey?: string;
  cascadeKilled?: number;
  cascadeLabels?: string[];
};

/** Admin hook that kills the subagent run associated with a session key. */
export type KillSubagentRunAdmin = (params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}) => Promise<KillSubagentRunAdminResult>;

/** Runtime hooks used by task registry control surfaces. */
export type TaskRegistryControlRuntime = {
  getAcpSessionManager: () => {
    cancelSession: CancelAcpSessionAdmin;
  };
  killSubagentRunAdmin: KillSubagentRunAdmin;
};
