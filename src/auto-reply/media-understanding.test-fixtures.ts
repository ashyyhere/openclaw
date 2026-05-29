// Shared media understanding decision fixtures for auto-reply tests.
import type { MediaUnderstandingDecision } from "../media-understanding/types.js";

function createSuccessfulMediaDecision(
  capability: "audio" | "image" | "video",
): MediaUnderstandingDecision {
  return {
    capability,
    outcome: "success",
    attachments: [
      {
        attachmentIndex: 0,
        attempts: [
          {
            type: "provider",
            outcome: "success",
            provider: "openai",
            model: "gpt-5.4",
          },
        ],
        chosen: {
          type: "provider",
          outcome: "success",
          provider: "openai",
          model: "gpt-5.4",
        },
      },
    ],
  };
}

/** Reused helper for create Successful Audio Media Decision behavior in src/auto-reply. */
export function createSuccessfulAudioMediaDecision() {
  return createSuccessfulMediaDecision("audio");
}

/** Reused helper for create Successful Image Media Decision behavior in src/auto-reply. */
export function createSuccessfulImageMediaDecision() {
  return createSuccessfulMediaDecision("image");
}
