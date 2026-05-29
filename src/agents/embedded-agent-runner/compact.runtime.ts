/** Runtime facade for direct embedded-agent compaction. */
import { createLazyImportLoader } from "../../shared/lazy-promise.js";
import type { CompactEmbeddedAgentSessionDirect } from "./compact.runtime.types.js";

const compactRuntimeLoader = createLazyImportLoader(() => import("./compact.js"));

function loadCompactRuntime() {
  return compactRuntimeLoader.load();
}

/** Reused helper for compact Embedded Agent Session Direct behavior in src/agents/embedded-agent-runner. */
export async function compactEmbeddedAgentSessionDirect(
  ...args: Parameters<CompactEmbeddedAgentSessionDirect>
): ReturnType<CompactEmbeddedAgentSessionDirect> {
  const { compactEmbeddedAgentSessionDirect } = await loadCompactRuntime();
  return compactEmbeddedAgentSessionDirect(...args);
}
