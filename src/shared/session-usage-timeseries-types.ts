// shared session usage timeseries types helpers and runtime behavior.
/** Shared type for Session Usage Time Point in src/shared. */
export type SessionUsageTimePoint = {
  timestamp: number;
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  totalTokens: number;
  cost: number;
  cumulativeTokens: number;
  cumulativeCost: number;
};

/** Shared type for Session Usage Time Series in src/shared. */
export type SessionUsageTimeSeries = {
  sessionId?: string;
  points: SessionUsageTimePoint[];
};
