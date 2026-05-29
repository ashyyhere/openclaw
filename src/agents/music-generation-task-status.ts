/** Shared music generation task status conversion helpers. */
import type { TaskRecord } from "../tasks/task-registry.types.js";
import {
  buildActiveMediaGenerationTaskPromptContextForSession,
  buildMediaGenerationTaskStatusDetails,
  buildMediaGenerationTaskStatusText,
  findActiveMediaGenerationTaskForSession,
  findDuplicateGuardMediaGenerationTaskForSession,
} from "./media-generation-task-status-shared.js";

/** Reused constant for MUSIC GENERATION TASK KIND behavior in src/agents. */
export const MUSIC_GENERATION_TASK_KIND = "music_generation";
const MUSIC_GENERATION_SOURCE_PREFIX = "music_generate";
const RECENT_MUSIC_GENERATION_DUPLICATE_GUARD_MS = 2 * 60_000;

/** Reused helper for find Active Music Generation Task For Session behavior in src/agents. */
export function findActiveMusicGenerationTaskForSession(
  sessionKey?: string,
): TaskRecord | undefined {
  return findActiveMediaGenerationTaskForSession({
    sessionKey,
    taskKind: MUSIC_GENERATION_TASK_KIND,
    sourcePrefix: MUSIC_GENERATION_SOURCE_PREFIX,
  });
}

/** Reused helper for find Duplicate Guard Music Generation Task For Session behavior in src/agents. */
export function findDuplicateGuardMusicGenerationTaskForSession(
  sessionKey?: string,
  params?: { prompt?: string; requestKey?: string },
): TaskRecord | undefined {
  return findDuplicateGuardMediaGenerationTaskForSession({
    sessionKey,
    taskKind: MUSIC_GENERATION_TASK_KIND,
    sourcePrefix: MUSIC_GENERATION_SOURCE_PREFIX,
    taskLabel: params?.prompt,
    requestKey: params?.requestKey,
    maxAgeMs: RECENT_MUSIC_GENERATION_DUPLICATE_GUARD_MS,
  });
}

/** Reused helper for build Music Generation Task Status Details behavior in src/agents. */
export function buildMusicGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown> {
  return buildMediaGenerationTaskStatusDetails({
    task,
    sourcePrefix: MUSIC_GENERATION_SOURCE_PREFIX,
  });
}

/** Reused helper for build Music Generation Task Status Text behavior in src/agents. */
export function buildMusicGenerationTaskStatusText(
  task: TaskRecord,
  params?: { duplicateGuard?: boolean },
): string {
  return buildMediaGenerationTaskStatusText({
    task,
    sourcePrefix: MUSIC_GENERATION_SOURCE_PREFIX,
    nounLabel: "Music generation",
    toolName: "music_generate",
    completionLabel: "music",
    duplicateGuard: params?.duplicateGuard,
  });
}

/** Reused helper for build Active Music Generation Task Prompt Context For Session behavior in src/agents. */
export function buildActiveMusicGenerationTaskPromptContextForSession(
  sessionKey?: string,
): string | undefined {
  return buildActiveMediaGenerationTaskPromptContextForSession({
    sessionKey,
    taskKind: MUSIC_GENERATION_TASK_KIND,
    sourcePrefix: MUSIC_GENERATION_SOURCE_PREFIX,
    nounLabel: "Music generation",
    toolName: "music_generate",
    completionLabel: "music tracks",
  });
}
