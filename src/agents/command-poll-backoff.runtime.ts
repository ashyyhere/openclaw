/** Runtime export for stale command-poll cleanup without loading the full helper barrel. */
import { pruneStaleCommandPolls as pruneStaleCommandPollsImpl } from "./command-poll-backoff.js";

type PruneStaleCommandPolls = typeof import("./command-poll-backoff.js").pruneStaleCommandPolls;

/** Forward stale command-poll cleanup through the runtime boundary. */
export function pruneStaleCommandPolls(
  ...args: Parameters<PruneStaleCommandPolls>
): ReturnType<PruneStaleCommandPolls> {
  return pruneStaleCommandPollsImpl(...args);
}
