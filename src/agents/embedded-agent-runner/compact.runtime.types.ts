/** Runtime type contracts for embedded-agent compaction entry points. */
import type { CompactEmbeddedAgentSessionParams } from "./compact.types.js";
import type { EmbeddedAgentCompactResult } from "./types.js";

/** Direct compaction function signature used by lazy runtime boundaries. */
export type CompactEmbeddedAgentSessionDirect = (
  params: CompactEmbeddedAgentSessionParams,
) => Promise<EmbeddedAgentCompactResult>;
