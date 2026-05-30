// Shared data shapes for transcript usage, cost, latency, and log summaries.
import type { NormalizedUsage } from "../agents/usage.js";
import type {
  SessionUsageTimePoint as SharedSessionUsageTimePoint,
  SessionUsageTimeSeries as SharedSessionUsageTimeSeries,
} from "../shared/session-usage-timeseries-types.js";

/** Cost split by usage token category when provider pricing is known. */
export type CostBreakdown = {
  total?: number;
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
};

/** Usage event extracted from a transcript or usage sidecar file. */
export type ParsedUsageEntry = {
  usage: NormalizedUsage;
  costTotal?: number;
  costBreakdown?: CostBreakdown;
  provider?: string;
  model?: string;
  timestamp?: Date;
};

/** Normalized transcript message plus usage, timing, and tool metadata. */
export type ParsedTranscriptEntry = {
  message: Record<string, unknown>;
  role?: "user" | "assistant";
  timestamp?: Date;
  durationMs?: number;
  usage?: NormalizedUsage;
  costTotal?: number;
  costBreakdown?: CostBreakdown;
  provider?: string;
  model?: string;
  stopReason?: string;
  toolNames: string[];
  toolResultCounts: { total: number; errors: number };
};

/** Aggregate token and cost totals over sessions or date ranges. */
export type CostUsageTotals = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  totalTokens: number;
  totalCost: number;
  // Cost breakdown by token type (from actual API data when available)
  inputCost: number;
  outputCost: number;
  cacheReadCost: number;
  cacheWriteCost: number;
  missingCostEntries: number;
};

type CostUsageDailyEntry = CostUsageTotals & {
  date: string;
};

/** Date-bucketed cost usage summary with optional cache freshness metadata. */
export type CostUsageSummary = {
  updatedAt: number;
  days: number;
  daily: CostUsageDailyEntry[];
  totals: CostUsageTotals;
  cacheStatus?: {
    status: "fresh" | "partial" | "stale" | "refreshing";
    cachedFiles: number;
    pendingFiles: number;
    staleFiles: number;
    refreshedAt?: number;
  };
};

/** Cache freshness metadata attached to cost usage summaries. */
export type UsageCacheStatus = NonNullable<CostUsageSummary["cacheStatus"]>;

/** Per-day token/cost totals for one session. */
export type SessionDailyUsage = {
  date: string; // YYYY-MM-DD
  tokens: number;
  cost: number;
};

/** Per-day message, tool, and error counts for one session. */
export type SessionDailyMessageCounts = {
  date: string; // YYYY-MM-DD
  total: number;
  user: number;
  assistant: number;
  toolCalls: number;
  toolResults: number;
  errors: number;
};

/** UTC quarter-hour message counts used by usage activity mosaics. */
export type SessionUtcQuarterHourMessageCounts = {
  date: string; // YYYY-MM-DD (UTC)
  quarterIndex: number; // 0-95, UTC quarter-hour bucket (index = floor((utcH * 60 + utcM) / 15))
  total: number;
  user: number;
  assistant: number;
  toolCalls: number;
  toolResults: number;
  errors: number;
};

/** UTC quarter-hour token and cost totals used by usage mosaics. */
export type SessionUtcQuarterHourTokenUsage = {
  date: string; // YYYY-MM-DD (UTC)
  quarterIndex: number; // 0-95, UTC quarter-hour bucket (index = floor((utcH * 60 + utcM) / 15))
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  // Uses the same token total basis as CostUsageTotals: usage.total when present,
  // otherwise input + output + cacheRead + cacheWrite. This intentionally differs
  // from legacy dailyBreakdown.tokens, which preserves its existing component-sum
  // behavior until daily usage buckets are refactored separately.
  totalTokens: number;
  totalCost: number;
};

/** Latency aggregate for assistant turns with duration data. */
export type SessionLatencyStats = {
  count: number;
  avgMs: number;
  p95Ms: number;
  minMs: number;
  maxMs: number;
};

/** Per-day latency aggregate for one session. */
export type SessionDailyLatency = SessionLatencyStats & {
  date: string; // YYYY-MM-DD
};

/** Per-day usage grouped by provider/model for one session. */
export type SessionDailyModelUsage = {
  date: string; // YYYY-MM-DD
  provider?: string;
  model?: string;
  tokens: number;
  cost: number;
  count: number;
};

/** Total message, tool, and error counts for one session. */
export type SessionMessageCounts = {
  total: number;
  user: number;
  assistant: number;
  toolCalls: number;
  toolResults: number;
  errors: number;
};

/** Tool-call frequency summary for one session. */
export type SessionToolUsage = {
  totalCalls: number;
  uniqueTools: number;
  tools: Array<{ name: string; count: number }>;
};

/** Provider/model usage summary for one session. */
export type SessionModelUsage = {
  provider?: string;
  model?: string;
  count: number;
  totals: CostUsageTotals;
};

/** Full usage, cost, activity, latency, tool, and model summary for one session. */
export type SessionCostSummary = CostUsageTotals & {
  sessionId?: string;
  sessionFile?: string;
  firstActivity?: number;
  lastActivity?: number;
  durationMs?: number;
  activityDates?: string[]; // YYYY-MM-DD dates when session had activity
  dailyBreakdown?: SessionDailyUsage[]; // Per-day token/cost breakdown
  dailyMessageCounts?: SessionDailyMessageCounts[];
  utcQuarterHourMessageCounts?: SessionUtcQuarterHourMessageCounts[]; // UTC quarter-hour buckets for precise hourly stats
  utcQuarterHourTokenUsage?: SessionUtcQuarterHourTokenUsage[]; // UTC quarter-hour buckets for precise token mosaic stats
  dailyLatency?: SessionDailyLatency[];
  dailyModelUsage?: SessionDailyModelUsage[];
  messageCounts?: SessionMessageCounts;
  toolUsage?: SessionToolUsage;
  modelUsage?: SessionModelUsage[];
  latency?: SessionLatencyStats;
};

/** Session transcript discovered on disk for usage reporting. */
export type DiscoveredSession = {
  sessionId: string;
  sessionFile: string;
  mtime: number;
  firstUserMessage?: string;
};

/** Shared time-series point for cumulative session usage charts. */
export type SessionUsageTimePoint = SharedSessionUsageTimePoint;

/** Shared cumulative session usage time series. */
export type SessionUsageTimeSeries = SharedSessionUsageTimeSeries;

/** Display-ready session log entry with optional usage/cost metadata. */
export type SessionLogEntry = {
  timestamp: number;
  role: "user" | "assistant" | "tool" | "toolResult";
  content: string;
  tokens?: number;
  cost?: number;
};
