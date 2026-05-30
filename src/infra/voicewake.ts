// Stores voice wake trigger words in state settings.
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";
import { createAsyncLock, tryReadJson, writeJson } from "./json-files.js";

type VoiceWakeConfig = {
  triggers: string[];
  updatedAtMs: number;
};

const DEFAULT_TRIGGERS = ["openclaw", "claude", "computer"];

function resolvePath(baseDir?: string) {
  const root = baseDir ?? resolveStateDir();
  return path.join(root, "settings", "voicewake.json");
}

function sanitizeTriggers(triggers: string[] | undefined | null): string[] {
  const cleaned = (triggers ?? [])
    .map((w) => normalizeOptionalString(w) ?? "")
    .filter((w) => w.length > 0);
  return cleaned.length > 0 ? cleaned : DEFAULT_TRIGGERS;
}

const withLock = createAsyncLock();

/** Returns the default voice wake trigger words. */
export function defaultVoiceWakeTriggers() {
  return [...DEFAULT_TRIGGERS];
}

/** Loads voice wake config, falling back to defaults for missing/invalid files. */
export async function loadVoiceWakeConfig(baseDir?: string): Promise<VoiceWakeConfig> {
  const filePath = resolvePath(baseDir);
  const existing = await tryReadJson<VoiceWakeConfig>(filePath);
  if (!existing) {
    return { triggers: defaultVoiceWakeTriggers(), updatedAtMs: 0 };
  }
  return {
    triggers: sanitizeTriggers(existing.triggers),
    updatedAtMs:
      typeof existing.updatedAtMs === "number" && existing.updatedAtMs > 0
        ? existing.updatedAtMs
        : 0,
  };
}

/** Persists sanitized voice wake trigger words under a file lock. */
export async function setVoiceWakeTriggers(
  triggers: string[],
  baseDir?: string,
): Promise<VoiceWakeConfig> {
  const sanitized = sanitizeTriggers(triggers);
  const filePath = resolvePath(baseDir);
  return await withLock(async () => {
    const next: VoiceWakeConfig = {
      triggers: sanitized,
      updatedAtMs: Date.now(),
    };
    await writeJson(filePath, next);
    return next;
  });
}
