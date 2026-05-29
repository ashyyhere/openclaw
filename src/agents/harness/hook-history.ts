/** Limits conversation history sent to agent harness plugin hooks. */
export const MAX_AGENT_HOOK_HISTORY_MESSAGES = 100;

/** Keeps only the newest messages that hook payloads need. */
export function limitAgentHookHistoryMessages(
  messages: readonly unknown[],
  maxMessages = MAX_AGENT_HOOK_HISTORY_MESSAGES,
): unknown[] {
  if (maxMessages <= 0) {
    return [];
  }
  return messages.slice(-maxMessages);
}

/** Builds bounded conversation history plus current-turn messages for hook events. */
export function buildAgentHookConversationMessages(params: {
  historyMessages?: readonly unknown[];
  currentTurnMessages?: readonly unknown[];
}): unknown[] {
  return [
    ...limitAgentHookHistoryMessages(params.historyMessages ?? []),
    ...(params.currentTurnMessages ?? []),
  ];
}
