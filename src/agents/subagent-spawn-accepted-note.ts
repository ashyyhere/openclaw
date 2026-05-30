/** Produces immediate accepted notes for spawned subagent run/session modes. */
import { isCronSessionKey } from "../routing/session-key.js";

/** Model-facing note that tells run-mode subagents to wait for push completions. */
export const SUBAGENT_SPAWN_ACCEPTED_NOTE =
  "Auto-announce is push-based. After spawning children, do NOT call sessions_list, sessions_history, exec sleep, or any polling tool. Track expected child session keys. Continue any independent work. If your final answer depends on child output, wait for runtime completion events to arrive as user messages and only answer after completion events for ALL required children arrive. If a child completion event arrives AFTER your final answer, reply ONLY with NO_REPLY.";
/** Model-facing note for spawned sessions that remain open for follow-ups. */
export const SUBAGENT_SPAWN_SESSION_ACCEPTED_NOTE =
  "thread-bound session stays active after this task; continue in-thread for follow-ups.";

/** Selects the accepted note for spawned run or session mode. */
export function resolveSubagentSpawnAcceptedNote(params: {
  spawnMode: "run" | "session";
  agentSessionKey?: string;
}): string | undefined {
  if (params.spawnMode === "session") {
    return SUBAGENT_SPAWN_SESSION_ACCEPTED_NOTE;
  }
  return isCronSessionKey(params.agentSessionKey) ? undefined : SUBAGENT_SPAWN_ACCEPTED_NOTE;
}
