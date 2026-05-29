import { resolveDateTimestampMs } from "../shared/number-coercion.js";
import {
  type TimeFormatPreference,
  formatUserTime,
  resolveUserTimeFormat,
  resolveUserTimezone,
} from "./date-time.js";

/** Resolved current-time prompt fields for cron-style messages. */
export type CronStyleNow = {
  userTimezone: string;
  formattedTime: string;
  timeLine: string;
};

type TimeConfigLike = {
  agents?: {
    defaults?: {
      userTimezone?: string;
      timeFormat?: TimeFormatPreference;
    };
  };
};

/** Resolve localized current-time and reference UTC lines. */
export function resolveCronStyleNow(cfg: TimeConfigLike, nowMs: number): CronStyleNow {
  const userTimezone = resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
  const userTimeFormat = resolveUserTimeFormat(cfg.agents?.defaults?.timeFormat);
  const timestampMs = resolveDateTimestampMs(nowMs);
  const date = new Date(timestampMs);
  const formattedTime = formatUserTime(date, userTimezone, userTimeFormat) ?? date.toISOString();
  const utcTime = date.toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const timeLine = `Current time: ${formattedTime} (${userTimezone})\nReference UTC: ${utcTime}`;
  return { userTimezone, formattedTime, timeLine };
}

/** Append current-time lines unless the prompt already contains them. */
export function appendCronStyleCurrentTimeLine(text: string, cfg: TimeConfigLike, nowMs: number) {
  const base = text.trimEnd();
  if (!base || base.includes("Current time:")) {
    return base;
  }
  const { timeLine } = resolveCronStyleNow(cfg, nowMs);
  return `${base}\n${timeLine}`;
}
