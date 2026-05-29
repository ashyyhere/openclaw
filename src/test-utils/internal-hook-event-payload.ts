// test-utils internal hook event payload helpers and runtime behavior.
/** Reused helper for create Internal Hook Event Payload behavior in src/test-utils. */
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
