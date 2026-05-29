/** Persists session quota/circuit suspension state and lane throttling. */
import path from "node:path";
import { resolveAgentMaxConcurrent, resolveSubagentMaxConcurrent } from "../config/agent-limits.js";
import { resolveCronMaxConcurrentRuns } from "../config/cron-limits.js";
import { applySessionStoreEntryPatch } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { setCommandLaneConcurrency } from "../process/command-queue.js";
import { resolveStoredSessionKeyForSessionId } from "./command/session.js";
import type { FailoverReason } from "./embedded-agent-helpers/types.js";

const log = createSubsystemLogger("session-suspension");

const DEFAULT_CUSTOM_LANE_RESUME_CONCURRENCY = 1;
/** Default automatic resume TTL for quota suspensions. */
export const DEFAULT_QUOTA_SUSPENSION_RESUME_MS = 30 * 60 * 1000; // 30 min

const laneResumeTimers = new Map<string, ReturnType<typeof setTimeout>>();

/** Persisted reason for suspending a session/lane after provider failure. */
export type SessionSuspensionReason = "quota_exhausted" | "manual" | "circuit_open";

function resolveLaneResumeConcurrency(cfg: OpenClawConfig | undefined, laneId: string): number {
  switch (laneId) {
    case "main":
      return resolveAgentMaxConcurrent(cfg);
    case "subagent":
      return resolveSubagentMaxConcurrent(cfg);
    case "cron":
    case "cron-nested":
      return resolveCronMaxConcurrentRuns(cfg?.cron);
    default:
      return DEFAULT_CUSTOM_LANE_RESUME_CONCURRENCY;
  }
}

/** Map failover reason to persisted session suspension reason. */
export function resolveSessionSuspensionReason(reason: FailoverReason): SessionSuspensionReason {
  if (reason === "billing") {
    return "manual";
  }
  if (reason === "rate_limit") {
    return "quota_exhausted";
  }
  return "circuit_open";
}

function scheduleLaneAutoResume(laneId: string, delayMs: number, resumeConcurrency: number) {
  const existing = laneResumeTimers.get(laneId);
  if (existing) {
    clearTimeout(existing);
  }
  const timer = setTimeout(() => {
    laneResumeTimers.delete(laneId);
    setCommandLaneConcurrency(laneId, resumeConcurrency);
    log.info("auto-resumed lane after suspension TTL", {
      laneId,
      delayMs,
      resumeConcurrency,
    });
  }, delayMs);
  if (typeof timer.unref === "function") {
    timer.unref();
  }
  laneResumeTimers.set(laneId, timer);
}

/** Cancel a scheduled auto-resume for a throttled command lane. */
export function cancelLaneAutoResume(laneId: string) {
  const existing = laneResumeTimers.get(laneId);
  if (existing) {
    clearTimeout(existing);
    laneResumeTimers.delete(laneId);
  }
}

/** Persist session suspension and temporarily throttle the affected lane. */
export async function suspendSession(params: {
  cfg: OpenClawConfig | undefined;
  agentDir?: string;
  sessionId: string;
  laneId?: string;
  reason: SessionSuspensionReason;
  failedProvider: string;
  failedModel: string;
  summary?: string;
  ttlMs?: number;
}) {
  if (!params.cfg) {
    return;
  }

  const { sessionKey, storePath } = resolveStoredSessionKeyForSessionId({
    cfg: params.cfg,
    sessionId: params.sessionId,
    agentId: params.agentDir ? path.basename(params.agentDir) : undefined,
  });

  if (!sessionKey) {
    return;
  }

  const ttlMs = params.ttlMs ?? DEFAULT_QUOTA_SUSPENSION_RESUME_MS;
  const now = Date.now();

  try {
    await applySessionStoreEntryPatch({
      storePath,
      sessionKey,
      skipMaintenance: true,
      takeCacheOwnership: true,
      patch: {
        quotaSuspension: {
          schemaVersion: 1,
          suspendedAt: now,
          reason: params.reason,
          failedProvider: params.failedProvider,
          failedModel: params.failedModel,
          summary: params.summary,
          laneId: params.laneId,
          expectedResumeBy: now + ttlMs,
          state: "suspended",
        },
      },
    });
  } catch (err) {
    log.warn("failed to persist quota suspension; not throttling lane", {
      sessionId: params.sessionId,
      laneId: params.laneId,
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }

  if (params.laneId) {
    setCommandLaneConcurrency(params.laneId, 0);
    scheduleLaneAutoResume(
      params.laneId,
      ttlMs,
      resolveLaneResumeConcurrency(params.cfg, params.laneId),
    );
  }
}

/** Reused constant for testing behavior in src/agents. */
export const testing = {
  resolveLaneResumeConcurrency,
  resolveSessionSuspensionReason,
} as const;
/** Re-exported API for src/agents, starting with testing. */
export { testing as __testing };
