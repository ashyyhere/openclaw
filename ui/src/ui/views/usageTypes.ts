// Shared Usage view state contracts. These types separate loaded usage data,
// filters, display preferences, detail-panel state, and callbacks so the large
// usage page can stay split across render modules.
import type {
  CostUsageDailyEntry,
  SessionsUsageEntry,
  SessionsUsageResult,
  SessionsUsageTotals,
  SessionUsageTimePoint,
} from "../usage-types.ts";

/** Per-session usage row from the gateway usage endpoint. */
export type UsageSessionEntry = SessionsUsageEntry;
/** Aggregate token and cost totals for the current usage query. */
export type UsageTotals = SessionsUsageTotals;
/** Daily cost bucket used by overview charts. */
export type CostDailyEntry = CostUsageDailyEntry;
/** Additional grouped usage aggregates returned with session usage. */
export type UsageAggregates = SessionsUsageResult["aggregates"];

/** Toggleable columns in the usage sessions table. */
export type UsageColumnId =
  | "channel"
  | "agent"
  | "provider"
  | "model"
  | "messages"
  | "tools"
  | "errors"
  | "duration";

/** One point in the selected session time-series chart. */
export type TimeSeriesPoint = SessionUsageTimePoint;

/** Loaded usage data and fetch status for the Usage page. */
export type UsageDataState = {
  loading: boolean;
  error: string | null;
  sessions: UsageSessionEntry[];
  agents: string[];
  sessionsLimitReached: boolean; // True if 1000 session cap was hit
  totals: UsageTotals | null;
  aggregates: UsageAggregates | null;
  costDaily: CostDailyEntry[];
  cacheStatus: SessionsUsageResult["cacheStatus"];
};

/** Active filters and query draft state for usage exploration. */
export type UsageFilterState = {
  startDate: string;
  endDate: string;
  scope: "instance" | "family";
  selectedSessions: string[]; // Support multiple session selection
  selectedDays: string[]; // Support multiple day selection
  selectedHours: number[]; // Support multiple hour selection
  agentId: string | null;
  query: string;
  queryDraft: string;
  timeZone: "local" | "utc";
};

/** Local display preferences for charts, sorting, tabs, and visible columns. */
export type UsageDisplayState = {
  chartMode: "tokens" | "cost";
  dailyChartMode: "total" | "by-type";
  sessionSort: "tokens" | "cost" | "recent" | "messages" | "errors";
  sessionSortDir: "asc" | "desc";
  recentSessions: string[];
  sessionsTab: "all" | "recent";
  visibleColumns: UsageColumnId[];
  contextExpanded: boolean;
  headerPinned: boolean;
};

/** State for selected session details, time series, and session log filters. */
export type UsageDetailState = {
  timeSeriesMode: "cumulative" | "per-turn";
  timeSeriesBreakdownMode: "total" | "by-type";
  timeSeries: { points: TimeSeriesPoint[] } | null;
  timeSeriesLoading: boolean;
  timeSeriesCursorStart: number | null; // Start of selected range (null = no selection)
  timeSeriesCursorEnd: number | null; // End of selected range (null = no selection)
  sessionLogs: SessionLogEntry[] | null;
  sessionLogsLoading: boolean;
  sessionLogsExpanded: boolean;
  logFilters: {
    roles: SessionLogRole[];
    tools: string[];
    hasTools: boolean;
    query: string;
  };
};

/** View callbacks grouped by filter, display, and detail-panel responsibility. */
export type UsageCallbacks = {
  filters: {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onScopeChange: (scope: "instance" | "family") => void;
    onAgentChange: (agentId: string | null) => void;
    onRefresh: () => void;
    onTimeZoneChange: (zone: "local" | "utc") => void;
    onToggleHeaderPinned: () => void;
    onSelectDay: (day: string, shiftKey: boolean) => void; // Support shift-click
    onSelectHour: (hour: number, shiftKey: boolean) => void;
    onClearDays: () => void;
    onClearHours: () => void;
    onClearSessions: () => void;
    onClearFilters: () => void;
    onQueryDraftChange: (query: string) => void;
    onApplyQuery: () => void;
    onClearQuery: () => void;
  };
  display: {
    onChartModeChange: (mode: "tokens" | "cost") => void;
    onDailyChartModeChange: (mode: "total" | "by-type") => void;
    onSessionSortChange: (sort: "tokens" | "cost" | "recent" | "messages" | "errors") => void;
    onSessionSortDirChange: (dir: "asc" | "desc") => void;
    onSessionsTabChange: (tab: "all" | "recent") => void;
    onToggleColumn: (column: UsageColumnId) => void;
  };
  details: {
    onToggleContextExpanded: () => void;
    onToggleSessionLogsExpanded: () => void;
    onLogFilterRolesChange: (next: SessionLogRole[]) => void;
    onLogFilterToolsChange: (next: string[]) => void;
    onLogFilterHasToolsChange: (next: boolean) => void;
    onLogFilterQueryChange: (next: string) => void;
    onLogFilterClear: () => void;
    onSelectSession: (key: string, shiftKey: boolean) => void;
    onTimeSeriesModeChange: (mode: "cumulative" | "per-turn") => void;
    onTimeSeriesBreakdownChange: (mode: "total" | "by-type") => void;
    onTimeSeriesCursorRangeChange: (start: number | null, end: number | null) => void;
  };
};

/** Complete prop bundle consumed by the Usage page renderer. */
export type UsageProps = {
  data: UsageDataState;
  filters: UsageFilterState;
  display: UsageDisplayState;
  detail: UsageDetailState;
  callbacks: UsageCallbacks;
};

/** Normalized transcript/log row shown in selected-session usage details. */
export type SessionLogEntry = {
  timestamp: number;
  role: "user" | "assistant" | "tool" | "toolResult";
  content: string;
  tokens?: number;
  cost?: number;
};

/** Session log role filter values. */
export type SessionLogRole = SessionLogEntry["role"];
