/** Formats video generation task records for agent-visible status output. */
import type { TaskRecord } from "../tasks/task-registry.types.js";
import {
  buildActiveMediaGenerationTaskPromptContextForSession,
  buildMediaGenerationTaskStatusDetails,
  buildMediaGenerationTaskStatusText,
  findActiveMediaGenerationTaskForSession,
  findDuplicateGuardMediaGenerationTaskForSession,
  getMediaGenerationTaskProviderId,
  isActiveMediaGenerationTask,
} from "./media-generation-task-status-shared.js";

/** Reused constant for VIDEO GENERATION TASK KIND behavior in src/agents. */
export const VIDEO_GENERATION_TASK_KIND = "video_generation";
const VIDEO_GENERATION_SOURCE_PREFIX = "video_generate";
const RECENT_VIDEO_GENERATION_DUPLICATE_GUARD_MS = 2 * 60_000;

/** Reused helper for is Active Video Generation Task behavior in src/agents. */
export function isActiveVideoGenerationTask(task: TaskRecord): boolean {
  return isActiveMediaGenerationTask({
    task,
    taskKind: VIDEO_GENERATION_TASK_KIND,
  });
}

/** Reused helper for get Video Generation Task Provider Id behavior in src/agents. */
export function getVideoGenerationTaskProviderId(task: TaskRecord): string | undefined {
  return getMediaGenerationTaskProviderId(task, VIDEO_GENERATION_SOURCE_PREFIX);
}

/** Reused helper for find Active Video Generation Task For Session behavior in src/agents. */
export function findActiveVideoGenerationTaskForSession(
  sessionKey?: string,
): TaskRecord | undefined {
  return findActiveMediaGenerationTaskForSession({
    sessionKey,
    taskKind: VIDEO_GENERATION_TASK_KIND,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
  });
}

/** Reused helper for find Duplicate Guard Video Generation Task For Session behavior in src/agents. */
export function findDuplicateGuardVideoGenerationTaskForSession(
  sessionKey?: string,
  params?: { prompt?: string; requestKey?: string },
): TaskRecord | undefined {
  return findDuplicateGuardMediaGenerationTaskForSession({
    sessionKey,
    taskKind: VIDEO_GENERATION_TASK_KIND,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
    taskLabel: params?.prompt,
    requestKey: params?.requestKey,
    maxAgeMs: RECENT_VIDEO_GENERATION_DUPLICATE_GUARD_MS,
  });
}

/** Reused helper for build Video Generation Task Status Details behavior in src/agents. */
export function buildVideoGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown> {
  return buildMediaGenerationTaskStatusDetails({
    task,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
  });
}

/** Reused helper for build Video Generation Task Status Text behavior in src/agents. */
export function buildVideoGenerationTaskStatusText(
  task: TaskRecord,
  params?: { duplicateGuard?: boolean },
): string {
  return buildMediaGenerationTaskStatusText({
    task,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
    nounLabel: "Video generation",
    toolName: "video_generate",
    completionLabel: "video",
    duplicateGuard: params?.duplicateGuard,
  });
}

/** Reused helper for build Active Video Generation Task Prompt Context For Session behavior in src/agents. */
export function buildActiveVideoGenerationTaskPromptContextForSession(
  sessionKey?: string,
): string | undefined {
  return buildActiveMediaGenerationTaskPromptContextForSession({
    sessionKey,
    taskKind: VIDEO_GENERATION_TASK_KIND,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
    nounLabel: "Video generation",
    toolName: "video_generate",
    completionLabel: "videos",
  });
}
