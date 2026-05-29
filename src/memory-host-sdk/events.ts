// memory-host-sdk events helpers and runtime behavior.
import fs from "node:fs/promises";
import path from "node:path";
import { appendRegularFile } from "../infra/fs-safe.js";
import type { MemoryDreamingPhaseName } from "./dreaming.js";

/** Reused constant for MEMORY HOST EVENT LOG RELATIVE PATH behavior in src/memory-host-sdk. */
export const MEMORY_HOST_EVENT_LOG_RELATIVE_PATH = path.join("memory", ".dreams", "events.jsonl");

/** Shared type for Memory Host Recall Recorded Event in src/memory-host-sdk. */
export type MemoryHostRecallRecordedEvent = {
  type: "memory.recall.recorded";
  timestamp: string;
  query: string;
  resultCount: number;
  results: Array<{
    path: string;
    startLine: number;
    endLine: number;
    score: number;
  }>;
};

/** Shared type for Memory Host Promotion Applied Event in src/memory-host-sdk. */
export type MemoryHostPromotionAppliedEvent = {
  type: "memory.promotion.applied";
  timestamp: string;
  memoryPath: string;
  applied: number;
  candidates: Array<{
    key: string;
    path: string;
    startLine: number;
    endLine: number;
    score: number;
    recallCount: number;
  }>;
};

/** Shared type for Memory Host Dream Completed Event in src/memory-host-sdk. */
export type MemoryHostDreamCompletedEvent = {
  type: "memory.dream.completed";
  timestamp: string;
  phase: MemoryDreamingPhaseName;
  inlinePath?: string;
  reportPath?: string;
  lineCount: number;
  storageMode: "inline" | "separate" | "both";
};

/** Shared type for Memory Host Event in src/memory-host-sdk. */
export type MemoryHostEvent =
  | MemoryHostRecallRecordedEvent
  | MemoryHostPromotionAppliedEvent
  | MemoryHostDreamCompletedEvent;

/** Reused helper for resolve Memory Host Event Log Path behavior in src/memory-host-sdk. */
export function resolveMemoryHostEventLogPath(workspaceDir: string): string {
  return path.join(workspaceDir, MEMORY_HOST_EVENT_LOG_RELATIVE_PATH);
}

/** Reused helper for append Memory Host Event behavior in src/memory-host-sdk. */
export async function appendMemoryHostEvent(
  workspaceDir: string,
  event: MemoryHostEvent,
): Promise<void> {
  const eventLogPath = resolveMemoryHostEventLogPath(workspaceDir);
  await fs.mkdir(path.dirname(eventLogPath), { recursive: true });
  await appendRegularFile({
    filePath: eventLogPath,
    content: `${JSON.stringify(event)}\n`,
    rejectSymlinkParents: true,
  });
}

/** Reused helper for read Memory Host Events behavior in src/memory-host-sdk. */
export async function readMemoryHostEvents(params: {
  workspaceDir: string;
  limit?: number;
}): Promise<MemoryHostEvent[]> {
  const eventLogPath = resolveMemoryHostEventLogPath(params.workspaceDir);
  const raw = await fs.readFile(eventLogPath, "utf8").catch((err: unknown) => {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      return "";
    }
    throw err;
  });
  if (!raw.trim()) {
    return [];
  }
  const events = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as MemoryHostEvent];
      } catch {
        return [];
      }
    });
  if (!Number.isFinite(params.limit)) {
    return events;
  }
  const limit = Math.max(0, Math.floor(params.limit as number));
  return limit === 0 ? [] : events.slice(-limit);
}
