/** Detects visible outbound delivery evidence from embedded-agent results. */
import { normalizeStringEntries, uniqueStrings } from "../../shared/string-normalization.js";
import { hasAcceptedSessionSpawn } from "../accepted-session-spawn.js";

type AgentPayloadLike = {
  text?: unknown;
  mediaUrl?: unknown;
  mediaUrls?: unknown;
  presentation?: unknown;
  interactive?: unknown;
  channelData?: unknown;
  isError?: unknown;
  isReasoning?: unknown;
};

/** Shared type for Agent Delivery Evidence in src/agents/embedded-agent-runner. */
export type AgentDeliveryEvidence = {
  payloads?: unknown;
  deliveryStatus?: {
    status?: unknown;
    errorMessage?: unknown;
  };
  didSendViaMessagingTool?: unknown;
  messagingToolSentTexts?: unknown;
  messagingToolSentMediaUrls?: unknown;
  messagingToolSentTargets?: unknown;
  acceptedSessionSpawns?: unknown;
  successfulCronAdds?: unknown;
  meta?: {
    toolSummary?: {
      calls?: unknown;
    };
  };
};

function hasNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasNonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasNonEmptyStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.some(hasNonEmptyString);
}

function collectStringValues(value: unknown, output: Set<string>) {
  if (typeof value === "string" && value.trim()) {
    output.add(value.trim());
    return;
  }
  if (!Array.isArray(value)) {
    return;
  }
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim()) {
      output.add(entry.trim());
    }
  }
}

function collectMediaUrlsFromRecord(record: Record<string, unknown>, output: Set<string>) {
  collectStringValues(record.mediaUrl, output);
  collectStringValues(record.mediaUrls, output);
  collectStringValues(record.path, output);
  collectStringValues(record.url, output);
  collectStringValues(record.filePath, output);
  const attachments = record.attachments;
  if (Array.isArray(attachments)) {
    for (const attachment of attachments) {
      if (attachment && typeof attachment === "object" && !Array.isArray(attachment)) {
        collectMediaUrlsFromRecord(attachment as Record<string, unknown>, output);
      }
    }
  }
}

/** Reused helper for collect Delivered Media Urls behavior in src/agents/embedded-agent-runner. */
export function collectDeliveredMediaUrls(result: AgentDeliveryEvidence): string[] {
  const urls = new Set<string>();
  if (Array.isArray(result.payloads)) {
    for (const payload of result.payloads) {
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        collectMediaUrlsFromRecord(payload as Record<string, unknown>, urls);
      }
    }
  }
  for (const url of collectMessagingToolDeliveredMediaUrls(result)) {
    urls.add(url);
  }
  return Array.from(urls);
}

/** Reused helper for collect Messaging Tool Delivered Media Urls behavior in src/agents/embedded-agent-runner. */
export function collectMessagingToolDeliveredMediaUrls(
  result: Pick<AgentDeliveryEvidence, "messagingToolSentMediaUrls" | "messagingToolSentTargets">,
): string[] {
  const urls = new Set<string>();
  collectStringValues(result.messagingToolSentMediaUrls, urls);
  if (Array.isArray(result.messagingToolSentTargets)) {
    for (const target of result.messagingToolSentTargets) {
      if (target && typeof target === "object" && !Array.isArray(target)) {
        collectMediaUrlsFromRecord(target as Record<string, unknown>, urls);
      }
    }
  }
  return Array.from(urls);
}

/** Reused helper for has Delivered Expected Media behavior in src/agents/embedded-agent-runner. */
export function hasDeliveredExpectedMedia(
  result: AgentDeliveryEvidence,
  expectedMediaUrls: readonly string[],
): boolean {
  const expected = uniqueStrings(normalizeStringEntries(expectedMediaUrls));
  if (expected.length === 0) {
    return true;
  }
  const delivered = new Set(collectDeliveredMediaUrls(result));
  return expected.every((url) => delivered.has(url));
}

function hasPositiveNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** Reused helper for get Gateway Agent Result behavior in src/agents/embedded-agent-runner. */
export function getGatewayAgentResult(response: unknown): AgentDeliveryEvidence | null {
  if (!response || typeof response !== "object") {
    return null;
  }
  const candidate = hasAgentDeliveryEvidenceShape(response)
    ? response
    : (response as { result?: unknown }).result;
  if (!candidate || typeof candidate !== "object" || !hasAgentDeliveryEvidenceShape(candidate)) {
    return null;
  }
  return candidate as AgentDeliveryEvidence;
}

function hasAgentDeliveryEvidenceShape(value: object): boolean {
  return (
    "payloads" in value ||
    "deliveryStatus" in value ||
    "didSendViaMessagingTool" in value ||
    "messagingToolSentTexts" in value ||
    "messagingToolSentMediaUrls" in value ||
    "messagingToolSentTargets" in value ||
    "acceptedSessionSpawns" in value ||
    "successfulCronAdds" in value ||
    "meta" in value
  );
}

/** Reused helper for has Visible Agent Payload behavior in src/agents/embedded-agent-runner. */
export function hasVisibleAgentPayload(
  result: Pick<AgentDeliveryEvidence, "payloads">,
  options: { includeErrorPayloads?: boolean; includeReasoningPayloads?: boolean } = {},
): boolean {
  const payloads = result.payloads;
  if (!Array.isArray(payloads)) {
    return false;
  }
  return payloads.some((payload) => {
    if (!payload || typeof payload !== "object") {
      return false;
    }
    const record = payload as AgentPayloadLike;
    if (options.includeErrorPayloads === false && record.isError === true) {
      return false;
    }
    if (options.includeReasoningPayloads === false && record.isReasoning === true) {
      return false;
    }
    return Boolean(
      hasNonEmptyString(record.text) ||
      hasNonEmptyString(record.mediaUrl) ||
      hasNonEmptyStringArray(record.mediaUrls) ||
      record.presentation ||
      record.interactive ||
      record.channelData,
    );
  });
}

/** Reused helper for has Messaging Tool Delivery Evidence behavior in src/agents/embedded-agent-runner. */
export function hasMessagingToolDeliveryEvidence(result: AgentDeliveryEvidence): boolean {
  return (
    result.didSendViaMessagingTool === true || hasCommittedMessagingToolDeliveryEvidence(result)
  );
}

/** Reused helper for has Committed Messaging Tool Delivery Evidence behavior in src/agents/embedded-agent-runner. */
export function hasCommittedMessagingToolDeliveryEvidence(
  result: Pick<
    AgentDeliveryEvidence,
    "messagingToolSentTexts" | "messagingToolSentMediaUrls" | "messagingToolSentTargets"
  >,
): boolean {
  return (
    hasNonEmptyStringArray(result.messagingToolSentTexts) ||
    hasNonEmptyStringArray(result.messagingToolSentMediaUrls) ||
    hasNonEmptyArray(result.messagingToolSentTargets)
  );
}

/** Reused helper for has Outbound Delivery Evidence behavior in src/agents/embedded-agent-runner. */
export function hasOutboundDeliveryEvidence(result: AgentDeliveryEvidence): boolean {
  return (
    hasMessagingToolDeliveryEvidence(result) ||
    (Array.isArray(result.acceptedSessionSpawns) &&
      hasAcceptedSessionSpawn(result.acceptedSessionSpawns)) ||
    hasPositiveNumber(result.successfulCronAdds) ||
    hasPositiveNumber(result.meta?.toolSummary?.calls)
  );
}

/** Reused helper for get Agent Command Delivery Failure behavior in src/agents/embedded-agent-runner. */
export function getAgentCommandDeliveryFailure(result: AgentDeliveryEvidence): string | undefined {
  const status = result.deliveryStatus?.status;
  if (status !== "failed" && status !== "partial_failed") {
    return undefined;
  }
  const message = result.deliveryStatus?.errorMessage;
  if (hasNonEmptyString(message)) {
    return message;
  }
  return status === "partial_failed" ? "agent delivery partially failed" : "agent delivery failed";
}
