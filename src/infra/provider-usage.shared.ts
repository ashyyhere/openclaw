import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import type { UsageProviderId } from "./provider-usage.types.js";

/** Default timeout for provider usage fetch probes. */
export const DEFAULT_TIMEOUT_MS = 5000;

/** Human-readable labels for supported provider usage summaries. */
export const PROVIDER_LABELS: Record<UsageProviderId, string> = {
  anthropic: "Claude",
  "github-copilot": "Copilot",
  "google-gemini-cli": "Gemini",
  minimax: "MiniMax",
  "openai-codex": "Codex",
  xiaomi: "Xiaomi",
  "xiaomi-token-plan": "Xiaomi Token Plan",
  zai: "z.ai",
};

/** Provider ids included in usage reporting. */
export const usageProviders: UsageProviderId[] = [
  "anthropic",
  "github-copilot",
  "google-gemini-cli",
  "minimax",
  "openai-codex",
  "xiaomi",
  "xiaomi-token-plan",
  "zai",
];

export function resolveUsageProviderId(
  provider?: string | null,
  options?: { credentialType?: string | null },
): UsageProviderId | undefined {
  if (!provider) {
    return undefined;
  }
  const normalized = normalizeProviderId(provider);
  if (
    normalized === "openai" &&
    (options?.credentialType === "oauth" || options?.credentialType === "token")
  ) {
    return "openai-codex";
  }
  if (
    normalized === "minimax-portal" ||
    normalized === "minimax-cn" ||
    normalized === "minimax-portal-cn"
  ) {
    return "minimax";
  }
  return usageProviders.includes(normalized as UsageProviderId)
    ? (normalized as UsageProviderId)
    : undefined;
}

/** Usage fetch errors that should not be treated as noisy failures. */
export const ignoredErrors = new Set([
  "No credentials",
  "No token",
  "No API key",
  "Not logged in",
  "No auth",
]);

/** Clamp a numeric usage percentage into display bounds. */
export const clampPercent = (value: number) =>
  Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

/** Resolve work or return a fallback after the timeout. */
export const withTimeout = async <T>(work: Promise<T>, ms: number, fallback: T): Promise<T> => {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      work,
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};
