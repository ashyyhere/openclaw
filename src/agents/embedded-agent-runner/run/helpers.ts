/** Shared small helpers for embedded-run retry, usage, and result metadata. */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import { generateSecureToken } from "../../../infra/secure-random.js";
import type { AssistantMessage } from "../../../llm/types.js";
import { extractAssistantTextForPhase } from "../../../shared/chat-message-content.js";
import { resolveAgentConfig } from "../../agent-scope-config.js";
import { extractAssistantVisibleText } from "../../embedded-agent-utils.js";
import { derivePromptTokens, normalizeUsage } from "../../usage.js";
import type { EmbeddedAgentMeta } from "../types.js";
import { toLastCallUsage, toNormalizedUsage, type UsageAccumulator } from "../usage-accumulator.js";

type UsageSnapshot = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  total?: number;
};

/** Mutable runtime auth refresh state for one provider/auth profile. */
export type RuntimeAuthState = {
  generation: number;
  sourceApiKey: string;
  authMode: string;
  profileId?: string;
  expiresAt?: number;
  refreshTimer?: ReturnType<typeof setTimeout>;
  refreshInFlight?: Promise<void>;
};

/** Refresh credentials this long before their reported expiration. */
export const RUNTIME_AUTH_REFRESH_MARGIN_MS = 5 * 60 * 1000;
/** Retry delay after a failed runtime credential refresh. */
export const RUNTIME_AUTH_REFRESH_RETRY_MS = 60 * 1000;
/** Minimum timer delay when scheduling runtime credential refresh. */
export const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS = 5 * 1000;

const DEFAULT_OVERLOAD_FAILOVER_BACKOFF_MS = 0;
const DEFAULT_MAX_OVERLOAD_PROFILE_ROTATIONS = 1;
const DEFAULT_MAX_RATE_LIMIT_PROFILE_ROTATIONS = 1;

/** Reads the configured delay before retrying after provider overload. */
export function resolveOverloadFailoverBackoffMs(cfg?: OpenClawConfig): number {
  return cfg?.auth?.cooldowns?.overloadedBackoffMs ?? DEFAULT_OVERLOAD_FAILOVER_BACKOFF_MS;
}

/** Reads how many auth profiles may be tried after overload errors. */
export function resolveOverloadProfileRotationLimit(cfg?: OpenClawConfig): number {
  return cfg?.auth?.cooldowns?.overloadedProfileRotations ?? DEFAULT_MAX_OVERLOAD_PROFILE_ROTATIONS;
}

/** Reads how many auth profiles may be tried after rate-limit errors. */
export function resolveRateLimitProfileRotationLimit(cfg?: OpenClawConfig): number {
  return (
    cfg?.auth?.cooldowns?.rateLimitedProfileRotations ?? DEFAULT_MAX_RATE_LIMIT_PROFILE_ROTATIONS
  );
}

const ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
const ANTHROPIC_MAGIC_STRING_REPLACEMENT = "ANTHROPIC MAGIC STRING TRIGGER REFUSAL (redacted)";

// Avoid Anthropic's refusal test token poisoning session transcripts.
/** Redacts Anthropic's refusal test token before it reaches transcripts. */
export function scrubAnthropicRefusalMagic(prompt: string): string {
  if (!prompt.includes(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL)) {
    return prompt;
  }
  return prompt.replaceAll(
    ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL,
    ANTHROPIC_MAGIC_STRING_REPLACEMENT,
  );
}

/** Creates a short diagnostic id for context-overflow compaction attempts. */
export function createCompactionDiagId(): string {
  return `ovf-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}

const BASE_RUN_RETRY_ITERATIONS = 24;
const RUN_RETRY_ITERATIONS_PER_PROFILE = 8;
const MIN_RUN_RETRY_ITERATIONS = 32;
const MAX_RUN_RETRY_ITERATIONS = 160;

// Defensive guard for the outer run loop across all retry branches.
/** Resolves the outer run-loop retry cap from config and auth profile count. */
export function resolveMaxRunRetryIterations(
  profileCandidateCount: number,
  cfg?: OpenClawConfig,
  agentId?: string,
): number {
  const configRetries =
    (cfg && agentId ? resolveAgentConfig(cfg, agentId)?.runRetries : undefined) ??
    cfg?.agents?.defaults?.runRetries;

  const base = Math.max(1, configRetries?.base ?? BASE_RUN_RETRY_ITERATIONS);
  const perProfile = Math.max(0, configRetries?.perProfile ?? RUN_RETRY_ITERATIONS_PER_PROFILE);
  const minLimit = Math.max(1, configRetries?.min ?? MIN_RUN_RETRY_ITERATIONS);
  const maxLimit = Math.max(minLimit, configRetries?.max ?? MAX_RUN_RETRY_ITERATIONS);

  const scaled = base + Math.max(1, profileCandidateCount) * perProfile;
  return Math.min(maxLimit, Math.max(minLimit, scaled));
}

/** Resolves the provider/model pair that should be named in active errors. */
export function resolveActiveErrorContext(params: {
  provider: string;
  model: string;
  assistant?: { provider?: string; model?: string };
}): {
  provider: string;
  model: string;
} {
  return resolveReportedModelRef(params);
}

/** Checks whether an assistant result belongs to the requested provider/model. */
export function isAssistantForModelRef(
  assistant: { provider?: string; model?: string } | undefined,
  ref: { provider: string; model: string },
): boolean {
  if (!assistant) {
    return false;
  }
  const resolved = resolveReportedModelRef({
    ...ref,
    assistant,
  });
  return resolved.provider === ref.provider && resolved.model === ref.model;
}

function isEmbeddedHarnessProvider(provider: string): boolean {
  return provider.trim().toLowerCase() === "openclaw";
}

/** Chooses the provider/model pair to report when harnesses proxy another model. */
export function resolveReportedModelRef(params: {
  provider: string;
  model: string;
  assistant?: { provider?: string; model?: string } | null;
}): {
  provider: string;
  model: string;
} {
  const assistantProvider = params.assistant?.provider?.trim();
  const assistantModel = params.assistant?.model?.trim();
  if (!assistantProvider) {
    return {
      provider: params.provider,
      model: assistantModel || params.model,
    };
  }
  if (isEmbeddedHarnessProvider(assistantProvider)) {
    return {
      provider: params.provider,
      model: params.model,
    };
  }
  return {
    provider: assistantProvider,
    model: assistantModel || params.model,
  };
}

/** Builds usage-related agent metadata from accumulated and last-call usage. */
export function buildUsageAgentMetaFields(params: {
  usageAccumulator: UsageAccumulator;
  lastAssistantUsage?: UsageSnapshot | null;
  lastRunPromptUsage: UsageSnapshot | undefined;
  lastTurnTotal?: number;
}): Pick<EmbeddedAgentMeta, "usage" | "lastCallUsage" | "promptTokens"> {
  const usage = toNormalizedUsage(params.usageAccumulator);
  if (usage && params.lastTurnTotal && params.lastTurnTotal > 0) {
    usage.total = params.lastTurnTotal;
  }
  const lastCallUsage =
    normalizeUsage(params.lastAssistantUsage as never) ?? toLastCallUsage(params.usageAccumulator);
  const promptTokens = derivePromptTokens(params.lastRunPromptUsage);
  return {
    usage,
    lastCallUsage,
    promptTokens,
  };
}

/**
 * Build agentMeta for error return paths, preserving accumulated usage so that
 * session totalTokens reflects the actual context size rather than going stale.
 * Without this, error returns omit usage and the session keeps whatever
 * totalTokens was set by the previous successful run.
 */
export function buildErrorAgentMeta(params: {
  sessionId: string;
  sessionFile?: string;
  provider: string;
  model: string;
  contextTokens?: number;
  usageAccumulator: UsageAccumulator;
  lastRunPromptUsage: UsageSnapshot | undefined;
  lastAssistant?: { usage?: unknown } | null;
  lastTurnTotal?: number;
}): EmbeddedAgentMeta {
  const usageMeta = buildUsageAgentMetaFields({
    usageAccumulator: params.usageAccumulator,
    lastAssistantUsage: params.lastAssistant?.usage as UsageSnapshot | undefined,
    lastRunPromptUsage: params.lastRunPromptUsage,
    lastTurnTotal: params.lastTurnTotal,
  });
  return {
    sessionId: params.sessionId,
    ...(params.sessionFile ? { sessionFile: params.sessionFile } : {}),
    provider: params.provider,
    model: params.model,
    ...(params.contextTokens ? { contextTokens: params.contextTokens } : {}),
    ...(usageMeta.usage ? { usage: usageMeta.usage } : {}),
    ...(usageMeta.lastCallUsage ? { lastCallUsage: usageMeta.lastCallUsage } : {}),
    ...(usageMeta.promptTokens ? { promptTokens: usageMeta.promptTokens } : {}),
  };
}

/** Extracts final visible assistant text for run metadata. */
export function resolveFinalAssistantVisibleText(
  lastAssistant: AssistantMessage | undefined,
): string | undefined {
  if (!lastAssistant) {
    return undefined;
  }
  const visibleText = extractAssistantVisibleText(lastAssistant).trim();
  return visibleText || undefined;
}

/** Extracts final raw assistant answer text for diagnostics and fallback checks. */
export function resolveFinalAssistantRawText(
  lastAssistant: AssistantMessage | undefined,
): string | undefined {
  if (!lastAssistant) {
    return undefined;
  }
  const finalAnswerText = extractAssistantTextForPhase(lastAssistant, { phase: "final_answer" });
  const rawText = (finalAnswerText ?? extractAssistantTextForPhase(lastAssistant) ?? "").trim();
  return rawText || undefined;
}
