// extensions/discord/src session contract helpers and runtime behavior.
export function deriveLegacySessionChatType(sessionKey: string): "channel" | undefined {
  return /^discord:(?:[^:]+:)?guild-[^:]+:channel-[^:]+$/.test(sessionKey) ? "channel" : undefined;
}
