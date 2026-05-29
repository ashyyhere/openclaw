// secrets shared helpers and runtime behavior.
import fs from "node:fs";
import path from "node:path";
import { privateFileStoreSync } from "../infra/private-file-store.js";
import { replaceFileAtomicSync } from "../infra/replace-file.js";
/** Re-exported API for src/secrets, starting with is Record. */
export { isRecord } from "../utils.js";

/** Reused helper for is Non Empty String behavior in src/secrets. */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Reused helper for parse Env Value behavior in src/secrets. */
export function parseEnvValue(raw: string): string {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/** Reused helper for normalize Positive Int behavior in src/secrets. */
export function normalizePositiveInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.floor(value));
  }
  return Math.max(1, Math.floor(fallback));
}

/** Reused helper for parse Dot Path behavior in src/secrets. */
export function parseDotPath(pathname: string): string[] {
  return pathname
    .split(".")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

/** Reused helper for to Dot Path behavior in src/secrets. */
export function toDotPath(segments: string[]): string {
  return segments.join(".");
}

/** Reused helper for ensure Dir For File behavior in src/secrets. */
export function ensureDirForFile(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
}

/** Reused helper for write Json File Secure behavior in src/secrets. */
export function writeJsonFileSecure(pathname: string, value: unknown): void {
  privateFileStoreSync(path.dirname(pathname)).writeJson(path.basename(pathname), value, {
    trailingNewline: true,
  });
}

/** Reused helper for read Text File If Exists behavior in src/secrets. */
export function readTextFileIfExists(pathname: string): string | null {
  if (!fs.existsSync(pathname)) {
    return null;
  }
  return fs.readFileSync(pathname, "utf8");
}

/** Reused helper for write Text File Atomic behavior in src/secrets. */
export function writeTextFileAtomic(pathname: string, value: string, mode = 0o600): void {
  if (mode !== 0o600) {
    replaceFileAtomicSync({
      filePath: pathname,
      content: value,
      mode,
      tempPrefix: ".openclaw-secrets",
    });
    return;
  }
  privateFileStoreSync(path.dirname(pathname)).writeText(path.basename(pathname), value);
}
