/** Shared temp-state helper for skill download installer tests. */
import path from "node:path";

/** Points skill download tests at an isolated `.openclaw` state directory. */
export function setTempStateDir(workspaceDir: string): string {
  const stateDir = path.join(workspaceDir, "state");
  process.env.OPENCLAW_STATE_DIR = stateDir;
  return stateDir;
}
