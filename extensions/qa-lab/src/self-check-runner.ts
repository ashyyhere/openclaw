// QA Lab self-check runner starts a lab server and executes the smoke scenario.
import { startQaLabServer } from "./lab-server.js";

/** Runs the QA Lab self-check and stops the temporary lab server afterward. */
export async function runQaLabSelfCheck(params?: { repoRoot?: string; outputPath?: string }) {
  const server = await startQaLabServer({
    repoRoot: params?.repoRoot,
    outputPath: params?.outputPath,
  });
  try {
    return await server.runSelfCheck();
  } finally {
    await server.stop();
  }
}

/** Backward-compatible alias for the QA Lab self-check runner. */
export const runQaE2eSelfCheck = runQaLabSelfCheck;
