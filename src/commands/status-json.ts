/** Entrypoint for status JSON command fast path. */
import { type RuntimeEnv } from "../runtime.js";
import { runStatusJsonCommand } from "./status-json-command.ts";
import { scanStatusJsonFast } from "./status.scan.fast-json.js";

/** Reused helper for status Json Command behavior in src/commands. */
export async function statusJsonCommand(
  opts: {
    deep?: boolean;
    usage?: boolean;
    timeoutMs?: number;
    all?: boolean;
  },
  runtime: RuntimeEnv,
) {
  await runStatusJsonCommand({
    opts,
    runtime,
    scanStatusJsonFast,
    includeSecurityAudit: opts.all === true,
    suppressHealthErrors: true,
  });
}
