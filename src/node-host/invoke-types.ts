// Gateway payload/result contracts for node-host invoke requests.
import type { SkillBinTrustEntry, SystemRunApprovalPlan } from "../infra/exec-approvals.js";

/** Input payload for the node-host SYSTEM_RUN command. */
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

/** Normalized process execution result returned by node-host. */
export type RunResult = {
  exitCode?: number;
  timedOut: boolean;
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string | null;
  truncated: boolean;
};

/** Event payload emitted while node-host command execution progresses. */
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

/** Compact command result included in execution-finished events. */
export type ExecFinishedResult = {
  stdout?: string;
  stderr?: string;
  error?: string | null;
  exitCode?: number | null;
  timedOut?: boolean;
  success?: boolean;
};

/** Parameters for publishing a node-host execution-finished event. */
export type ExecFinishedEventParams = {
  sessionKey: string;
  runId: string;
  commandText: string;
  result: ExecFinishedResult;
  suppressNotifyOnExit?: boolean;
};

/** Provider for trusted skill binaries advertised by the connected gateway. */
export type SkillBinsProvider = {
  current(force?: boolean): Promise<SkillBinTrustEntry[]>;
};
