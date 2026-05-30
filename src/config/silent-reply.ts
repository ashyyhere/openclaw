// Silent-reply policy resolution for sessions and surfaces.
import {
  classifySilentReplyConversationType,
  resolveSilentReplyPolicyFromPolicies,
  type SilentReplyConversationType,
  type SilentReplyPolicy,
  type SilentReplyPolicyShape,
} from "../shared/silent-reply-policy.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import type { OpenClawConfig } from "./types.openclaw.js";

type ResolveSilentReplyParams = {
  cfg?: OpenClawConfig;
  sessionKey?: string;
  surface?: string;
  conversationType?: SilentReplyConversationType;
};

function resolveSilentReplyConversationContext(params: ResolveSilentReplyParams): {
  conversationType: SilentReplyConversationType;
  defaultPolicy?: SilentReplyPolicyShape;
  surfacePolicy?: SilentReplyPolicyShape;
} {
  const conversationType = classifySilentReplyConversationType({
    sessionKey: params.sessionKey,
    surface: params.surface,
    conversationType: params.conversationType,
  });
  const normalizedSurface = normalizeLowercaseStringOrEmpty(params.surface);
  const surface = normalizedSurface ? params.cfg?.surfaces?.[normalizedSurface] : undefined;
  return {
    conversationType,
    defaultPolicy: params.cfg?.agents?.defaults?.silentReply,
    surfacePolicy: surface?.silentReply,
  };
}

/** Resolve silent-reply settings for a conversation context. */
export function resolveSilentReplySettings(params: ResolveSilentReplyParams): {
  policy: SilentReplyPolicy;
} {
  const context = resolveSilentReplyConversationContext(params);
  return {
    policy: resolveSilentReplyPolicyFromPolicies(context),
  };
}

/** Resolve only the silent-reply policy for a conversation context. */
export function resolveSilentReplyPolicy(params: ResolveSilentReplyParams): SilentReplyPolicy {
  return resolveSilentReplySettings(params).policy;
}
