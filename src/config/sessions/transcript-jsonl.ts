// config/sessions transcript jsonl helpers and runtime behavior.
import { appendFileSync, writeFileSync } from "node:fs";
import fs from "node:fs/promises";

type WriteJsonlFileOptions = {
  encoding?: BufferEncoding;
  flag?: string;
  mode?: number;
};

/** Reused helper for serialize Jsonl Entry behavior in src/config/sessions. */
export function serializeJsonlEntry(entry: unknown): string {
  return `${serializeJsonlLine(entry)}\n`;
}

/** Reused helper for serialize Jsonl Line behavior in src/config/sessions. */
export function serializeJsonlLine(entry: unknown): string {
  return JSON.stringify(entry);
}

/** Reused helper for serialize Jsonl Entries behavior in src/config/sessions. */
export function serializeJsonlEntries(entries: readonly unknown[]): string {
  return serializeJsonlLines(entries.map(serializeJsonlLine));
}

/** Reused helper for serialize Jsonl Lines behavior in src/config/sessions. */
export function serializeJsonlLines(lines: readonly string[]): string {
  return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

/** Reused helper for write Jsonl Entries Sync behavior in src/config/sessions. */
export function writeJsonlEntriesSync(filePath: string, entries: readonly unknown[]): void {
  writeFileSync(filePath, serializeJsonlEntries(entries), "utf-8");
}

/** Reused helper for append Jsonl Entry Sync behavior in src/config/sessions. */
export function appendJsonlEntrySync(filePath: string, entry: unknown): void {
  appendFileSync(filePath, serializeJsonlEntry(entry), "utf-8");
}

/** Reused helper for append Jsonl Entries Sync behavior in src/config/sessions. */
export function appendJsonlEntriesSync(filePath: string, entries: readonly unknown[]): void {
  if (entries.length === 0) {
    return;
  }
  appendFileSync(filePath, serializeJsonlEntries(entries), "utf-8");
}

/** Reused helper for write Jsonl Entry behavior in src/config/sessions. */
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

/** Reused helper for write Jsonl Lines behavior in src/config/sessions. */
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

/** Reused helper for append Jsonl Entry behavior in src/config/sessions. */
export async function appendJsonlEntry(filePath: string, entry: unknown): Promise<void> {
  await fs.appendFile(filePath, serializeJsonlEntry(entry), "utf-8");
}
