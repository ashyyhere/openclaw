// Test helper for capturing Crestodian runtime output and exits.
import type { RuntimeEnv } from "../runtime.js";

/** Create a fake RuntimeEnv that records output lines and throws on exit. */
export function createCrestodianTestRuntime(): { runtime: RuntimeEnv; lines: string[] } {
  const lines: string[] = [];
  return {
    lines,
    runtime: {
      log: (...args) => lines.push(args.join(" ")),
      error: (...args) => lines.push(args.join(" ")),
      exit: (code) => {
        throw new Error(`exit ${code}`);
      },
    },
  };
}
