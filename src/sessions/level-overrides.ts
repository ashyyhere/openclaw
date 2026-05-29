// Parses and applies per-session verbose and trace level overrides.
import {
  normalizeTraceLevel,
  normalizeVerboseLevel,
  type TraceLevel,
  type VerboseLevel,
} from "../auto-reply/thinking.js";
import type { SessionEntry } from "../config/sessions.js";

const INVALID_VERBOSE_LEVEL_ERROR = 'invalid verboseLevel (use "on"|"off"|"full")';

/** Parses a verbose-level override, preserving null as an explicit reset. */
export function parseVerboseOverride(
  raw: unknown,
): { ok: true; value: VerboseLevel | null | undefined } | { ok: false; error: string } {
  if (raw === null) {
    return { ok: true, value: null };
  }
  if (raw === undefined) {
    return { ok: true, value: undefined };
  }
  if (typeof raw !== "string") {
    return { ok: false, error: INVALID_VERBOSE_LEVEL_ERROR };
  }
  const normalized = normalizeVerboseLevel(raw);
  if (!normalized) {
    return { ok: false, error: INVALID_VERBOSE_LEVEL_ERROR };
  }
  return { ok: true, value: normalized };
}

/** Applies a parsed verbose-level override to a mutable session entry. */
export function applyVerboseOverride(entry: SessionEntry, level: VerboseLevel | null | undefined) {
  if (level === undefined) {
    return;
  }
  if (level === null) {
    delete entry.verboseLevel;
    return;
  }
  entry.verboseLevel = level;
}

/** Parses a trace-level override, preserving null as an explicit reset. */
export function parseTraceOverride(
  raw: unknown,
): { ok: true; value: TraceLevel | null | undefined } | { ok: false; error: string } {
  if (raw === null) {
    return { ok: true, value: null };
  }
  if (raw === undefined) {
    return { ok: true, value: undefined };
  }
  if (typeof raw !== "string") {
    return { ok: false, error: 'invalid traceLevel (use "on"|"off"|"raw")' };
  }
  const normalized = normalizeTraceLevel(raw);
  if (!normalized) {
    return { ok: false, error: 'invalid traceLevel (use "on"|"off"|"raw")' };
  }
  return { ok: true, value: normalized };
}

/** Applies a parsed trace-level override to a mutable session entry. */
export function applyTraceOverride(entry: SessionEntry, level: TraceLevel | null | undefined) {
  if (level === undefined) {
    return;
  }
  if (level === null) {
    delete entry.traceLevel;
    return;
  }
  entry.traceLevel = level;
}
