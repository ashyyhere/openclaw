// Controller helpers for assistant identity display. Remote identity loads are
// versioned by session key so stale async responses cannot overwrite a newer
// session, while local avatar overrides still win.
import { normalizeAssistantIdentity } from "../assistant-identity.ts";
import type { GatewayBrowserClient } from "../gateway.ts";
import { loadLocalAssistantIdentity, saveLocalAssistantIdentity } from "../storage.ts";

/** Mutable state for assistant name/avatar resolved for the active session. */
export type AssistantIdentityState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  sessionKey: string;
  assistantName: string;
  assistantAvatar: string | null;
  assistantAvatarSource?: string | null;
  assistantAvatarStatus?: "none" | "local" | "remote" | "data" | null;
  assistantAvatarReason?: string | null;
  assistantAgentId: string | null;
};

/** Minimal state updated when the user changes a local assistant avatar. */
export type AssistantAvatarOverrideState = {
  assistantAvatar?: string | null;
  assistantAvatarSource?: string | null;
  assistantAvatarStatus?: "none" | "local" | "remote" | "data" | null;
  assistantAvatarReason?: string | null;
};

const assistantIdentityRequestVersions = new WeakMap<object, number>();

function beginAssistantIdentityRequest(state: AssistantIdentityState): number {
  const key = state as object;
  const nextVersion = (assistantIdentityRequestVersions.get(key) ?? 0) + 1;
  assistantIdentityRequestVersions.set(key, nextVersion);
  return nextVersion;
}

function shouldApplyAssistantIdentityResult(
  state: AssistantIdentityState,
  version: number,
  sessionKey: string,
): boolean {
  return (
    assistantIdentityRequestVersions.get(state as object) === version &&
    state.sessionKey.trim() === sessionKey
  );
}

/** Load assistant identity for the current or provided session key. */
export async function loadAssistantIdentity(
  state: AssistantIdentityState,
  opts?: { sessionKey?: string },
) {
  if (!state.client || !state.connected) {
    return;
  }
  const sessionKey = opts?.sessionKey?.trim() || state.sessionKey.trim();
  const params = sessionKey ? { sessionKey } : {};
  const requestVersion = beginAssistantIdentityRequest(state);
  try {
    const res = await state.client.request("agent.identity.get", params);
    if (!shouldApplyAssistantIdentityResult(state, requestVersion, sessionKey)) {
      return;
    }
    if (!res) {
      return;
    }
    const normalized = normalizeAssistantIdentity(res);
    state.assistantName = normalized.name;
    state.assistantAvatar = normalized.avatar;
    state.assistantAvatarSource = normalized.avatarSource ?? null;
    state.assistantAvatarStatus = normalized.avatarStatus ?? null;
    state.assistantAvatarReason = normalized.avatarReason ?? null;
    state.assistantAgentId = normalized.agentId ?? null;
    // Local override always wins — same pattern as the user avatar.
    const localAvatar = loadLocalAssistantIdentity().avatar;
    if (localAvatar) {
      state.assistantAvatar = localAvatar;
      state.assistantAvatarSource = localAvatar;
      state.assistantAvatarStatus = "data";
      state.assistantAvatarReason = null;
    }
  } catch {
    // Ignore errors; keep last known identity.
  }
}

/** Persist and apply a local assistant avatar override. */
export function setAssistantAvatarOverride(
  state: AssistantAvatarOverrideState,
  avatar: string | null,
) {
  saveLocalAssistantIdentity({ avatar });
  if (avatar) {
    state.assistantAvatar = avatar;
    state.assistantAvatarSource = avatar;
    state.assistantAvatarStatus = "data";
    state.assistantAvatarReason = null;
  } else {
    state.assistantAvatar = null;
    state.assistantAvatarSource = null;
    state.assistantAvatarStatus = null;
    state.assistantAvatarReason = null;
  }
}
