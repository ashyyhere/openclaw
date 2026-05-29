// Local user identity normalizer for chat display. It bounds names, text avatars,
// and image avatar payloads before rendering them in the Control UI.
import { coerceIdentityValue } from "../../../src/shared/assistant-identity-values.js";
import { normalizeOptionalString } from "./string-coerce.ts";
import {
  isRenderableControlUiAvatarUrl,
  resolveChatAvatarRenderUrl,
} from "./views/agents-utils.ts";

const MAX_LOCAL_USER_NAME = 50;
const MAX_LOCAL_USER_TEXT_AVATAR = 16;
const MAX_LOCAL_USER_IMAGE_AVATAR = 2_000_000;

/** Locally configured chat identity for the current Control UI user. */
export type LocalUserIdentity = {
  name: string | null;
  avatar: string | null;
};

function normalizeAvatar(value?: string | null): string | null {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return null;
  }
  if (isRenderableControlUiAvatarUrl(trimmed)) {
    return trimmed.length <= MAX_LOCAL_USER_IMAGE_AVATAR ? trimmed : null;
  }
  if (/[\r\n]/.test(trimmed)) {
    return null;
  }
  return trimmed.length <= MAX_LOCAL_USER_TEXT_AVATAR ? trimmed : null;
}

/** Normalize and bound local user identity values for storage/rendering. */
export function normalizeLocalUserIdentity(
  input?: Partial<LocalUserIdentity> | null,
): LocalUserIdentity {
  return {
    name:
      coerceIdentityValue(
        typeof input?.name === "string" ? input.name : undefined,
        MAX_LOCAL_USER_NAME,
      ) ?? null,
    avatar: normalizeAvatar(input?.avatar),
  };
}

/** Return whether a normalized identity carries any visible user value. */
export function hasLocalUserIdentity(identity: LocalUserIdentity): boolean {
  return Boolean(identity.name || identity.avatar);
}

/** Resolve the displayed local user name with a fallback. */
export function resolveLocalUserName(
  input?: Partial<LocalUserIdentity> | null,
  fallback = "You",
): string {
  return normalizeLocalUserIdentity(input).name ?? fallback;
}

/** Resolve a renderable avatar URL for the local user, if configured. */
export function resolveLocalUserAvatarUrl(
  input?: Partial<LocalUserIdentity> | null,
): string | null {
  const normalized = normalizeLocalUserIdentity(input);
  return resolveChatAvatarRenderUrl(normalized.avatar, {
    identity: {
      avatar: normalized.avatar ?? undefined,
    },
  });
}

/** Resolve a text avatar when the configured avatar is not an image URL. */
export function resolveLocalUserAvatarText(
  input?: Partial<LocalUserIdentity> | null,
): string | null {
  const normalized = normalizeLocalUserIdentity(input);
  const avatar = normalizeOptionalString(normalized.avatar);
  if (!avatar) {
    return null;
  }
  return resolveLocalUserAvatarUrl(normalized) ? null : avatar;
}
