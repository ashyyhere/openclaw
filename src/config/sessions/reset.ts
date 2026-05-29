// config/sessions reset helpers and runtime behavior.
import { resolveLoadedSessionThreadInfo } from "../../channels/plugins/session-thread-info-loaded.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalLowercaseString,
} from "../../shared/string-coerce.js";
import { normalizeMessageChannel } from "../../utils/message-channel.js";
import type { SessionConfig, SessionResetConfig } from "../types.base.js";
/** Re-exported API for src/config/sessions. */
export {
  DEFAULT_RESET_AT_HOUR,
  DEFAULT_RESET_MODE,
  evaluateSessionFreshness,
  resolveDailyResetAtMs,
  resolveSessionResetPolicy,
  type SessionFreshness,
  type SessionResetMode,
  type SessionResetPolicy,
  type SessionResetType,
} from "./reset-policy.js";
import type { SessionResetType } from "./reset-policy.js";

const GROUP_SESSION_MARKERS = [":group:", ":channel:"];

/** Reused helper for is Thread Session Key behavior in src/config/sessions. */
export function isThreadSessionKey(sessionKey?: string | null): boolean {
  return Boolean(resolveLoadedSessionThreadInfo(sessionKey).threadId);
}

/** Reused helper for resolve Session Reset Type behavior in src/config/sessions. */
export function resolveSessionResetType(params: {
  sessionKey?: string | null;
  isGroup?: boolean;
  isThread?: boolean;
}): SessionResetType {
  if (params.isThread || isThreadSessionKey(params.sessionKey)) {
    return "thread";
  }
  if (params.isGroup) {
    return "group";
  }
  const normalized = normalizeLowercaseStringOrEmpty(params.sessionKey);
  if (GROUP_SESSION_MARKERS.some((marker) => normalized.includes(marker))) {
    return "group";
  }
  return "direct";
}

/** Reused helper for resolve Thread Flag behavior in src/config/sessions. */
export function resolveThreadFlag(params: {
  sessionKey?: string | null;
  messageThreadId?: string | number | null;
  threadLabel?: string | null;
  threadStarterBody?: string | null;
  parentSessionKey?: string | null;
}): boolean {
  if (params.messageThreadId != null) {
    return true;
  }
  if (params.threadLabel?.trim()) {
    return true;
  }
  if (params.threadStarterBody?.trim()) {
    return true;
  }
  if (params.parentSessionKey?.trim()) {
    return true;
  }
  return isThreadSessionKey(params.sessionKey);
}

/** Reused helper for resolve Channel Reset Config behavior in src/config/sessions. */
export function resolveChannelResetConfig(params: {
  sessionCfg?: SessionConfig;
  channel?: string | null;
}): SessionResetConfig | undefined {
  const resetByChannel = params.sessionCfg?.resetByChannel;
  if (!resetByChannel) {
    return undefined;
  }
  const normalized = normalizeMessageChannel(params.channel);
  const fallback = normalizeOptionalLowercaseString(params.channel);
  const key = normalized ?? fallback;
  if (!key) {
    return undefined;
  }
  return resetByChannel[key];
}
