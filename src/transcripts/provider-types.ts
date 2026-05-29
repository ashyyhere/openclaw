// transcripts provider types helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Shared type for Transcript Source Kind in src/transcripts. */
export type TranscriptSourceKind =
  | "live-audio"
  | "live-caption"
  | "posthoc-transcript"
  | "recording-stt";

/** Shared type for Transcript Source Locator in src/transcripts. */
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

/** Shared type for Transcript Participant in src/transcripts. */
export type TranscriptParticipant = {
  id?: string;
  label: string;
};

/** Shared type for Transcript Utterance in src/transcripts. */
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

/** Shared type for Transcript Session Descriptor in src/transcripts. */
export type TranscriptSessionDescriptor = {
  sessionId: string;
  title?: string;
  source: TranscriptSourceLocator;
  startedAt: string;
  stoppedAt?: string;
  metadata?: Record<string, unknown>;
};

/** Shared type for Transcript Start Request in src/transcripts. */
export type TranscriptStartRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  abortSignal?: AbortSignal;
  startupWaitMs?: number;
  onUtterance: (utterance: TranscriptUtterance) => void | Promise<void>;
  onStatus?: (status: TranscriptSourceStatus) => void | Promise<void>;
};

/** Shared type for Transcripts Start Result in src/transcripts. */
export type TranscriptsStartResult =
  | {
      ok: true;
      session: TranscriptSessionDescriptor;
    }
  | {
      ok: false;
      error: string;
    };

/** Shared type for Transcript Stop Request in src/transcripts. */
export type TranscriptStopRequest = {
  cfg?: OpenClawConfig;
  sessionId: string;
  source: TranscriptSourceLocator;
  reason?: string;
};

/** Shared type for Transcripts Stop Result in src/transcripts. */
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

/** Shared type for Transcript Source Status in src/transcripts. */
export type TranscriptSourceStatus = {
  sessionId?: string;
  active: boolean;
  message?: string;
  source?: TranscriptSourceLocator;
};

/** Shared type for Transcript Import Request in src/transcripts. */
export type TranscriptImportRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  text: string;
  speakerLabel?: string;
};

/** Shared type for Transcript Source Provider in src/transcripts. */
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
