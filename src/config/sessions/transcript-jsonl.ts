// JSONL serialization and append/write helpers for session transcript files.
import { appendFileSync, writeFileSync } from "node:fs";
import fs from "node:fs/promises";

type WriteJsonlFileOptions = {
  encoding?: BufferEncoding;
  flag?: string;
  mode?: number;
};

/** Serializes one JSONL entry with a trailing newline. */
export function serializeJsonlEntry(entry: unknown): string {
  return `${serializeJsonlLine(entry)}\n`;
}

/** Serializes one JSONL entry without appending a newline. */
export function serializeJsonlLine(entry: unknown): string {
  return JSON.stringify(entry);
}

/** Serializes multiple entries into newline-terminated JSONL text. */
export function serializeJsonlEntries(entries: readonly unknown[]): string {
  return serializeJsonlLines(entries.map(serializeJsonlLine));
}

/** Joins pre-serialized JSONL lines and appends one final newline when non-empty. */
export function serializeJsonlLines(lines: readonly string[]): string {
  return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

/** Synchronously replaces a transcript file with serialized JSONL entries. */
export function writeJsonlEntriesSync(filePath: string, entries: readonly unknown[]): void {
  writeFileSync(filePath, serializeJsonlEntries(entries), "utf-8");
}

/** Synchronously appends one JSONL entry to a transcript file. */
export function appendJsonlEntrySync(filePath: string, entry: unknown): void {
  appendFileSync(filePath, serializeJsonlEntry(entry), "utf-8");
}

/** Synchronously appends multiple JSONL entries, skipping empty batches. */
export function appendJsonlEntriesSync(filePath: string, entries: readonly unknown[]): void {
  if (entries.length === 0) {
    return;
  }
  appendFileSync(filePath, serializeJsonlEntries(entries), "utf-8");
}

/** Asynchronously writes one JSONL entry with optional fs write options. */
export async function writeJsonlEntry(
  filePath: string,
  entry: unknown,
  options?: WriteJsonlFileOptions,
): Promise<void> {
  await fs.writeFile(filePath, serializeJsonlEntry(entry), {
    encoding: options?.encoding ?? "utf-8",
    ...(options?.flag ? { flag: options.flag } : {}),
    ...(options?.mode !== undefined ? { mode: options.mode } : {}),
  });
}

/** Asynchronously writes pre-serialized JSONL lines with optional fs write options. */
export async function writeJsonlLines(
  filePath: string,
  lines: readonly string[],
  options?: WriteJsonlFileOptions,
): Promise<void> {
  await fs.writeFile(filePath, serializeJsonlLines(lines), {
    encoding: options?.encoding ?? "utf-8",
    ...(options?.flag ? { flag: options.flag } : {}),
    ...(options?.mode !== undefined ? { mode: options.mode } : {}),
  });
}

/** Asynchronously appends one JSONL entry to a transcript file. */
export async function appendJsonlEntry(filePath: string, entry: unknown): Promise<void> {
  await fs.appendFile(filePath, serializeJsonlEntry(entry), "utf-8");
}
