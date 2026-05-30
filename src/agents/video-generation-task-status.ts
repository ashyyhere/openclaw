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

/** Task kind used for video generation entries in the shared task registry. */
export const VIDEO_GENERATION_TASK_KIND = "video_generation";
const VIDEO_GENERATION_SOURCE_PREFIX = "video_generate";
const RECENT_VIDEO_GENERATION_DUPLICATE_GUARD_MS = 2 * 60_000;

/** Return whether a task record is an active video generation run. */
export function isActiveVideoGenerationTask(task: TaskRecord): boolean {
  return isActiveMediaGenerationTask({
    task,
    taskKind: VIDEO_GENERATION_TASK_KIND,
  });
}

/** Extract the provider id encoded in a video generation task source. */
export function getVideoGenerationTaskProviderId(task: TaskRecord): string | undefined {
  return getMediaGenerationTaskProviderId(task, VIDEO_GENERATION_SOURCE_PREFIX);
}

/** Find the active video generation task associated with a session key. */
export function findActiveVideoGenerationTaskForSession(
  sessionKey?: string,
): TaskRecord | undefined {
  return findActiveMediaGenerationTaskForSession({
    sessionKey,
    taskKind: VIDEO_GENERATION_TASK_KIND,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
  });
}

/** Find a recent matching video generation task to suppress duplicate starts. */
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

/** Build structured status details for a video generation task. */
export function buildVideoGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown> {
  return buildMediaGenerationTaskStatusDetails({
    task,
    sourcePrefix: VIDEO_GENERATION_SOURCE_PREFIX,
  });
}

/** Build user-facing status text for a video generation task. */
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

/** Build prompt context that reminds the agent about an active video generation task. */
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
