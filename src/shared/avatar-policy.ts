// Shared avatar input policy for local paths, HTTP URLs, and data URLs used by
// config, UI, and plugin surfaces.
import path from "node:path";
import { isPathInside } from "../infra/path-guards.js";
import { normalizeLowercaseStringOrEmpty } from "./string-coerce.js";

/** Maximum avatar payload size accepted by local file and data URL handling. */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

const LOCAL_AVATAR_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

const AVATAR_MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
};

/** Matches any data URL so callers can reject or route inline avatar payloads. */
export const AVATAR_DATA_RE = /^data:/i;
/** Matches image data URLs accepted by avatar rendering paths. */
export const AVATAR_IMAGE_DATA_RE = /^data:image\//i;
/** Matches remote HTTP(S) avatar URLs. */
export const AVATAR_HTTP_RE = /^https?:\/\//i;
/** Matches URI schemes so workspace-relative paths can reject non-file URLs. */
export const AVATAR_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
/** Matches Windows absolute paths, which otherwise look like URI schemes. */
export const WINDOWS_ABS_RE = /^[a-zA-Z]:[\\/]/;

const AVATAR_PATH_EXT_RE = /\.(png|jpe?g|gif|webp|svg|ico)$/i;

/** Resolves an avatar MIME type from its file extension for data URL creation. */
export function resolveAvatarMime(filePath: string): string {
  const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
  return AVATAR_MIME_BY_EXT[ext] ?? "application/octet-stream";
}

/** Returns whether a value is any data URL. */
export function isAvatarDataUrl(value: string): boolean {
  return AVATAR_DATA_RE.test(value);
}

/** Returns whether a value is an image data URL. */
export function isAvatarImageDataUrl(value: string): boolean {
  return AVATAR_IMAGE_DATA_RE.test(value);
}

/** Returns whether a value is an HTTP(S) avatar URL. */
export function isAvatarHttpUrl(value: string): boolean {
  return AVATAR_HTTP_RE.test(value);
}

/** Returns whether a value starts with a URI scheme prefix. */
export function hasAvatarUriScheme(value: string): boolean {
  return AVATAR_SCHEME_RE.test(value);
}

/** Returns whether a value is a Windows absolute path. */
export function isWindowsAbsolutePath(value: string): boolean {
  return WINDOWS_ABS_RE.test(value);
}

/** Allows workspace-relative avatar paths while rejecting home paths and non-file URLs. */
export function isWorkspaceRelativeAvatarPath(value: string): boolean {
  if (!value) {
    return false;
  }
  if (value.startsWith("~")) {
    return false;
  }
  if (hasAvatarUriScheme(value) && !isWindowsAbsolutePath(value)) {
    return false;
  }
  return true;
}

/** Checks that a resolved avatar path remains inside its allowed root. */
export function isPathWithinRoot(rootDir: string, targetPath: string): boolean {
  return isPathInside(rootDir, targetPath);
}

/** Heuristically detects avatar-looking local paths from separators or image extensions. */
export function looksLikeAvatarPath(value: string): boolean {
  if (/[\\/]/.test(value)) {
    return true;
  }
  return AVATAR_PATH_EXT_RE.test(value);
}

/** Returns whether a local avatar file extension is supported by policy. */
export function isSupportedLocalAvatarExtension(filePath: string): boolean {
  const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
  return LOCAL_AVATAR_EXTENSIONS.has(ext);
}
