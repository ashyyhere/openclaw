/** Bridges gateway exec approval events into ACP permission requests. */
import type {
  PermissionOption,
  RequestPermissionRequest,
  RequestPermissionResponse,
} from "@agentclientprotocol/sdk";
import { normalizeOptionalString as readNonEmptyString } from "../shared/string-coerce.js";

/** Shared type for Gateway Exec Approval Decision in src/acp. */
export type GatewayExecApprovalDecision = "allow-once" | "allow-always" | "deny";

/** Shared type for Gateway Exec Approval Event in src/acp. */
export type GatewayExecApprovalEvent = {
  approvalId: string;
  command?: string;
  host?: string;
  title?: string;
  toolCallId?: string;
};

/** Shared type for Gateway Exec Approval Details in src/acp. */
export type GatewayExecApprovalDetails = {
  allowedDecisions?: unknown;
  commandPreview?: unknown;
  commandText?: unknown;
  host?: unknown;
};

const FALLBACK_EXEC_APPROVAL_DECISIONS = ["allow-once", "deny"] as const;

function normalizeGatewayExecApprovalDecision(
  value: unknown,
): GatewayExecApprovalDecision | undefined {
  if (value === "allow-once" || value === "allow-always" || value === "deny") {
    return value;
  }
  return undefined;
}

/** Normalize gateway exec approval decisions, falling back to allow-once/deny. */
export function normalizeGatewayExecApprovalDecisions(
  value: unknown,
): GatewayExecApprovalDecision[] {
  const normalized = Array.isArray(value)
    ? value
        .map(normalizeGatewayExecApprovalDecision)
        .filter((decision): decision is GatewayExecApprovalDecision => Boolean(decision))
    : [];
  return normalized.length > 0 ? normalized : [...FALLBACK_EXEC_APPROVAL_DECISIONS];
}

/** Build ACP permission options from gateway exec approval decisions. */
export function buildAcpPermissionOptions(
  decisions: readonly GatewayExecApprovalDecision[],
): PermissionOption[] {
  const unique = new Set<GatewayExecApprovalDecision>(decisions);
  const options: PermissionOption[] = [];
  if (unique.has("allow-once")) {
    options.push({
      optionId: "allow-once",
      name: "Allow once",
      kind: "allow_once",
    });
  }
  if (unique.has("allow-always")) {
    options.push({
      optionId: "allow-always",
      name: "Allow always",
      kind: "allow_always",
    });
  }
  if (unique.has("deny")) {
    options.push({
      optionId: "deny",
      name: "Deny",
      kind: "reject_once",
    });
  }
  return options.length > 0 ? options : buildAcpPermissionOptions(FALLBACK_EXEC_APPROVAL_DECISIONS);
}

/** Parse gateway approval event data emitted by the runtime event stream. */
export function parseGatewayExecApprovalEventData(
  data: Record<string, unknown>,
): GatewayExecApprovalEvent | null {
  if (data.phase !== "requested" || data.kind !== "exec" || data.status !== "pending") {
    return null;
  }
  const approvalId = readNonEmptyString(data.approvalId);
  if (!approvalId) {
    return null;
  }
  return {
    approvalId,
    command: readNonEmptyString(data.command),
    host: readNonEmptyString(data.host),
    title: readNonEmptyString(data.title),
    toolCallId: readNonEmptyString(data.toolCallId),
  };
}

/** Parse gateway approval request payloads from legacy request-event shapes. */
export function parseGatewayExecApprovalRequestEventPayload(
  payload: Record<string, unknown>,
): GatewayExecApprovalEvent | null {
  const approvalId = readNonEmptyString(payload.id);
  const request = payload.request;
  if (!approvalId || !request || typeof request !== "object" || Array.isArray(request)) {
    return null;
  }
  const requestRecord = request as Record<string, unknown>;
  return {
    approvalId,
    command:
      readNonEmptyString(requestRecord.command) ?? readNonEmptyString(requestRecord.commandPreview),
    host: readNonEmptyString(requestRecord.host),
  };
}

/** Build an ACP permission request for one pending gateway exec approval. */
export function buildAcpPermissionRequest(params: {
  sessionId: string;
  event: GatewayExecApprovalEvent;
  details?: GatewayExecApprovalDetails | null;
}): RequestPermissionRequest {
  const command =
    readNonEmptyString(params.details?.commandText) ??
    readNonEmptyString(params.details?.commandPreview) ??
    params.event.command;
  const host = readNonEmptyString(params.details?.host) ?? params.event.host;
  const decisions = normalizeGatewayExecApprovalDecisions(params.details?.allowedDecisions);
  const rawInput: Record<string, string> = {
    name: "exec",
    approvalId: params.event.approvalId,
  };
  if (command) {
    rawInput.command = command;
  }
  if (host) {
    rawInput.host = host;
  }

  return {
    sessionId: params.sessionId,
    toolCall: {
      // Raw approval events can arrive before Gateway emits a tool call id; the
      // approval id remains the stable correlation key for those early prompts.
      toolCallId: params.event.toolCallId ?? `exec:${params.event.approvalId}`,
      title: params.event.title ?? "Command approval requested",
      kind: "execute",
      status: "pending",
      rawInput,
      _meta: {
        toolName: "exec",
        approvalId: params.event.approvalId,
      },
    },
    options: buildAcpPermissionOptions(decisions),
  };
}

/** Convert the selected ACP permission option back to a gateway decision. */
export function resolveGatewayDecisionFromPermissionOutcome(
  response: RequestPermissionResponse | undefined,
  options: readonly PermissionOption[],
): GatewayExecApprovalDecision | undefined {
  const outcome = response?.outcome;
  if (!outcome || outcome.outcome !== "selected") {
    return undefined;
  }
  const selected = options.find((option) => option.optionId === outcome.optionId);
  return normalizeGatewayExecApprovalDecision(selected?.optionId);
}
