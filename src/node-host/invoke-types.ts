// node-host invoke types helpers and runtime behavior.
import type { SkillBinTrustEntry, SystemRunApprovalPlan } from "../infra/exec-approvals.js";

/** Shared type for System Run Params in src/node-host. */
export type SystemRunParams = {
  command: string[];
  rawCommand?: string | null;
  systemRunPlan?: SystemRunApprovalPlan | null;
  cwd?: string | null;
  env?: Record<string, string>;
  timeoutMs?: number | null;
  needsScreenRecording?: boolean | null;
  agentId?: string | null;
  sessionKey?: string | null;
  approved?: boolean | null;
  approvalDecision?: string | null;
  runId?: string | null;
  suppressNotifyOnExit?: boolean | null;
};

/** Shared type for Run Result in src/node-host. */
export type RunResult = {
  exitCode?: number;
  timedOut: boolean;
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string | null;
  truncated: boolean;
};

/** Shared type for Exec Event Payload in src/node-host. */
export type ExecEventPayload = {
  sessionKey: string;
  runId: string;
  host: string;
  command?: string;
  exitCode?: number;
  timedOut?: boolean;
  success?: boolean;
  output?: string;
  reason?: string;
  suppressNotifyOnExit?: boolean;
};

/** Shared type for Exec Finished Result in src/node-host. */
export type ExecFinishedResult = {
  stdout?: string;
  stderr?: string;
  error?: string | null;
  exitCode?: number | null;
  timedOut?: boolean;
  success?: boolean;
};

/** Shared type for Exec Finished Event Params in src/node-host. */
export type ExecFinishedEventParams = {
  sessionKey: string;
  runId: string;
  commandText: string;
  result: ExecFinishedResult;
  suppressNotifyOnExit?: boolean;
};

/** Shared type for Skill Bins Provider in src/node-host. */
export type SkillBinsProvider = {
  current(force?: boolean): Promise<SkillBinTrustEntry[]>;
};
