// Runtime helper for persisting abort cutoff updates to session state.
import { updateSessionStore } from "../../config/sessions/store.js";
import type { SessionEntry } from "../../config/sessions/types.js";
import { applyAbortCutoffToSessionEntry, hasAbortCutoff } from "./abort-cutoff.js";

/** Reused helper for clear Abort Cutoff In Session Runtime behavior in src/auto-reply/reply. */
export async function clearAbortCutoffInSessionRuntime(params: {
  sessionEntry?: SessionEntry;
  sessionStore?: Record<string, SessionEntry>;
  sessionKey?: string;
  storePath?: string;
}): Promise<boolean> {
  const { sessionEntry, sessionStore, sessionKey, storePath } = params;
  if (!sessionEntry || !sessionStore || !sessionKey || !hasAbortCutoff(sessionEntry)) {
    return false;
  }

  applyAbortCutoffToSessionEntry(sessionEntry, undefined);
  sessionEntry.updatedAt = Date.now();
  sessionStore[sessionKey] = sessionEntry;

  if (storePath) {
    await updateSessionStore(storePath, (store) => {
      const existing = store[sessionKey] ?? sessionEntry;
      if (!existing) {
        return;
      }
      applyAbortCutoffToSessionEntry(existing, undefined);
      existing.updatedAt = Date.now();
      store[sessionKey] = existing;
    });
  }

  return true;
}
