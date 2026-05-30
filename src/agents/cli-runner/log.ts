/** Logging helpers for CLI backend execution output. */
import crypto from "node:crypto";
import { createSubsystemLogger } from "../../logging/subsystem.js";

/** Subsystem logger for CLI backend execution. */
export const cliBackendLog = createSubsystemLogger("agent/cli-backend");
/** Env var enabling raw CLI backend output logging. */
export const CLI_BACKEND_LOG_OUTPUT_ENV = "OPENCLAW_CLI_BACKEND_LOG_OUTPUT";
/** Legacy env var accepted for Claude CLI output logging. */
export const LEGACY_CLAUDE_CLI_LOG_OUTPUT_ENV = "OPENCLAW_CLAUDE_CLI_LOG_OUTPUT";

/** Format a size/hash digest for CLI backend output without logging contents. */
export function formatCliBackendOutputDigest(text: string): string {
  const outBytes = Buffer.byteLength(text, "utf8");
  const outHash = crypto.createHash("sha256").update(text).digest("hex").slice(0, 12);
  return `outBytes=${outBytes} outHash=${outHash}`;
}
