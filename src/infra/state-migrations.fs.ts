// infra state migrations fs helpers and runtime behavior.
import fs from "node:fs";
import JSON5 from "json5";

/** Shared type for Session Entry Like in src/infra. */
export type SessionEntryLike = {
  sessionId?: string;
  updatedAt?: number;
} & Record<string, unknown>;

/** Reused helper for safe Read Dir behavior in src/infra. */
export function safeReadDir(dir: string): fs.Dirent[] {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

/** Reused helper for exists Dir behavior in src/infra. */
export function existsDir(dir: string): boolean {
  try {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

/** Reused helper for ensure Dir behavior in src/infra. */
export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Reused helper for file Exists behavior in src/infra. */
export function fileExists(p: string): boolean {
  try {
    return fs.existsSync(p) && fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

/** Reused helper for is Legacy Whats App Auth File behavior in src/infra. */
export function isLegacyWhatsAppAuthFile(name: string): boolean {
  if (name === "creds.json" || name === "creds.json.bak") {
    return true;
  }
  if (!name.endsWith(".json")) {
    return false;
  }
  return /^(app-state-sync|session|sender-key|pre-key)-/.test(name);
}

/** Reused helper for read Session Store Json5 behavior in src/infra. */
export function readSessionStoreJson5(storePath: string): {
  store: Record<string, SessionEntryLike>;
  ok: boolean;
} {
  try {
    const raw = fs.readFileSync(storePath, "utf-8");
    return parseSessionStoreJson5(raw);
  } catch {
    // ignore
  }
  return { store: {}, ok: false };
}

/** Reused helper for parse Session Store Json5 behavior in src/infra. */
export function parseSessionStoreJson5(raw: string): {
  store: Record<string, SessionEntryLike>;
  ok: boolean;
} {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { store: parsed as Record<string, SessionEntryLike>, ok: true };
    }
  } catch {
    // Fall through to JSON5 for legacy/operator-edited stores.
  }
  try {
    const parsed = JSON5.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { store: parsed as Record<string, SessionEntryLike>, ok: true };
    }
  } catch {
    // ignore
  }
  return { store: {}, ok: false };
}
