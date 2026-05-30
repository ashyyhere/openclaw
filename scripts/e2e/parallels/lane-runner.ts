// Parallels lane runner records fresh/upgrade smoke lane pass or failure state.
import { warn } from "./host-command.ts";

/** Smoke lane names tracked by Parallels update/install runs. */
export type SmokeLane = "fresh" | "upgrade";
/** Terminal status recorded for one smoke lane. */
export type SmokeLaneStatus = "pass" | "fail";

/** Run one smoke lane, record its status, and keep the parent run moving after failure. */
export async function runSmokeLane(
  name: SmokeLane,
  fn: () => Promise<void>,
  setStatus: (name: SmokeLane, status: SmokeLaneStatus) => void,
): Promise<void> {
  try {
    await fn();
    setStatus(name, "pass");
  } catch (error) {
    setStatus(name, "fail");
    warn(`${name} lane failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
