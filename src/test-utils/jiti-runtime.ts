// Test helper for runtime-specific jiti expectations.
/** Return whether the current JS runtime should use native jiti behavior. */
export function shouldExpectNativeJitiForJavaScriptTestRuntime(): boolean {
  return typeof (process.versions as { bun?: string }).bun !== "string";
}
