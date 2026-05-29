/** Test harness cleanup for process-global bundled MCP runtime state. */
export async function cleanupBundleMcpHarness(): Promise<void> {
  const { testing } = await import("./agent-bundle-mcp-tools.js");
  await testing.resetSessionMcpRuntimeManager();
}
