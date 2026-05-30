/** Background task lifecycle wrappers for image generation. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentGeneratedAttachment } from "../generated-attachments.js";
import { IMAGE_GENERATION_TASK_KIND } from "../image-generation-task-status.js";
import {
  createMediaGenerationTaskLifecycle,
  type MediaGenerationTaskHandle,
} from "./media-generate-background-shared.js";

/** Handle for an active or resumable background image generation task. */
export type ImageGenerationTaskHandle = MediaGenerationTaskHandle;

/** Image generation lifecycle configured with image-specific progress and completion labels. */
export const imageGenerationTaskLifecycle = createMediaGenerationTaskLifecycle({
  toolName: "image_generate",
  taskKind: IMAGE_GENERATION_TASK_KIND,
  label: "Image generation",
  queuedProgressSummary: "Queued image generation",
  generatedLabel: "image",
  failureProgressSummary: "Image generation failed",
  eventSource: "image_generation",
  announceType: "image generation task",
  completionLabel: "image",
});

/** Starts a tracked image generation task run. */
export const createImageGenerationTaskRun = (
  ...params: Parameters<typeof imageGenerationTaskLifecycle.createTaskRun>
) => imageGenerationTaskLifecycle.createTaskRun(...params);

/** Records progress for a tracked image generation task run. */
export const recordImageGenerationTaskProgress = (
  ...params: Parameters<typeof imageGenerationTaskLifecycle.recordTaskProgress>
) => imageGenerationTaskLifecycle.recordTaskProgress(...params);

/** Marks a tracked image generation task run complete. */
export const completeImageGenerationTaskRun = (
  ...params: Parameters<typeof imageGenerationTaskLifecycle.completeTaskRun>
) => imageGenerationTaskLifecycle.completeTaskRun(...params);

/** Marks a tracked image generation task run failed. */
export const failImageGenerationTaskRun = (
  ...params: Parameters<typeof imageGenerationTaskLifecycle.failTaskRun>
) => imageGenerationTaskLifecycle.failTaskRun(...params);

/** Wakes an image generation task and delivers completion output. */
export async function wakeImageGenerationTaskCompletion(params: {
  config?: OpenClawConfig;
  handle: ImageGenerationTaskHandle | null;
  status: "ok" | "error";
  statusLabel: string;
  result: string;
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
}) {
  return await imageGenerationTaskLifecycle.wakeTaskCompletion(params);
}
