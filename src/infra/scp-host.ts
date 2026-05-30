// SCP host/path safety checks for remote copy commands.
// Inputs are restricted to simple ssh tokens and absolute paths to avoid shell injection.
import { normalizeOptionalString } from "../shared/string-coerce.js";

const SSH_TOKEN = /^[A-Za-z0-9._-]+$/;
const BRACKETED_IPV6 = /^\[[0-9A-Fa-f:.%]+\]$/;
const WHITESPACE = /\s/;
const SCP_REMOTE_PATH_UNSAFE_CHARS = new Set(["\\", "'", '"', "`", "$", ";", "|", "&", "<", ">"]);

function hasControlOrWhitespace(value: string): boolean {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f || WHITESPACE.test(char)) {
      return true;
    }
  }
  return false;
}

/** Normalize a safe SCP remote host of the form host, user@host, or bracketed IPv6. */
export function normalizeScpRemoteHost(value: string | null | undefined): string | undefined {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return undefined;
  }
  if (hasControlOrWhitespace(trimmed)) {
    return undefined;
  }
  if (trimmed.startsWith("-") || trimmed.includes("/") || trimmed.includes("\\")) {
    return undefined;
  }

  const firstAt = trimmed.indexOf("@");
  const lastAt = trimmed.lastIndexOf("@");

  let user: string | undefined;
  let host = trimmed;

  if (firstAt !== -1) {
    if (firstAt !== lastAt || firstAt === 0 || firstAt === trimmed.length - 1) {
      return undefined;
    }
    user = trimmed.slice(0, firstAt);
    host = trimmed.slice(firstAt + 1);
    if (!SSH_TOKEN.test(user)) {
      return undefined;
    }
  }

  if (!host || host.startsWith("-") || host.includes("@")) {
    return undefined;
  }
  if (host.includes(":") && !BRACKETED_IPV6.test(host)) {
    return undefined;
  }
  if (!SSH_TOKEN.test(host) && !BRACKETED_IPV6.test(host)) {
    return undefined;
  }

  return user ? `${user}@${host}` : host;
}

/** Return whether a remote host string is safe for SCP command construction. */
export function isSafeScpRemoteHost(value: string | null | undefined): boolean {
  return normalizeScpRemoteHost(value) !== undefined;
}

/** Normalize an absolute remote path while rejecting shell-sensitive characters. */
export function normalizeScpRemotePath(value: string | null | undefined): string | undefined {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed || !trimmed.startsWith("/")) {
    return undefined;
  }

  for (const char of trimmed) {
    const code = char.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f || SCP_REMOTE_PATH_UNSAFE_CHARS.has(char)) {
      return undefined;
    }
  }

  return trimmed;
}

/** Return whether a remote path string is safe for SCP command construction. */
export function isSafeScpRemotePath(value: string | null | undefined): boolean {
  return normalizeScpRemotePath(value) !== undefined;
}
