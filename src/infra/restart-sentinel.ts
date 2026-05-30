/** Persists restart/update handoff state so the restarted gateway can report outcome. */
import fs from "node:fs/promises";
import path from "node:path";
import { formatCliCommand } from "../cli/command-format.js";
import { resolveStateDir } from "../config/paths.js";
import { isRecord as isPlainRecord } from "../shared/record-coerce.js";
import { resolveRuntimeServiceVersion } from "../version.js";
import { writeJson } from "./json-files.js";

/** Captured tail output from a restart or update step. */
export type RestartSentinelLog = {
  stdoutTail?: string | null;
  stderrTail?: string | null;
  exitCode?: number | null;
};

/** One command step recorded during restart/update orchestration. */
export type RestartSentinelStep = {
  name: string;
  command: string;
  cwd?: string | null;
  durationMs?: number | null;
  log?: RestartSentinelLog | null;
};

/** Structured restart/update details used for post-restart reporting. */
export type RestartSentinelStats = {
  mode?: string;
  root?: string;
  handoffId?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  steps?: RestartSentinelStep[];
  reason?: string | null;
  durationMs?: number | null;
};

/** Follow-up action to emit after the gateway consumes a successful sentinel. */
export type RestartSentinelContinuation =
  | {
      kind: "systemEvent";
      text: string;
    }
  | {
      kind: "agentTurn";
      message: string;
    };

/** Versioned payload written before restart and consumed after startup. */
export type RestartSentinelPayload = {
  kind: "config-apply" | "config-auto-recovery" | "config-patch" | "update" | "restart";
  status: "ok" | "error" | "skipped";
  ts: number;
  sessionKey?: string;
  /** Delivery context captured at restart time to ensure channel routing survives restart. */
  deliveryContext?: {
    channel?: string;
    to?: string;
    accountId?: string;
  };
  /** Thread ID for reply threading (e.g., Slack thread_ts). */
  threadId?: string;
  message?: string | null;
  continuation?: RestartSentinelContinuation | null;
  doctorHint?: string | null;
  stats?: RestartSentinelStats | null;
};

/** On-disk restart sentinel wrapper with schema version. */
export type RestartSentinel = {
  version: 1;
  payload: RestartSentinelPayload;
};

const SENTINEL_FILENAME = "restart-sentinel.json";

/** Format the doctor follow-up command for surfaces that cannot run approvals. */
export function formatDoctorNonInteractiveHint(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): string {
  return `Recommended follow-up: run ${formatCliCommand(
    "openclaw doctor --non-interactive",
    env,
  )} in a terminal or approvals-capable OpenClaw surface.`;
}

/** Resolve the state-file path used for restart sentinel handoff. */
export function resolveRestartSentinelPath(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(resolveStateDir(env), SENTINEL_FILENAME);
}

/** Write a restart sentinel payload with private state-directory permissions. */
export async function writeRestartSentinel(
  payload: RestartSentinelPayload,
  env: NodeJS.ProcessEnv = process.env,
) {
  const filePath = resolveRestartSentinelPath(env);
  const data: RestartSentinel = { version: 1, payload };
  await writeJson(filePath, data, { trailingNewline: true, dirMode: 0o700 });
  return filePath;
}

function cloneRestartSentinelPayload(payload: RestartSentinelPayload): RestartSentinelPayload {
  return JSON.parse(JSON.stringify(payload)) as RestartSentinelPayload;
}

async function rewriteRestartSentinel(
  rewrite: (payload: RestartSentinelPayload) => RestartSentinelPayload | null,
  env: NodeJS.ProcessEnv = process.env,
): Promise<RestartSentinel | null> {
  const current = await readRestartSentinel(env);
  if (!current) {
    return null;
  }
  const nextPayload = rewrite(cloneRestartSentinelPayload(current.payload));
  if (!nextPayload) {
    return null;
  }
  await writeRestartSentinel(nextPayload, env);
  return {
    version: 1,
    payload: nextPayload,
  };
}

/** Record the running version after an update restart succeeds. */
export async function finalizeUpdateRestartSentinelRunningVersion(
  version = resolveRuntimeServiceVersion(process.env),
  env: NodeJS.ProcessEnv = process.env,
): Promise<RestartSentinel | null> {
  return await rewriteRestartSentinel((payload) => {
    if (payload.kind !== "update") {
      return null;
    }
    const stats = payload.stats ? { ...payload.stats } : {};
    const after = isPlainRecord(stats.after) ? { ...stats.after } : {};
    after.version = version;
    stats.after = after;
    return {
      ...payload,
      stats,
    };
  }, env);
}

/** Mark an update sentinel as failed and suppress success continuation. */
export async function markUpdateRestartSentinelFailure(
  reason: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<RestartSentinel | null> {
  return await rewriteRestartSentinel((payload) => {
    if (payload.kind !== "update") {
      return null;
    }
    const payloadWithoutContinuation = { ...payload };
    delete payloadWithoutContinuation.continuation;
    const stats = payload.stats ? { ...payload.stats } : {};
    stats.reason = reason;
    return {
      ...payloadWithoutContinuation,
      status: "error",
      stats,
    };
  }, env);
}

/** Remove a sentinel file, ignoring races with startup cleanup. */
export async function removeRestartSentinelFile(filePath: string | null | undefined) {
  if (!filePath) {
    return;
  }
  await fs.unlink(filePath).catch(() => {});
}

/** Build the post-restart continuation only when a session can receive it. */
export function buildRestartSuccessContinuation(params: {
  sessionKey?: string;
  continuationMessage?: string | null;
}): RestartSentinelContinuation | null {
  const message = params.continuationMessage?.trim();
  if (message) {
    return { kind: "agentTurn", message };
  }
  return null;
}

/** Read the sentinel, deleting malformed or incompatible files. */
export async function readRestartSentinel(
  env: NodeJS.ProcessEnv = process.env,
): Promise<RestartSentinel | null> {
  const filePath = resolveRestartSentinelPath(env);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    let parsed: RestartSentinel | undefined;
    try {
      parsed = JSON.parse(raw) as RestartSentinel | undefined;
    } catch {
      await fs.unlink(filePath).catch(() => {});
      return null;
    }
    if (!parsed || parsed.version !== 1 || !parsed.payload) {
      await fs.unlink(filePath).catch(() => {});
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Check whether a sentinel handoff file exists without consuming it. */
export async function hasRestartSentinel(env: NodeJS.ProcessEnv = process.env): Promise<boolean> {
  try {
    await fs.access(resolveRestartSentinelPath(env));
    return true;
  } catch {
    return false;
  }
}

/** Read and remove the sentinel so restart reporting runs once. */
export async function consumeRestartSentinel(
  env: NodeJS.ProcessEnv = process.env,
): Promise<RestartSentinel | null> {
  const filePath = resolveRestartSentinelPath(env);
  const parsed = await readRestartSentinel(env);
  if (!parsed) {
    return null;
  }
  await removeRestartSentinelFile(filePath);
  return parsed;
}

/** Format the user/operator message from a consumed sentinel payload. */
export function formatRestartSentinelMessage(payload: RestartSentinelPayload): string {
  const message = payload.message?.trim();
  if (message && (!payload.stats || payload.kind === "config-auto-recovery")) {
    return message;
  }
  const lines: string[] = [summarizeRestartSentinel(payload)];
  if (message) {
    lines.push(message);
  }
  const reason = payload.stats?.reason?.trim();
  if (reason && reason !== message) {
    lines.push(`Reason: ${reason}`);
  }
  if (payload.doctorHint?.trim()) {
    lines.push(payload.doctorHint.trim());
  }
  return lines.join("\n");
}

/** Build the one-line restart/update outcome summary. */
export function summarizeRestartSentinel(payload: RestartSentinelPayload): string {
  if (payload.kind === "config-auto-recovery") {
    return "Gateway auto-recovery";
  }
  const kind = payload.kind;
  const status = payload.status;
  const mode = payload.stats?.mode ? ` (${payload.stats.mode})` : "";
  return `Gateway restart ${kind} ${status}${mode}`.trim();
}

/** Keep only the tail of large command logs stored in sentinel stats. */
export function trimLogTail(input?: string | null, maxChars = 8000) {
  if (!input) {
    return null;
  }
  const text = input.trimEnd();
  if (text.length <= maxChars) {
    return text;
  }
  return `…${text.slice(text.length - maxChars)}`;
}
