/** Background task lifecycle wrappers for music generation. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AgentGeneratedAttachment } from "../generated-attachments.js";
import { MUSIC_GENERATION_TASK_KIND } from "../music-generation-task-status.js";
import {
  createMediaGenerationTaskLifecycle,
  type MediaGenerationTaskHandle,
} from "./media-generate-background-shared.js";

/** Shared type for Music Generation Task Handle in src/agents/tools. */
export type MusicGenerationTaskHandle = MediaGenerationTaskHandle;

/** Reused constant for music Generation Task Lifecycle behavior in src/agents/tools. */
export const musicGenerationTaskLifecycle = createMediaGenerationTaskLifecycle({
  toolName: "music_generate",
  taskKind: MUSIC_GENERATION_TASK_KIND,
  label: "Music generation",
  queuedProgressSummary: "Queued music generation",
  generatedLabel: "track",
  failureProgressSummary: "Music generation failed",
  eventSource: "music_generation",
  announceType: "music generation task",
  completionLabel: "music",
});

/** Reused constant for create Music Generation Task Run behavior in src/agents/tools. */
export const createMusicGenerationTaskRun = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.createTaskRun>
) => musicGenerationTaskLifecycle.createTaskRun(...params);

/** Reused constant for record Music Generation Task Progress behavior in src/agents/tools. */
export const recordMusicGenerationTaskProgress = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.recordTaskProgress>
) => musicGenerationTaskLifecycle.recordTaskProgress(...params);

/** Reused constant for complete Music Generation Task Run behavior in src/agents/tools. */
export const completeMusicGenerationTaskRun = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.completeTaskRun>
) => musicGenerationTaskLifecycle.completeTaskRun(...params);

/** Reused constant for fail Music Generation Task Run behavior in src/agents/tools. */
export const failMusicGenerationTaskRun = (
  ...params: Parameters<typeof musicGenerationTaskLifecycle.failTaskRun>
) => musicGenerationTaskLifecycle.failTaskRun(...params);

/** Wakes a music generation task and delivers completion output. */
export async function wakeMusicGenerationTaskCompletion(params: {
  config?: OpenClawConfig;
  handle: MusicGenerationTaskHandle | null;
  status: "ok" | "error";
  statusLabel: string;
  result: string;
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
}) {
  return await musicGenerationTaskLifecycle.wakeTaskCompletion(params);
}
