// Shared types for tasks task registry control types behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Shared type for Cancel Acp Session Admin in src/tasks. */
export type CancelAcpSessionAdmin = (params: {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: string;
}) => Promise<void>;

/** Shared type for Kill Subagent Run Admin Result in src/tasks. */
export type KillSubagentRunAdminResult = {
  found: boolean;
  killed: boolean;
  runId?: string;
  sessionKey?: string;
  cascadeKilled?: number;
  cascadeLabels?: string[];
};

/** Shared type for Kill Subagent Run Admin in src/tasks. */
export type KillSubagentRunAdmin = (params: {
  cfg: OpenClawConfig;
  sessionKey: string;
}) => Promise<KillSubagentRunAdminResult>;

/** Shared type for Task Registry Control Runtime in src/tasks. */
export type TaskRegistryControlRuntime = {
  getAcpSessionManager: () => {
    cancelSession: CancelAcpSessionAdmin;
  };
  killSubagentRunAdmin: KillSubagentRunAdmin;
};
