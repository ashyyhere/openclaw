// Shared helpers for reply tests.
/** Reused helper for create Mock Typing Controller behavior in src/auto-reply/reply. */
export function createMockTypingController() {
  return {
    onReplyStart: async () => undefined,
    startTypingLoop: async () => undefined,
    startTypingOnText: async () => undefined,
    refreshTypingTtl: () => undefined,
    isActive: () => false,
    markRunComplete: () => undefined,
    markDispatchIdle: () => undefined,
    cleanup: () => undefined,
  };
}
