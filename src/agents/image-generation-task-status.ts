/** Image-generation task lookup and prompt status helpers. */
import type { TaskRecord } from "../tasks/task-registry.types.js";
import {
  buildActiveMediaGenerationTaskPromptContextForSession,
  buildMediaGenerationTaskStatusDetails,
  buildMediaGenerationTaskStatusListDetails,
  buildMediaGenerationTaskStatusListText,
  buildMediaGenerationTaskStatusText,
  findActiveMediaGenerationTaskForSession,
  findDuplicateGuardMediaGenerationTaskForSession,
  getMediaGenerationTaskProviderId,
  isActiveMediaGenerationTask,
  listActiveMediaGenerationTasksForSession,
} from "./media-generation-task-status-shared.js";

/** Task kind used for image-generation jobs. */
export const IMAGE_GENERATION_TASK_KIND = "image_generation";
const IMAGE_GENERATION_SOURCE_PREFIX = "image_generate";
const RECENT_IMAGE_GENERATION_DUPLICATE_GUARD_MS = 2 * 60_000;

/** Return whether a task is an active image-generation task. */
export function isActiveImageGenerationTask(task: TaskRecord): boolean {
  return isActiveMediaGenerationTask({
    task,
    taskKind: IMAGE_GENERATION_TASK_KIND,
  });
}

/** Extract provider id from an image-generation task. */
export function getImageGenerationTaskProviderId(task: TaskRecord): string | undefined {
  return getMediaGenerationTaskProviderId(task, IMAGE_GENERATION_SOURCE_PREFIX);
}

/** Find the active image-generation task for a session. */
export function findActiveImageGenerationTaskForSession(
  sessionKey?: string,
  params?: { prompt?: string },
): TaskRecord | undefined {
  return findActiveMediaGenerationTaskForSession({
    sessionKey,
    taskKind: IMAGE_GENERATION_TASK_KIND,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
    taskLabel: params?.prompt,
  });
}

/** List active image-generation tasks for a session. */
export function listActiveImageGenerationTasksForSession(sessionKey?: string): TaskRecord[] {
  return listActiveMediaGenerationTasksForSession({
    sessionKey,
    taskKind: IMAGE_GENERATION_TASK_KIND,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
  });
}

/** Find a recent duplicate-guard image-generation task for a session. */
export function findDuplicateGuardImageGenerationTaskForSession(
  sessionKey?: string,
  params?: { prompt?: string; requestKey?: string },
): TaskRecord | undefined {
  return findDuplicateGuardMediaGenerationTaskForSession({
    sessionKey,
    taskKind: IMAGE_GENERATION_TASK_KIND,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
    taskLabel: params?.prompt,
    requestKey: params?.requestKey,
    maxAgeMs: RECENT_IMAGE_GENERATION_DUPLICATE_GUARD_MS,
  });
}

/** Build structured status details for one image-generation task. */
export function buildImageGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown> {
  return buildMediaGenerationTaskStatusDetails({
    task,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
  });
}

/** Build structured status details for several image-generation tasks. */
export function buildImageGenerationTaskStatusListDetails(
  tasks: TaskRecord[],
): Record<string, unknown> {
  return buildMediaGenerationTaskStatusListDetails({
    tasks,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
  });
}

/** Build user-facing status text for one image-generation task. */
export function buildImageGenerationTaskStatusText(
  task: TaskRecord,
  params?: { duplicateGuard?: boolean },
): string {
  return buildMediaGenerationTaskStatusText({
    task,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
    nounLabel: "Image generation",
    toolName: "image_generate",
    completionLabel: "image",
    duplicateGuard: params?.duplicateGuard,
  });
}

/** Build user-facing status text for several image-generation tasks. */
export function buildImageGenerationTaskStatusListText(tasks: TaskRecord[]): string {
  return buildMediaGenerationTaskStatusListText({
    tasks,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
    nounLabel: "Image generation",
    toolName: "image_generate",
    completionLabel: "images",
  });
}

/** Build prompt context for active image-generation work in a session. */
export function buildActiveImageGenerationTaskPromptContextForSession(
  sessionKey?: string,
): string | undefined {
  return buildActiveMediaGenerationTaskPromptContextForSession({
    sessionKey,
    taskKind: IMAGE_GENERATION_TASK_KIND,
    sourcePrefix: IMAGE_GENERATION_SOURCE_PREFIX,
    nounLabel: "Image generation",
    toolName: "image_generate",
    completionLabel: "images",
  });
}
