// Shared types for infra session cost usage types behavior.
import type { NormalizedUsage } from "../agents/usage.js";
import type {
  SessionUsageTimePoint as SharedSessionUsageTimePoint,
  SessionUsageTimeSeries as SharedSessionUsageTimeSeries,
} from "../shared/session-usage-timeseries-types.js";

/** Shared type for Cost Breakdown in src/infra. */
export type CostBreakdown = {
  total?: number;
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
};

/** Shared type for Parsed Usage Entry in src/infra. */
export type ParsedUsageEntry = {
  usage: NormalizedUsage;
  costTotal?: number;
  costBreakdown?: CostBreakdown;
  provider?: string;
  model?: string;
  timestamp?: Date;
};

/** Shared type for Parsed Transcript Entry in src/infra. */
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

/** Shared type for Cost Usage Totals in src/infra. */
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

/** Shared type for Cost Usage Summary in src/infra. */
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

/** Shared type for Usage Cache Status in src/infra. */
export type UsageCacheStatus = NonNullable<CostUsageSummary["cacheStatus"]>;

/** Shared type for Session Daily Usage in src/infra. */
export type SessionDailyUsage = {
  date: string; // YYYY-MM-DD
  tokens: number;
  cost: number;
};

/** Shared type for Session Daily Message Counts in src/infra. */
export type SessionDailyMessageCounts = {
  date: string; // YYYY-MM-DD
  total: number;
  user: number;
  assistant: number;
  toolCalls: number;
  toolResults: number;
  errors: number;
};

/** Shared type for Session Utc Quarter Hour Message Counts in src/infra. */
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

/** Shared type for Session Utc Quarter Hour Token Usage in src/infra. */
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

/** Shared type for Session Latency Stats in src/infra. */
export type SessionLatencyStats = {
  count: number;
  avgMs: number;
  p95Ms: number;
  minMs: number;
  maxMs: number;
};

/** Shared type for Session Daily Latency in src/infra. */
export type SessionDailyLatency = SessionLatencyStats & {
  date: string; // YYYY-MM-DD
};

/** Shared type for Session Daily Model Usage in src/infra. */
export type SessionDailyModelUsage = {
  date: string; // YYYY-MM-DD
  provider?: string;
  model?: string;
  tokens: number;
  cost: number;
  count: number;
};

/** Shared type for Session Message Counts in src/infra. */
export type SessionMessageCounts = {
  total: number;
  user: number;
  assistant: number;
  toolCalls: number;
  toolResults: number;
  errors: number;
};

/** Shared type for Session Tool Usage in src/infra. */
export type SessionToolUsage = {
  totalCalls: number;
  uniqueTools: number;
  tools: Array<{ name: string; count: number }>;
};

/** Shared type for Session Model Usage in src/infra. */
export type SessionModelUsage = {
  provider?: string;
  model?: string;
  count: number;
  totals: CostUsageTotals;
};

/** Shared type for Session Cost Summary in src/infra. */
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

/** Shared type for Discovered Session in src/infra. */
export type DiscoveredSession = {
  sessionId: string;
  sessionFile: string;
  mtime: number;
  firstUserMessage?: string;
};

/** Shared type for Session Usage Time Point in src/infra. */
export type SessionUsageTimePoint = SharedSessionUsageTimePoint;

/** Shared type for Session Usage Time Series in src/infra. */
export type SessionUsageTimeSeries = SharedSessionUsageTimeSeries;

/** Shared type for Session Log Entry in src/infra. */
export type SessionLogEntry = {
  timestamp: number;
  role: "user" | "assistant" | "tool" | "toolResult";
  content: string;
  tokens?: number;
  cost?: number;
};
