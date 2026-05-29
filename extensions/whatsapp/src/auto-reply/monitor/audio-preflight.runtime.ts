// Runtime boundary for extensions/whatsapp/src/auto-reply/monitor audio preflight runtime behavior.
import { transcribeFirstAudio as transcribeFirstAudioImpl } from "openclaw/plugin-sdk/media-runtime";

type TranscribeFirstAudio = typeof import("openclaw/plugin-sdk/media-runtime").transcribeFirstAudio;

export async function transcribeFirstAudio(
  ...args: Parameters<TranscribeFirstAudio>
): ReturnType<TranscribeFirstAudio> {
  return await transcribeFirstAudioImpl(...args);
}
