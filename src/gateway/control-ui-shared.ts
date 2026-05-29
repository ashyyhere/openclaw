// gateway control ui shared helpers and runtime behavior.
import {
  isAvatarHttpUrl,
  isAvatarImageDataUrl,
  looksLikeAvatarPath,
} from "../shared/avatar-policy.js";

const CONTROL_UI_AVATAR_PREFIX = "/avatar";

/** Reused helper for normalize Control Ui Base Path behavior in src/gateway. */
export function normalizeControlUiBasePath(basePath?: string): string {
  if (!basePath) {
    return "";
  }
  let normalized = basePath.trim();
  if (!normalized) {
    return "";
  }
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (normalized === "/") {
    return "";
  }
  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

/** Reused helper for build Control Ui Avatar Url behavior in src/gateway. */
export function buildControlUiAvatarUrl(basePath: string, agentId: string): string {
  return basePath
    ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/${agentId}`
    : `${CONTROL_UI_AVATAR_PREFIX}/${agentId}`;
}

/** Reused helper for resolve Assistant Avatar Url behavior in src/gateway. */
export function resolveAssistantAvatarUrl(params: {
  avatar?: string | null;
  agentId?: string | null;
  basePath?: string;
}): string | undefined {
  const avatar = params.avatar?.trim();
  if (!avatar) {
    return undefined;
  }
  if (isAvatarHttpUrl(avatar) || isAvatarImageDataUrl(avatar)) {
    return avatar;
  }

  const basePath = normalizeControlUiBasePath(params.basePath);
  const baseAvatarPrefix = basePath
    ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/`
    : `${CONTROL_UI_AVATAR_PREFIX}/`;
  if (basePath && avatar.startsWith(`${CONTROL_UI_AVATAR_PREFIX}/`)) {
    return `${basePath}${avatar}`;
  }
  if (avatar.startsWith(baseAvatarPrefix)) {
    return avatar;
  }

  if (!params.agentId) {
    return avatar;
  }
  if (looksLikeAvatarPath(avatar)) {
    return buildControlUiAvatarUrl(basePath, params.agentId);
  }
  return avatar;
}

/** Re-exported API for src/gateway, starting with CONTROL UI AVATAR PREFIX. */
export { CONTROL_UI_AVATAR_PREFIX };
