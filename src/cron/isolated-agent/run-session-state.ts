// cron/isolated-agent run session state helpers and runtime behavior.
import fs from "node:fs";
import type { LiveSessionModelSelection } from "../../agents/live-model-switch.js";
import type { SessionEntry } from "../../config/sessions.js";
import { isCronSessionKey } from "../../sessions/session-key-utils.js";
import type { SkillSnapshot } from "../../skills/types.js";
import type { resolveCronSession } from "./session.js";

type MutableSessionStore = Record<string, SessionEntry>;

/** Shared type for Mutable Cron Session Entry in src/cron/isolated-agent. */
export type MutableCronSessionEntry = SessionEntry;
/** Shared type for Mutable Cron Session in src/cron/isolated-agent. */
export type MutableCronSession = ReturnType<typeof resolveCronSession> & {
  store: MutableSessionStore;
  sessionEntry: MutableCronSessionEntry;
};
/** Shared type for Cron Live Selection in src/cron/isolated-agent. */
export type CronLiveSelection = LiveSessionModelSelection;

type UpdateSessionStore = (
  storePath: string,
  update: (store: MutableSessionStore) => void,
) => Promise<void>;

/** Shared type for Persist Cron Session Entry in src/cron/isolated-agent. */
export type PersistCronSessionEntry = () => Promise<void>;

function cronTranscriptExists(entry: SessionEntry): boolean {
  const sessionFile = entry.sessionFile?.trim();
  return Boolean(sessionFile && fs.existsSync(sessionFile));
}

function normalizeSessionField(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toNonResumableCronSessionEntry(entry: SessionEntry): SessionEntry {
  const next = { ...entry } as Partial<SessionEntry>;
  delete next.sessionId;
  delete next.sessionFile;
  delete next.sessionStartedAt;
  delete next.lastInteractionAt;
  delete next.cliSessionIds;
  delete next.cliSessionBindings;
  delete next.claudeCliSessionId;
  return next as SessionEntry;
}

/** Reused helper for create Persist Cron Session Entry behavior in src/cron/isolated-agent. */
export function createPersistCronSessionEntry(params: {
  isFastTestEnv: boolean;
  cronSession: MutableCronSession;
  agentSessionKey: string;
  updateSessionStore: UpdateSessionStore;
}): PersistCronSessionEntry {
  return async () => {
    if (params.isFastTestEnv) {
      return;
    }
    const persistedEntry =
      isCronSessionKey(params.agentSessionKey) &&
      params.cronSession.sessionEntry.sessionId &&
      !cronTranscriptExists(params.cronSession.sessionEntry)
        ? toNonResumableCronSessionEntry(params.cronSession.sessionEntry)
        : params.cronSession.sessionEntry;
    params.cronSession.store[params.agentSessionKey] = persistedEntry;
    await params.updateSessionStore(params.cronSession.storePath, (store) => {
      store[params.agentSessionKey] = persistedEntry;
    });
  };
}

/** Reused helper for adopt Cron Run Session Metadata behavior in src/cron/isolated-agent. */
export function adoptCronRunSessionMetadata(params: {
  entry: MutableCronSessionEntry;
  sessionKey: string;
  runMeta?: {
    sessionId?: string;
    sessionFile?: string;
  };
}): boolean {
  const nextSessionId = normalizeSessionField(params.runMeta?.sessionId);
  const nextSessionFile = normalizeSessionField(params.runMeta?.sessionFile);
  if (!nextSessionFile) {
    return false;
  }

  let changed = false;
  const previousSessionId = params.entry.sessionId;
  if (nextSessionId && nextSessionId !== previousSessionId) {
    params.entry.sessionId = nextSessionId;
    params.entry.usageFamilyKey = params.entry.usageFamilyKey ?? params.sessionKey;
    params.entry.usageFamilySessionIds = Array.from(
      new Set([
        ...(params.entry.usageFamilySessionIds ?? []),
        ...(previousSessionId ? [previousSessionId] : []),
        nextSessionId,
      ]),
    );
    changed = true;
  }

  if (nextSessionFile !== params.entry.sessionFile) {
    params.entry.sessionFile = nextSessionFile;
    changed = true;
  }

  return changed;
}

/** Reused helper for persist Cron Skills Snapshot If Changed behavior in src/cron/isolated-agent. */
export async function persistCronSkillsSnapshotIfChanged(params: {
  isFastTestEnv: boolean;
  cronSession: MutableCronSession;
  skillsSnapshot: SkillSnapshot;
  nowMs: number;
  persistSessionEntry: PersistCronSessionEntry;
}) {
  if (
    params.isFastTestEnv ||
    params.skillsSnapshot === params.cronSession.sessionEntry.skillsSnapshot
  ) {
    return;
  }
  params.cronSession.sessionEntry = {
    ...params.cronSession.sessionEntry,
    updatedAt: params.nowMs,
    skillsSnapshot: params.skillsSnapshot,
  };
  await params.persistSessionEntry();
}

/** Reused helper for mark Cron Session Pre Run behavior in src/cron/isolated-agent. */
export function markCronSessionPreRun(params: {
  entry: MutableCronSessionEntry;
  provider: string;
  model: string;
}) {
  params.entry.modelProvider = params.provider;
  params.entry.model = params.model;
  params.entry.systemSent = true;
}

/** Reused helper for sync Cron Session Live Selection behavior in src/cron/isolated-agent. */
export function syncCronSessionLiveSelection(params: {
  entry: MutableCronSessionEntry;
  liveSelection: CronLiveSelection;
}) {
  params.entry.modelProvider = params.liveSelection.provider;
  params.entry.model = params.liveSelection.model;
  if (params.liveSelection.authProfileId) {
    params.entry.authProfileOverride = params.liveSelection.authProfileId;
    params.entry.authProfileOverrideSource = params.liveSelection.authProfileIdSource;
    if (params.liveSelection.authProfileIdSource === "auto") {
      params.entry.authProfileOverrideCompactionCount = params.entry.compactionCount ?? 0;
    } else {
      delete params.entry.authProfileOverrideCompactionCount;
    }
    return;
  }
  delete params.entry.authProfileOverride;
  delete params.entry.authProfileOverrideSource;
  delete params.entry.authProfileOverrideCompactionCount;
}
