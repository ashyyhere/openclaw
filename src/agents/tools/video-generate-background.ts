/** Background task lifecycle wrappers for video generation. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentGeneratedAttachment } from "../generated-attachments.js";
import { VIDEO_GENERATION_TASK_KIND } from "../video-generation-task-status.js";
import {
  createMediaGenerationTaskLifecycle,
  type MediaGenerationTaskHandle,
} from "./media-generate-background-shared.js";

/** Shared type for Video Generation Task Handle in src/agents/tools. */
export type VideoGenerationTaskHandle = MediaGenerationTaskHandle;

/** Reused constant for video Generation Task Lifecycle behavior in src/agents/tools. */
export const videoGenerationTaskLifecycle = createMediaGenerationTaskLifecycle({
  toolName: "video_generate",
  taskKind: VIDEO_GENERATION_TASK_KIND,
  label: "Video generation",
  queuedProgressSummary: "Queued video generation",
  generatedLabel: "video",
  failureProgressSummary: "Video generation failed",
  eventSource: "video_generation",
  announceType: "video generation task",
  completionLabel: "video",
});

/** Reused constant for create Video Generation Task Run behavior in src/agents/tools. */
export const createVideoGenerationTaskRun = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.createTaskRun>
) => videoGenerationTaskLifecycle.createTaskRun(...params);

/** Reused constant for record Video Generation Task Progress behavior in src/agents/tools. */
export const recordVideoGenerationTaskProgress = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.recordTaskProgress>
) => videoGenerationTaskLifecycle.recordTaskProgress(...params);

/** Reused constant for complete Video Generation Task Run behavior in src/agents/tools. */
export const completeVideoGenerationTaskRun = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.completeTaskRun>
) => videoGenerationTaskLifecycle.completeTaskRun(...params);

/** Reused constant for fail Video Generation Task Run behavior in src/agents/tools. */
export const failVideoGenerationTaskRun = (
  ...params: Parameters<typeof videoGenerationTaskLifecycle.failTaskRun>
) => videoGenerationTaskLifecycle.failTaskRun(...params);

/** Wakes a video generation task and delivers completion output. */
export async function wakeVideoGenerationTaskCompletion(params: {
  config?: OpenClawConfig;
  handle: VideoGenerationTaskHandle | null;
  status: "ok" | "error";
  statusLabel: string;
  result: string;
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
}) {
  return await videoGenerationTaskLifecycle.wakeTaskCompletion(params);
}
