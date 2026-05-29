/** Shared adjusted-parameter state for before-tool-call hook reconciliation. */
export const adjustedParamsByToolCallId = new Map<string, unknown>();

/** Clear adjusted tool-call params between tests. */
export function resetAdjustedParamsByToolCallIdForTests(): void {
  adjustedParamsByToolCallId.clear();
}
