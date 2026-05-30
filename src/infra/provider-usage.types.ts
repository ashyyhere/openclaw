// Shared provider usage summary types.
/** Usage percentage and reset metadata for one provider quota window. */
export type UsageWindow = {
  label: string;
  usedPercent: number;
  resetAt?: number;
};

/** Usage state for one provider, including optional plan or error text. */
export type ProviderUsageSnapshot = {
  provider: UsageProviderId;
  displayName: string;
  windows: UsageWindow[];
  plan?: string;
  error?: string;
};

/** Timestamped usage snapshot collection. */
export type UsageSummary = {
  updatedAt: number;
  providers: ProviderUsageSnapshot[];
};

/** Provider ids supported by usage summary loading. */
export type UsageProviderId =
  | "anthropic"
  | "github-copilot"
  | "google-gemini-cli"
  | "minimax"
  | "openai-codex"
  | "xiaomi"
  | "xiaomi-token-plan"
  | "zai";
