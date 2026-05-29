// Group chat activation mode parsing and command handling.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Shared type for Group Activation Mode in src/auto-reply. */
export type GroupActivationMode = "mention" | "always";

/** Reused helper for normalize Group Activation behavior in src/auto-reply. */
export function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined {
  const value = normalizeOptionalLowercaseString(raw);
  if (value === "mention") {
    return "mention";
  }
  if (value === "always") {
    return "always";
  }
  return undefined;
}

/** Reused helper for parse Activation Command behavior in src/auto-reply. */
export function parseActivationCommand(raw?: string): {
  hasCommand: boolean;
  mode?: GroupActivationMode;
} {
  if (!raw) {
    return { hasCommand: false };
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return { hasCommand: false };
  }
  const normalized = trimmed.replace(/^\/([^\s:]+)\s*:(.*)$/, (_, cmd: string, rest: string) => {
    const trimmedRest = rest.trimStart();
    return trimmedRest ? `/${cmd} ${trimmedRest}` : `/${cmd}`;
  });
  const match = normalized.match(/^\/activation(?:\s+([a-zA-Z]+))?\s*$/i);
  if (!match) {
    return { hasCommand: false };
  }
  const mode = normalizeGroupActivation(match[1]);
  return { hasCommand: true, mode };
}
