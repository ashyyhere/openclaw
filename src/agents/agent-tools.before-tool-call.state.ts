export const adjustedParamsByToolCallId = new Map<string, unknown>();

/** Clear adjusted tool-call params between tests. */
export function resetAdjustedParamsByToolCallIdForTests(): void {
  adjustedParamsByToolCallId.clear();
}
