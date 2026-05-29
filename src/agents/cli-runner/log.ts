/** Logging helpers for CLI backend execution output. */
import crypto from "node:crypto";
import { createSubsystemLogger } from "../../logging/subsystem.js";

/** Reused constant for cli Backend Log behavior in src/agents/cli-runner. */
export const cliBackendLog = createSubsystemLogger("agent/cli-backend");
/** Reused constant for CLI BACKEND LOG OUTPUT ENV behavior in src/agents/cli-runner. */
export const CLI_BACKEND_LOG_OUTPUT_ENV = "OPENCLAW_CLI_BACKEND_LOG_OUTPUT";
/** Reused constant for LEGACY CLAUDE CLI LOG OUTPUT ENV behavior in src/agents/cli-runner. */
export const LEGACY_CLAUDE_CLI_LOG_OUTPUT_ENV = "OPENCLAW_CLAUDE_CLI_LOG_OUTPUT";

/** Reused helper for format Cli Backend Output Digest behavior in src/agents/cli-runner. */
export function formatCliBackendOutputDigest(text: string): string {
  const outBytes = Buffer.byteLength(text, "utf8");
  const outHash = crypto.createHash("sha256").update(text).digest("hex").slice(0, 12);
  return `outBytes=${outBytes} outHash=${outHash}`;
}
