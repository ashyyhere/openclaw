// UI style tests load CSS fixtures through these root-relative path helpers.
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

/** Resolve a CSS fixture path from either repo root or the UI package cwd. */
export function resolveStylePath(path: string): string {
  const candidates = [resolve(process.cwd(), path), resolve(process.cwd(), "..", path)];
  const cssPath = candidates.find((candidate) => existsSync(candidate));
  if (!cssPath) {
    throw new Error(`Missing style fixture ${path}; checked ${candidates.join(", ")}`);
  }
  return cssPath;
}

/** Read a CSS fixture synchronously for style parser tests. */
export function readStyleSheet(path: string): string {
  return readFileSync(resolveStylePath(path), "utf8");
}

/** Read a CSS fixture asynchronously for browser-style tests. */
export function readStyleSheetAsync(path: string): Promise<string> {
  return readFile(resolveStylePath(path), "utf8");
}
