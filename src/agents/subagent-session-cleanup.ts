/** Deletes or preserves subagent sessions and related resources after run completion. */
import type { callGateway as defaultCallGateway } from "../gateway/call.js";
import type { SpawnSubagentMode } from "./subagent-spawn.types.js";

type CallGateway = typeof defaultCallGateway;

/** Deletes a completed subagent child session through the gateway cleanup path. */
export async function deleteSubagentSessionForCleanup(params: {
  callGateway: CallGateway;
  childSessionKey: string;
  spawnMode?: SpawnSubagentMode;
  onError?: (error: unknown) => void;
}): Promise<void> {
  try {
    await params.callGateway({
      method: "sessions.delete",
      params: {
        key: params.childSessionKey,
        deleteTranscript: true,
        emitLifecycleHooks: params.spawnMode === "session",
      },
      timeoutMs: 10_000,
    });
  } catch (error) {
    params.onError?.(error);
  }
}
