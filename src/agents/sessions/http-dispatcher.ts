/** Configures global Undici dispatcher idle timeouts for session HTTP calls. */
import * as undici from "undici";
import { parseStrictNonNegativeInteger } from "../../infra/parse-finite-number.js";

/** Reused constant for DEFAULT HTTP IDLE TIMEOUT MS behavior in src/agents/sessions. */
export const DEFAULT_HTTP_IDLE_TIMEOUT_MS = 300_000;

/** Reused constant for HTTP IDLE TIMEOUT CHOICES behavior in src/agents/sessions. */
export const HTTP_IDLE_TIMEOUT_CHOICES = [
  { label: "30 sec", timeoutMs: 30_000 },
  { label: "1 min", timeoutMs: 60_000 },
  { label: "2 min", timeoutMs: 120_000 },
  { label: "5 min", timeoutMs: 300_000 },
  { label: "disabled", timeoutMs: 0 },
] as const;

/** Parses an HTTP idle timeout override in milliseconds. */
export function parseHttpIdleTimeoutMs(value: unknown): number | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.toLowerCase() === "disabled") {
      return 0;
    }
    if (trimmed.length === 0) {
      return undefined;
    }
    return parseStrictNonNegativeInteger(trimmed);
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return undefined;
  }
  return Math.floor(value);
}

/** Formats an idle timeout into compact operator text. */
export function formatHttpIdleTimeoutMs(timeoutMs: number): string {
  const choice = HTTP_IDLE_TIMEOUT_CHOICES.find((item) => item.timeoutMs === timeoutMs);
  if (choice) {
    return choice.label;
  }
  return `${timeoutMs / 1000} sec`;
}

/** Installs a process-wide Undici dispatcher with the requested idle timeout. */
export function configureHttpDispatcher(timeoutMs: number = DEFAULT_HTTP_IDLE_TIMEOUT_MS): void {
  const normalizedTimeoutMs = parseHttpIdleTimeoutMs(timeoutMs);
  if (normalizedTimeoutMs === undefined) {
    throw new Error(`Invalid HTTP idle timeout: ${String(timeoutMs)}`);
  }
  undici.setGlobalDispatcher(
    new undici.EnvHttpProxyAgent({
      allowH2: false,
      bodyTimeout: normalizedTimeoutMs,
      headersTimeout: normalizedTimeoutMs,
    }),
  );
  // Keep fetch and the dispatcher on the same undici implementation. Node 26.0's
  // bundled fetch can otherwise consume compressed responses through npm undici's
  // dispatcher without decompressing them, causing response.json() failures.
  undici.install?.();
}
