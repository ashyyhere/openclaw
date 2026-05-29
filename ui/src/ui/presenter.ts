// Formatting helpers for Control UI display text. These keep raw gateway
// payloads out of templates by converting presence, session, cron, and event
// data into compact localized labels.
import { t } from "../i18n/index.ts";
import { resolveCronJobLastRunStatus } from "./cron-status.ts";
import {
  formatDateMs,
  formatRelativeTimestamp,
  formatDurationHuman,
  formatMs,
  formatUnknownText,
} from "./format.ts";
import type { CronJob, GatewaySessionRow, PresenceEntry } from "./types.ts";

/** Format a gateway presence row into a compact host/mode/version label. */
export function formatPresenceSummary(entry: PresenceEntry): string {
  const host = entry.host ?? "unknown";
  const ip = entry.ip ? `(${entry.ip})` : "";
  const mode = entry.mode ?? "";
  const version = entry.version ?? "";
  return `${host} ${ip} ${mode} ${version}`.trim();
}

/** Format the relative age of the last presence heartbeat. */
export function formatPresenceAge(entry: PresenceEntry): string {
  const ts = entry.ts ?? null;
  return ts ? formatRelativeTimestamp(ts) : t("common.na");
}

/** Format a next-run timestamp with weekday and relative time. */
export function formatNextRun(ms?: number | null) {
  if (!ms) {
    return t("common.na");
  }
  const weekday = formatDateMs(ms, { weekday: "short" });
  if (weekday === t("common.na")) {
    return weekday;
  }
  return `${weekday}, ${formatMs(ms)} (${formatRelativeTimestamp(ms)})`;
}

/** Format session token usage against its context window. */
export function formatSessionTokens(row: GatewaySessionRow) {
  if (row.totalTokens == null) {
    return t("common.na");
  }
  const total = row.totalTokens ?? 0;
  const ctx = row.contextTokens ?? 0;
  return ctx ? `${total} / ${ctx}` : String(total);
}

/** Pretty-print event payloads for the debug panel. */
export function formatEventPayload(payload: unknown): string {
  if (payload == null) {
    return "";
  }
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return formatUnknownText(payload);
  }
}

/** Summarize cron runtime state with last and next run timestamps. */
export function formatCronState(job: CronJob) {
  const state = job.state ?? {};
  const next = state.nextRunAtMs ? formatMs(state.nextRunAtMs) : t("common.na");
  const last = state.lastRunAtMs ? formatMs(state.lastRunAtMs) : t("common.na");
  const status = resolveCronJobLastRunStatus(job);
  return `${status} · next ${next} · last ${last}`;
}

/** Format a cron schedule regardless of at/every/cron mode. */
export function formatCronSchedule(job: CronJob) {
  const s = job.schedule;
  if (s.kind === "at") {
    const atMs = Date.parse(s.at);
    return Number.isFinite(atMs) ? `At ${formatMs(atMs)}` : `At ${s.at}`;
  }
  if (s.kind === "every") {
    return `Every ${formatDurationHuman(s.everyMs)}`;
  }
  return `Cron ${s.expr}${s.tz ? ` (${s.tz})` : ""}`;
}

/** Summarize the scheduled payload and optional delivery target. */
export function formatCronPayload(job: CronJob) {
  const p = job.payload;
  if (p.kind === "systemEvent") {
    return `System: ${p.text}`;
  }
  const base = `Agent: ${p.message}`;
  const delivery = job.delivery;
  if (delivery && delivery.mode !== "none") {
    const target =
      delivery.mode === "webhook"
        ? delivery.to
          ? ` (${delivery.to})`
          : ""
        : delivery.channel || delivery.to
          ? ` (${delivery.channel ?? "last"}${delivery.to ? ` -> ${delivery.to}` : ""})`
          : "";
    return `${base} · ${delivery.mode}${target}`;
  }
  return base;
}
