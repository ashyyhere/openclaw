/** In-memory registry for foreground/background bash process sessions. */
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { EventSessionRoutingPolicy } from "../infra/event-session-routing.js";
import type { TerminationReason } from "../process/supervisor/types.js";
import type { DeliveryContext } from "../utils/delivery-context.js";
import { readEnvInt } from "./bash-tools.shared.js";
import { createSessionSlug as createSessionSlugId } from "./session-slug.js";

const DEFAULT_JOB_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MIN_JOB_TTL_MS = 60 * 1000; // 1 minute
const MAX_JOB_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours
const DEFAULT_PENDING_OUTPUT_CHARS = 30_000;

function clampTtl(value: number | undefined) {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_JOB_TTL_MS;
  }
  return Math.min(Math.max(value, MIN_JOB_TTL_MS), MAX_JOB_TTL_MS);
}

let jobTtlMs = clampTtl(readEnvInt("OPENCLAW_BASH_JOB_TTL_MS", "PI_BASH_JOB_TTL_MS"));

/** Shared type for Process Status in src/agents. */
export type ProcessStatus = "running" | "completed" | "failed" | "killed";

/** Shared type for Session Stdin in src/agents. */
export type SessionStdin = {
  write: (data: string, cb?: (err?: Error | null) => void) => void;
  end: () => void;
  // When backed by a real Node stream (child.stdin), this exists; for PTY wrappers it may not.
  destroy?: () => void;
  destroyed?: boolean;
  writable?: boolean;
  writableEnded?: boolean;
  writableFinished?: boolean;
};

/** Shared type for Process Session in src/agents. */
export interface ProcessSession {
  id: string;
  command: string;
  scopeKey?: string;
  sessionKey?: string;
  /** `session.mainKey` from the runtime config, snapshotted at exec start.
   *  Used by background-exit notifications to remap cron-run keys to the
   *  agent's main queue without an ambient config load. If config changes
   *  while the process runs, the exit notification follows the start-time
   *  session contract. */
  mainKey?: string;
  /** `session.scope` from the runtime config; required so the cron-run remap
   *  can route global-scope agents to the literal "global" queue instead
   *  of an agent-main queue the heartbeat never drains. Snapshotted with
   *  `mainKey` for the same start-time routing reason. */
  sessionScope?: "per-sender" | "global";
  /** Start-time routing policy for detached exec system events. */
  eventRouting?: EventSessionRoutingPolicy;
  notifyDeliveryContext?: DeliveryContext;
  notifyOnExit?: boolean;
  notifyOnExitEmptySuccess?: boolean;
  exitNotified?: boolean;
  child?: ChildProcessWithoutNullStreams;
  stdin?: SessionStdin;
  pid?: number;
  startedAt: number;
  cwd?: string;
  maxOutputChars: number;
  pendingMaxOutputChars?: number;
  totalOutputChars: number;
  pendingStdout: string[];
  pendingStderr: string[];
  pendingStdoutChars: number;
  pendingStderrChars: number;
  aggregated: string;
  tail: string;
  exitCode?: number | null;
  exitSignal?: NodeJS.Signals | number | null;
  exitReason?: TerminationReason;
  exited: boolean;
  truncated: boolean;
  backgrounded: boolean;
  /** PTY cursor key mode: unknown until a PTY reports smkx/rmkx. */
  cursorKeyMode: "unknown" | "normal" | "application";
}

/** Shared type for Finished Session in src/agents. */
export interface FinishedSession {
  id: string;
  command: string;
  scopeKey?: string;
  startedAt: number;
  endedAt: number;
  cwd?: string;
  status: ProcessStatus;
  exitCode?: number | null;
  exitSignal?: NodeJS.Signals | number | null;
  exitReason?: TerminationReason;
  aggregated: string;
  tail: string;
  truncated: boolean;
  totalOutputChars: number;
}

const runningSessions = new Map<string, ProcessSession>();
const finishedSessions = new Map<string, FinishedSession>();

let sweeper: NodeJS.Timeout | null = null;

function isSessionIdTaken(id: string) {
  return runningSessions.has(id) || finishedSessions.has(id);
}

/** Create an unused process session slug. */
export function createSessionSlug(): string {
  return createSessionSlugId(isSessionIdTaken);
}

/** Add a running process session to the registry. */
export function addSession(session: ProcessSession) {
  runningSessions.set(session.id, session);
  startSweeper();
}

/** Lookup a running process session. */
export function getSession(id: string) {
  return runningSessions.get(id);
}

/** Lookup a finished process session. */
export function getFinishedSession(id: string) {
  return finishedSessions.get(id);
}

/** Delete running and finished process state for a session id. */
export function deleteSession(id: string) {
  runningSessions.delete(id);
  finishedSessions.delete(id);
}

/** Append process output while maintaining bounded pending/tail buffers. */
export function appendOutput(session: ProcessSession, stream: "stdout" | "stderr", chunk: string) {
  session.pendingStdout ??= [];
  session.pendingStderr ??= [];
  session.pendingStdoutChars ??= sumPendingChars(session.pendingStdout);
  session.pendingStderrChars ??= sumPendingChars(session.pendingStderr);
  const buffer = stream === "stdout" ? session.pendingStdout : session.pendingStderr;
  const bufferChars = stream === "stdout" ? session.pendingStdoutChars : session.pendingStderrChars;
  const pendingCap = Math.min(
    session.pendingMaxOutputChars ?? DEFAULT_PENDING_OUTPUT_CHARS,
    session.maxOutputChars,
  );
  buffer.push(chunk);
  let pendingChars = bufferChars + chunk.length;
  if (pendingChars > pendingCap) {
    session.truncated = true;
    pendingChars = capPendingBuffer(buffer, pendingChars, pendingCap);
  }
  if (stream === "stdout") {
    session.pendingStdoutChars = pendingChars;
  } else {
    session.pendingStderrChars = pendingChars;
  }
  session.totalOutputChars += chunk.length;
  const aggregated = trimWithCap(session.aggregated + chunk, session.maxOutputChars);
  session.truncated =
    session.truncated || aggregated.length < session.aggregated.length + chunk.length;
  session.aggregated = aggregated;
  session.tail = tail(session.aggregated, 2000);
}

/** Reused helper for drain Session behavior in src/agents. */
export function drainSession(session: ProcessSession) {
  const stdout = session.pendingStdout.join("");
  const stderr = session.pendingStderr.join("");
  session.pendingStdout = [];
  session.pendingStderr = [];
  session.pendingStdoutChars = 0;
  session.pendingStderrChars = 0;
  return { stdout, stderr };
}

/** Reused helper for mark Exited behavior in src/agents. */
export function markExited(
  session: ProcessSession,
  exitCode: number | null,
  exitSignal: NodeJS.Signals | number | null,
  status: ProcessStatus,
  exitReason?: TerminationReason,
) {
  session.exited = true;
  session.exitCode = exitCode;
  session.exitSignal = exitSignal;
  session.exitReason = exitReason;
  session.tail = tail(session.aggregated, 2000);
  moveToFinished(session, status);
}

/** Reused helper for mark Backgrounded behavior in src/agents. */
export function markBackgrounded(session: ProcessSession) {
  session.backgrounded = true;
}

function moveToFinished(session: ProcessSession, status: ProcessStatus) {
  runningSessions.delete(session.id);

  // Clean up child process stdio streams to prevent FD leaks
  if (session.child) {
    // Destroy stdio streams to release file descriptors
    session.child.stdin?.destroy?.();
    session.child.stdout?.destroy?.();
    session.child.stderr?.destroy?.();

    // Remove all event listeners to prevent memory leaks
    session.child.removeAllListeners();

    // Clear the reference
    delete session.child;
  }

  // Clean up stdin wrapper - call destroy if available, otherwise just remove reference
  if (session.stdin) {
    // Try to call destroy/end method if exists
    if (typeof session.stdin.destroy === "function") {
      session.stdin.destroy();
    } else if (typeof session.stdin.end === "function") {
      session.stdin.end();
    }
    // Only set flag if writable
    try {
      (session.stdin as { destroyed?: boolean }).destroyed = true;
    } catch {
      // Ignore if read-only
    }
    delete session.stdin;
  }

  if (!session.backgrounded) {
    return;
  }
  finishedSessions.set(session.id, {
    id: session.id,
    command: session.command,
    scopeKey: session.scopeKey,
    startedAt: session.startedAt,
    endedAt: Date.now(),
    cwd: session.cwd,
    status,
    exitCode: session.exitCode,
    exitSignal: session.exitSignal,
    exitReason: session.exitReason,
    aggregated: session.aggregated,
    tail: session.tail,
    truncated: session.truncated,
    totalOutputChars: session.totalOutputChars,
  });
}

/** Reused helper for tail behavior in src/agents. */
export function tail(text: string, max = 2000) {
  if (text.length <= max) {
    return text;
  }
  return text.slice(text.length - max);
}

function sumPendingChars(buffer: string[]) {
  let total = 0;
  for (const chunk of buffer) {
    total += chunk.length;
  }
  return total;
}

function capPendingBuffer(buffer: string[], pendingChars: number, cap: number) {
  if (pendingChars <= cap) {
    return pendingChars;
  }
  const last = buffer.at(-1);
  if (last && last.length >= cap) {
    buffer.length = 0;
    buffer.push(last.slice(last.length - cap));
    return cap;
  }
  let dropCount = 0;
  while (dropCount < buffer.length) {
    const chunk = buffer[dropCount];
    if (chunk === undefined || pendingChars - chunk.length < cap) {
      break;
    }
    pendingChars -= chunk.length;
    dropCount += 1;
  }
  if (dropCount > 0) {
    buffer.splice(0, dropCount);
  }
  if (buffer.length && pendingChars > cap) {
    const overflow = pendingChars - cap;
    buffer[0] = buffer[0].slice(overflow);
    pendingChars = cap;
  }
  return pendingChars;
}

/** Reused helper for trim With Cap behavior in src/agents. */
export function trimWithCap(text: string, max: number) {
  if (text.length <= max) {
    return text;
  }
  return text.slice(text.length - max);
}

/** Reused helper for list Running Sessions behavior in src/agents. */
export function listRunningSessions() {
  return Array.from(runningSessions.values()).filter((s) => s.backgrounded);
}

/** Reused helper for list Finished Sessions behavior in src/agents. */
export function listFinishedSessions() {
  return Array.from(finishedSessions.values());
}

/** Reused helper for clear Finished behavior in src/agents. */
export function clearFinished() {
  finishedSessions.clear();
}

/** Reused helper for reset Process Registry For Tests behavior in src/agents. */
export function resetProcessRegistryForTests() {
  runningSessions.clear();
  finishedSessions.clear();
  stopSweeper();
}

/** Reused helper for set Job Ttl Ms behavior in src/agents. */
export function setJobTtlMs(value?: number) {
  if (value === undefined || Number.isNaN(value)) {
    return;
  }
  jobTtlMs = clampTtl(value);
  stopSweeper();
  startSweeper();
}

function pruneFinishedSessions() {
  const cutoff = Date.now() - jobTtlMs;
  for (const [id, session] of finishedSessions.entries()) {
    if (session.endedAt < cutoff) {
      finishedSessions.delete(id);
    }
  }
}

function startSweeper() {
  if (sweeper) {
    return;
  }
  sweeper = setInterval(pruneFinishedSessions, Math.max(30_000, jobTtlMs / 6));
  sweeper.unref?.();
}

function stopSweeper() {
  if (!sweeper) {
    return;
  }
  clearInterval(sweeper);
  sweeper = null;
}
