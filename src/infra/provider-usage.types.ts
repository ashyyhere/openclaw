// Shared types for infra provider usage types behavior.
/** Shared type for Usage Window in src/infra. */
export type UsageWindow = {
  label: string;
  usedPercent: number;
  resetAt?: number;
};

/** Shared type for Provider Usage Snapshot in src/infra. */
export type ProviderUsageSnapshot = {
  provider: UsageProviderId;
  displayName: string;
  windows: UsageWindow[];
  plan?: string;
  error?: string;
};

/** Shared type for Usage Summary in src/infra. */
export type UsageSummary = {
  updatedAt: number;
  providers: ProviderUsageSnapshot[];
};

/** Shared type for Usage Provider Id in src/infra. */
export type UsageProviderId =
  | "anthropic"
  | "github-copilot"
  | "google-gemini-cli"
  | "minimax"
  | "openai-codex"
  | "xiaomi"
  | "xiaomi-token-plan"
  | "zai";
