// crestodian crestodian test helpers helpers and runtime behavior.
import type { RuntimeEnv } from "../runtime.js";

/** Reused helper for create Crestodian Test Runtime behavior in src/crestodian. */
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
