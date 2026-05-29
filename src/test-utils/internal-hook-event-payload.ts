// Test payload builder for internal hook event fixtures.
/** Builds the minimal internal hook event payload shape expected by hook tests. */
export function createInternalHookEventPayload(
  type: string,
  action: string,
  sessionKey: string,
  context: Record<string, unknown>,
) {
  return {
    type,
    action,
    sessionKey,
    context,
    timestamp: new Date(),
    messages: [],
  };
}
