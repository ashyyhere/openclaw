// Shared filesystem, dot-path, and scalar parsing helpers for secret stores.
import fs from "node:fs";
import path from "node:path";
import { privateFileStoreSync } from "../infra/private-file-store.js";
import { replaceFileAtomicSync } from "../infra/replace-file.js";
/** Runtime object guard shared by secret config readers and resolvers. */
export { isRecord } from "../utils.js";

/** Narrows unknown input to a trimmed non-empty string. */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Parses env-style values and removes one surrounding quote pair when present. */
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

/** Normalizes numeric secret-store options that must be positive integers. */
export function normalizePositiveInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.floor(value));
  }
  return Math.max(1, Math.floor(fallback));
}

/** Splits a dotted config path into non-empty path segments. */
export function parseDotPath(pathname: string): string[] {
  return pathname
    .split(".")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

/** Joins config path segments into the dotted form used in diagnostics and SecretRefs. */
export function toDotPath(segments: string[]): string {
  return segments.join(".");
}

/** Ensures the parent directory exists with private permissions before writing a secret file. */
export function ensureDirForFile(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
}

/** Writes JSON through the private-file store so secret files keep restrictive permissions. */
export function writeJsonFileSecure(pathname: string, value: unknown): void {
  privateFileStoreSync(path.dirname(pathname)).writeJson(path.basename(pathname), value, {
    trailingNewline: true,
  });
}

/** Reads optional text secret material without throwing when the file is absent. */
export function readTextFileIfExists(pathname: string): string | null {
  if (!fs.existsSync(pathname)) {
    return null;
  }
  return fs.readFileSync(pathname, "utf8");
}

/** Writes secret text atomically, using the private-file store for the default 0600 mode. */
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
