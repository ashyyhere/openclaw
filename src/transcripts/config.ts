// Transcript feature config normalization and auto-start defaults.
import { normalizeOptionalString as readString } from "../shared/string-coerce.js";

/** Raw config entry describing a transcript source to start automatically. */
export type TranscriptsAutoStartConfig = {
  providerId: string;
  sessionId?: string;
  title?: string;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
};

/** Normalized auto-start entry with empty fields removed. */
export type ResolvedTranscriptsAutoStartConfig = {
  providerId: string;
  sessionId?: string;
  title?: string;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
};

/** Raw transcript feature config from OpenClaw configuration. */
export type TranscriptsConfig = {
  enabled?: boolean;
  maxUtterances?: number;
  autoStart?: TranscriptsAutoStartConfig[];
};

/** Effective transcript config after defaults and bounds are applied. */
export type ResolvedTranscriptsConfig = {
  enabled: boolean;
  maxUtterances: number;
  autoStart: ResolvedTranscriptsAutoStartConfig[];
};

function resolveAutoStart(raw: unknown): ResolvedTranscriptsAutoStartConfig[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry): ResolvedTranscriptsAutoStartConfig | undefined => {
      const config = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
      const providerId = readString(config.providerId);
      if (!providerId) {
        return undefined;
      }
      return {
        providerId,
        sessionId: readString(config.sessionId),
        title: readString(config.title),
        accountId: readString(config.accountId),
        guildId: readString(config.guildId),
        channelId: readString(config.channelId),
        meetingUrl: readString(config.meetingUrl),
      };
    })
    .filter((entry): entry is ResolvedTranscriptsAutoStartConfig => entry !== undefined);
}

/** Resolves transcript feature config with bounded utterance retention. */
export function resolveTranscriptsConfig(raw: unknown): ResolvedTranscriptsConfig {
  const config = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const maxUtterances =
    typeof config.maxUtterances === "number" && Number.isFinite(config.maxUtterances)
      ? Math.max(1, Math.min(10_000, Math.floor(config.maxUtterances)))
      : 2_000;
  return {
    enabled: config.enabled === true,
    maxUtterances,
    autoStart: resolveAutoStart(config.autoStart),
  };
}
