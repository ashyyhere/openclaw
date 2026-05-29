/** Background task lifecycle wrappers for image generation. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentGeneratedAttachment } from "../generated-attachments.js";
import { IMAGE_GENERATION_TASK_KIND } from "../image-generation-task-status.js";
import {
  createMediaGenerationTaskLifecycle,
  type MediaGenerationTaskHandle,
} from "./media-generate-background-shared.js";

/** Shared type for Image Generation Task Handle in src/agents/tools. */
export type ImageGenerationTaskHandle = MediaGenerationTaskHandle;

/** Reused constant for image Generation Task Lifecycle behavior in src/agents/tools. */
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

/** Reused constant for create Image Generation Task Run behavior in src/agents/tools. */
export const createImageGenerationTaskRun = (
  ...params: Parameters<typeof imageGenerationTaskLifecycle.createTaskRun>
) => imageGenerationTaskLifecycle.createTaskRun(...params);

/** Reused constant for record Image Generation Task Progress behavior in src/agents/tools. */
export const recordImageGenerationTaskProgress = (
  ...params: Parameters<typeof imageGenerationTaskLifecycle.recordTaskProgress>
) => imageGenerationTaskLifecycle.recordTaskProgress(...params);

/** Reused constant for complete Image Generation Task Run behavior in src/agents/tools. */
export const completeImageGenerationTaskRun = (
  ...params: Parameters<typeof imageGenerationTaskLifecycle.completeTaskRun>
) => imageGenerationTaskLifecycle.completeTaskRun(...params);

/** Reused constant for fail Image Generation Task Run behavior in src/agents/tools. */
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
