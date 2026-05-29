// OpenClaw utils helpers and runtime behavior.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathExists as fsSafePathExists } from "./infra/fs-safe.js";
import {
  resolveEffectiveHomeDir,
  resolveHomeRelativePath,
  resolveRequiredHomeDir,
} from "./infra/home-dir.js";
import { isPlainObject } from "./infra/plain-object.js";
/** Re-exported API for src, starting with escape Reg Exp. */
export { escapeRegExp } from "./shared/regexp.js";

/** Reused helper for ensure Dir behavior in src. */
export async function ensureDir(dir: string) {
  await fs.promises.mkdir(dir, { recursive: true });
}

/** Reused helper for clamp Number behavior in src. */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Reused helper for clamp Int behavior in src. */
export function clampInt(value: number, min: number, max: number): number {
  return clampNumber(Math.floor(value), min, max);
}

/** Alias for clampNumber (shorter, more common name) */
export const clamp = clampNumber;

/**
 * Safely parse JSON, returning null on error instead of throwing.
 */
// oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- JSON parsing helper lets callers ascribe the expected payload type.
/** Reused helper for safe Parse Json behavior in src. */
export function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Re-exported API for src, starting with is Plain Object. */
export { isPlainObject };

/**
 * Type guard for Record<string, unknown> (less strict than isPlainObject).
 * Accepts any non-null object that isn't an array.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reused helper for normalize E164 behavior in src. */
export function normalizeE164(number: string): string {
  const withoutPrefix = number.replace(/^[a-z][a-z0-9-]*:/i, "").trim();
  const digits = withoutPrefix.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    return `+${digits.slice(1)}`;
  }
  return `+${digits}`;
}

/** Reused helper for sleep behavior in src. */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isHighSurrogate(codeUnit: number): boolean {
  return codeUnit >= 0xd800 && codeUnit <= 0xdbff;
}

function isLowSurrogate(codeUnit: number): boolean {
  return codeUnit >= 0xdc00 && codeUnit <= 0xdfff;
}

/** Reused helper for slice Utf16 Safe behavior in src. */
export function sliceUtf16Safe(input: string, start: number, end?: number): string {
  const len = input.length;

  let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  let to = end === undefined ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);

  if (to < from) {
    const tmp = from;
    from = to;
    to = tmp;
  }

  if (from > 0 && from < len) {
    const codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }

  if (to > 0 && to < len) {
    const codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }

  return input.slice(from, to);
}

/** Reused helper for truncate Utf16 Safe behavior in src. */
export function truncateUtf16Safe(input: string, maxLen: number): string {
  const limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}

/** Reused helper for resolve User Path behavior in src. */
export function resolveUserPath(
  input: string,
  env: NodeJS.ProcessEnv = process.env,
  homedir: () => string = os.homedir,
): string {
  if (!input) {
    return "";
  }
  return resolveHomeRelativePath(input, { env, homedir });
}

/** Reused helper for resolve Config Dir behavior in src. */
export function resolveConfigDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir: () => string = os.homedir,
): string {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath(override, env, homedir);
  }
  const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
  if (configPath) {
    return path.dirname(resolveUserPath(configPath, env, homedir));
  }
  const newDir = path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
  try {
    const hasNew = fs.existsSync(newDir);
    if (hasNew) {
      return newDir;
    }
  } catch {
    // best-effort
  }
  return newDir;
}

/** Reused helper for resolve Home Dir behavior in src. */
export function resolveHomeDir(): string | undefined {
  return resolveEffectiveHomeDir(process.env, os.homedir);
}

function resolveHomeDisplayPrefix(): { home: string; prefix: string } | undefined {
  const home = resolveHomeDir();
  if (!home) {
    return undefined;
  }
  const explicitHome = process.env.OPENCLAW_HOME?.trim();
  if (explicitHome) {
    return { home, prefix: "$OPENCLAW_HOME" };
  }
  return { home, prefix: "~" };
}

/** Reused helper for shorten Home Path behavior in src. */
export function shortenHomePath(input: string): string {
  if (!input) {
    return input;
  }
  const display = resolveHomeDisplayPrefix();
  if (!display) {
    return input;
  }
  const { home, prefix } = display;
  if (input === home) {
    return prefix;
  }
  if (input.startsWith(`${home}/`) || input.startsWith(`${home}\\`)) {
    return `${prefix}${input.slice(home.length)}`;
  }
  return input;
}

/** Reused helper for shorten Home In String behavior in src. */
export function shortenHomeInString(input: string): string {
  if (!input) {
    return input;
  }
  const display = resolveHomeDisplayPrefix();
  if (!display) {
    return input;
  }
  return input.split(display.home).join(display.prefix);
}

/** Reused helper for display Path behavior in src. */
export function displayPath(input: string): string {
  return shortenHomePath(input);
}

/** Reused helper for display String behavior in src. */
export function displayString(input: string): string {
  return shortenHomeInString(input);
}

// Configuration root; can be overridden via OPENCLAW_STATE_DIR.
/** Reused constant for CONFIG DIR behavior in src. */
export const CONFIG_DIR = resolveConfigDir();
/**
 * Check if a file or directory exists at the given path.
 */
export async function pathExists(targetPath: string): Promise<boolean> {
  return await fsSafePathExists(targetPath);
}
