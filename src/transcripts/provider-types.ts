// Transcript source provider contracts for live capture and post-hoc imports.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Transcript acquisition modes a provider can advertise. */
export type TranscriptSourceKind =
  | "live-audio"
  | "live-caption"
  | "posthoc-transcript"
  | "recording-stt";

/** Provider-specific address for a meeting, channel, file, or transcript source. */
export type TranscriptSourceLocator = {
  providerId: string;
  kind?: TranscriptSourceKind;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
  threadTs?: string;
  fileId?: string;
  [key: string]: string | undefined;
};

/** Speaker identity attached to transcript utterances. */
export type TranscriptParticipant = {
  id?: string;
  label: string;
};

/** Single transcript utterance emitted live or imported from text. */
export type TranscriptUtterance = {
  id?: string;
  sessionId?: string;
  startedAt?: string;
  endedAt?: string;
  speaker?: TranscriptParticipant;
  text: string;
  final?: boolean;
  metadata?: Record<string, unknown>;
};

/** Metadata that identifies and describes one transcript capture session. */
export type TranscriptSessionDescriptor = {
  sessionId: string;
  title?: string;
  source: TranscriptSourceLocator;
  startedAt: string;
  stoppedAt?: string;
  metadata?: Record<string, unknown>;
};

/** Request passed to providers that start live transcript capture. */
export type TranscriptStartRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  abortSignal?: AbortSignal;
  startupWaitMs?: number;
  onUtterance: (utterance: TranscriptUtterance) => void | Promise<void>;
  onStatus?: (status: TranscriptSourceStatus) => void | Promise<void>;
};

/** Result returned by live transcript start operations. */
export type TranscriptsStartResult =
  | {
      ok: true;
      session: TranscriptSessionDescriptor;
    }
  | {
      ok: false;
      error: string;
    };

/** Request passed to providers that stop live transcript capture. */
export type TranscriptStopRequest = {
  cfg?: OpenClawConfig;
  sessionId: string;
  source: TranscriptSourceLocator;
  reason?: string;
};

/** Result returned by live transcript stop operations. */
export type TranscriptsStopResult =
  | {
      ok: true;
      sessionId: string;
      stoppedAt?: string;
    }
  | {
      ok: false;
      error: string;
    };

/** Provider status entry for active or discoverable transcript sources. */
export type TranscriptSourceStatus = {
  sessionId?: string;
  active: boolean;
  message?: string;
  source?: TranscriptSourceLocator;
};

/** Request passed to providers that turn post-hoc text into utterances. */
export type TranscriptImportRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  text: string;
  speakerLabel?: string;
};

/** Plugin capability surface for transcript capture, import, status, and stop actions. */
export type TranscriptSourceProvider = {
  id: string;
  aliases?: readonly string[];
  name: string;
  sourceKinds: readonly TranscriptSourceKind[];
  start?: (request: TranscriptStartRequest) => Promise<TranscriptsStartResult>;
  stop?: (request: TranscriptStopRequest) => Promise<TranscriptsStopResult>;
  status?: (
    source: TranscriptSourceLocator,
    cfg?: OpenClawConfig,
  ) => Promise<TranscriptSourceStatus[]>;
  importTranscript?: (request: TranscriptImportRequest) => Promise<TranscriptUtterance[]>;
};
