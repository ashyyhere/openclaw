// realtime-transcription provider types helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Shared type for Realtime Transcription Provider Id in src/realtime-transcription. */
export type RealtimeTranscriptionProviderId = string;

/** Shared type for Realtime Transcription Provider Config in src/realtime-transcription. */
export type RealtimeTranscriptionProviderConfig = Record<string, unknown>;

/** Shared type for Realtime Transcription Provider Resolve Config Context in src/realtime-transcription. */
export type RealtimeTranscriptionProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeTranscriptionProviderConfig;
};

/** Shared type for Realtime Transcription Provider Configured Context in src/realtime-transcription. */
export type RealtimeTranscriptionProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};

/** Shared type for Realtime Transcription Session Callbacks in src/realtime-transcription. */
export type RealtimeTranscriptionSessionCallbacks = {
  onPartial?: (partial: string) => void;
  onTranscript?: (transcript: string) => void;
  onSpeechStart?: () => void;
  onError?: (error: Error) => void;
};

/** Shared type for Realtime Transcription Session Create Request in src/realtime-transcription. */
export type RealtimeTranscriptionSessionCreateRequest = RealtimeTranscriptionSessionCallbacks & {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};

/** Shared type for Realtime Transcription Session in src/realtime-transcription. */
export type RealtimeTranscriptionSession = {
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  close(): void;
  isConnected(): boolean;
};
