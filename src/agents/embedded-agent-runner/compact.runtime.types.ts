/** Runtime type contracts for embedded-agent compaction entry points. */
import type { CompactEmbeddedAgentSessionParams } from "./compact.types.js";
import type { EmbeddedAgentCompactResult } from "./types.js";

/** Shared type for Compact Embedded Agent Session Direct in src/agents/embedded-agent-runner. */
export type CompactEmbeddedAgentSessionDirect = (
  params: CompactEmbeddedAgentSessionParams,
) => Promise<EmbeddedAgentCompactResult>;
