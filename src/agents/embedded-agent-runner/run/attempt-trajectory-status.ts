/** Resolves whether an embedded attempt ended successfully, errored, or stopped. */
import {
  hasAcceptedSessionSpawn,
  type AcceptedSessionSpawn,
} from "../../accepted-session-spawn.js";

/** Shared type for Attempt Trajectory Terminal Status in src/agents/embedded-agent-runner. */
export type AttemptTrajectoryTerminalStatus = "success" | "error" | "interrupted";

/** Reused constant for NON DELIVERABLE TERMINAL TURN REASON behavior in src/agents/embedded-agent-runner. */
export const NON_DELIVERABLE_TERMINAL_TURN_REASON = "non_deliverable_terminal_turn";

/** Shared type for Attempt Trajectory Terminal in src/agents/embedded-agent-runner. */
export type AttemptTrajectoryTerminal = {
  status: AttemptTrajectoryTerminalStatus;
  terminalError?: typeof NON_DELIVERABLE_TERMINAL_TURN_REASON;
};

/** Shared type for Resolve Attempt Trajectory Terminal Params in src/agents/embedded-agent-runner. */
export type ResolveAttemptTrajectoryTerminalParams = {
  promptError?: unknown;
  aborted: boolean;
  timedOut: boolean;
  assistantTexts: string[];
  toolMetas: Array<{ toolName: string; meta?: string; asyncStarted?: boolean }>;
  didSendViaMessagingTool: boolean;
  didSendDeterministicApprovalPrompt: boolean;
  messagingToolSentTexts: string[];
  messagingToolSentMediaUrls: string[];
  messagingToolSentTargets: unknown[];
  successfulCronAdds: number;
  synthesizedPayloadCount: number;
  acceptedSessionSpawns?: readonly AcceptedSessionSpawn[];
  heartbeatToolResponse?: unknown;
  clientToolCalls?: Array<unknown>;
  yieldDetected?: boolean;
  lastToolError?: unknown;
  silentExpected?: boolean;
  emptyAssistantReplyIsSilent?: boolean;
  lastAssistantStopReason?: string;
};

/** Extracts final assistant text blocks that are eligible for delivery. */
export function resolveTerminalAssistantTexts(params: {
  assistantTexts: string[];
  lastAssistantStopReason?: string;
  lastAssistantVisibleText?: string;
}): string[] {
  if (hasNonEmptyAssistantText(params.assistantTexts)) {
    return params.assistantTexts;
  }
  if (params.lastAssistantStopReason === "error" || params.lastAssistantStopReason === "aborted") {
    return params.assistantTexts;
  }
  const fallbackText = params.lastAssistantVisibleText?.trim();
  return fallbackText ? [fallbackText] : params.assistantTexts;
}

function hasNonEmptyAssistantText(texts: string[]): boolean {
  return texts.some((text) => text.trim().length > 0);
}

function hasNonEmptyString(values: string[]): boolean {
  return values.some((value) => value.trim().length > 0);
}

function hasCommittedMessagingDeliveryEvidence(
  params: Pick<
    ResolveAttemptTrajectoryTerminalParams,
    "messagingToolSentTexts" | "messagingToolSentMediaUrls" | "messagingToolSentTargets"
  >,
): boolean {
  return (
    hasNonEmptyString(params.messagingToolSentTexts) ||
    hasNonEmptyString(params.messagingToolSentMediaUrls) ||
    params.messagingToolSentTargets.length > 0
  );
}

function hasAsyncStartedToolActivity(toolMetas?: readonly { asyncStarted?: boolean }[]): boolean {
  return (toolMetas ?? []).some((entry) => entry.asyncStarted === true);
}

/** Converts attempt trajectory facts into final status and terminal reason. */
export function resolveAttemptTrajectoryTerminal(
  params: ResolveAttemptTrajectoryTerminalParams,
): AttemptTrajectoryTerminal {
  if (params.promptError) {
    return { status: "error" };
  }
  if (params.aborted || params.timedOut) {
    return { status: "interrupted" };
  }

  const hasExplicitTerminalDelivery =
    params.silentExpected === true ||
    params.emptyAssistantReplyIsSilent === true ||
    params.didSendDeterministicApprovalPrompt ||
    hasCommittedMessagingDeliveryEvidence(params) ||
    hasAcceptedSessionSpawn(params.acceptedSessionSpawns) ||
    params.synthesizedPayloadCount > 0 ||
    params.heartbeatToolResponse !== undefined ||
    (params.clientToolCalls?.length ?? 0) > 0 ||
    params.yieldDetected === true ||
    params.lastToolError !== undefined ||
    hasAsyncStartedToolActivity(params.toolMetas);

  if (params.lastAssistantStopReason === "toolUse" && !hasExplicitTerminalDelivery) {
    return {
      status: "error",
      terminalError: NON_DELIVERABLE_TERMINAL_TURN_REASON,
    };
  }

  const hasDeliverableOrProgress =
    hasExplicitTerminalDelivery ||
    hasNonEmptyAssistantText(params.assistantTexts) ||
    params.successfulCronAdds > 0;

  if (hasDeliverableOrProgress) {
    return { status: "success" };
  }

  return {
    status: "error",
    terminalError: NON_DELIVERABLE_TERMINAL_TURN_REASON,
  };
}
