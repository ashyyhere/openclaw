/** Provider contracts for realtime transcription session plugins. */
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Stable id for a realtime transcription provider. */
export type RealtimeTranscriptionProviderId = string;

/** Provider-specific realtime transcription configuration block. */
export type RealtimeTranscriptionProviderConfig = Record<string, unknown>;

/** Context passed when a provider resolves its configured runtime settings. */
export type RealtimeTranscriptionProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeTranscriptionProviderConfig;
};

/** Runtime context passed to providers after configuration is resolved. */
export type RealtimeTranscriptionProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};

/** Callbacks emitted by a realtime transcription session. */
export type RealtimeTranscriptionSessionCallbacks = {
  onPartial?: (partial: string) => void;
  onTranscript?: (transcript: string) => void;
  onSpeechStart?: () => void;
  onError?: (error: Error) => void;
};

/** Provider request for creating a realtime transcription session. */
export type RealtimeTranscriptionSessionCreateRequest = RealtimeTranscriptionSessionCallbacks & {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};

/** Live transcription session interface implemented by providers. */
export type RealtimeTranscriptionSession = {
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  close(): void;
  isConnected(): boolean;
};
