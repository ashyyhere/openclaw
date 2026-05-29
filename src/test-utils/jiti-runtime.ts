// test-utils jiti runtime helpers and runtime behavior.
/** Reused helper for should Expect Native Jiti For Java Script Test Runtime behavior in src/test-utils. */
export function shouldExpectNativeJitiForJavaScriptTestRuntime(): boolean {
  return typeof (process.versions as { bun?: string }).bun !== "string";
}
