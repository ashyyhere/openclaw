// JSONL event log for memory recall, promotion, and dreaming activity.
import fs from "node:fs/promises";
import path from "node:path";
import { appendRegularFile } from "../infra/fs-safe.js";
import type { MemoryDreamingPhaseName } from "./dreaming.js";

/** Workspace-relative path for the memory host event log. */
export const MEMORY_HOST_EVENT_LOG_RELATIVE_PATH = path.join("memory", ".dreams", "events.jsonl");

/** Event written after a memory recall query is recorded. */
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

/** Event written when recalled memory candidates are promoted into durable memory. */
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

/** Event written after a dreaming phase emits inline, file, or combined output. */
export type MemoryHostDreamCompletedEvent = {
  type: "memory.dream.completed";
  timestamp: string;
  phase: MemoryDreamingPhaseName;
  inlinePath?: string;
  reportPath?: string;
  lineCount: number;
  storageMode: "inline" | "separate" | "both";
};

/** Union of memory host events persisted in the workspace JSONL log. */
export type MemoryHostEvent =
  | MemoryHostRecallRecordedEvent
  | MemoryHostPromotionAppliedEvent
  | MemoryHostDreamCompletedEvent;

/** Resolve the absolute memory host event-log path for a workspace. */
export function resolveMemoryHostEventLogPath(workspaceDir: string): string {
  return path.join(workspaceDir, MEMORY_HOST_EVENT_LOG_RELATIVE_PATH);
}

/** Append one memory host event to the workspace JSONL log using symlink-safe writes. */
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

/** Read recent memory host events, ignoring malformed JSONL rows. */
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
