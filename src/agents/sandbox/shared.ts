/** Shared naming helpers for sandbox sessions, scopes, and workspaces. */
import path from "node:path";
import { normalizeAgentId } from "../../routing/session-key.js";
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";
import { resolveUserPath } from "../../utils.js";
import { resolveAgentIdFromSessionKey } from "../agent-scope.js";
import { hashTextSha256 } from "./hash.js";

/** Converts a session key into a filesystem/container-safe slug. */
export function slugifySessionKey(value: string) {
  const trimmed = value.trim() || "session";
  const hash = hashTextSha256(trimmed).slice(0, 8);
  const safe = normalizeLowercaseStringOrEmpty(trimmed)
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const base = safe.slice(0, 32) || "session";
  return `${base}-${hash}`;
}

/** Resolves the host workspace directory for a sandbox session key. */
export function resolveSandboxWorkspaceDir(root: string, sessionKey: string) {
  const resolvedRoot = resolveUserPath(root);
  const slug = slugifySessionKey(sessionKey);
  return path.join(resolvedRoot, slug);
}

/** Resolves the scope key used to group sandbox container ownership. */
export function resolveSandboxScopeKey(scope: "session" | "agent" | "shared", sessionKey: string) {
  const trimmed = sessionKey.trim() || "main";
  if (scope === "shared") {
    return "shared";
  }
  if (scope === "session") {
    return trimmed;
  }
  const agentId = resolveAgentIdFromSessionKey(trimmed);
  return `agent:${agentId}`;
}

/** Extracts an agent id from an agent-scoped sandbox key when present. */
export function resolveSandboxAgentId(scopeKey: string): string | undefined {
  const trimmed = scopeKey.trim();
  if (!trimmed || trimmed === "shared") {
    return undefined;
  }
  const parts = trimmed.split(":").filter(Boolean);
  if (parts[0] === "agent" && parts[1]) {
    return normalizeAgentId(parts[1]);
  }
  return resolveAgentIdFromSessionKey(trimmed);
}
