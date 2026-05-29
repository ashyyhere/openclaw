// Shared mention detection types.
import type { OpenClawConfig } from "../../config/types.openclaw.js";

/** Shared type for Build Mention Regexes in src/auto-reply/reply. */
export type BuildMentionRegexes = (cfg: OpenClawConfig | undefined, agentId?: string) => RegExp[];

/** Shared type for Matches Mention Patterns in src/auto-reply/reply. */
export type MatchesMentionPatterns = (text: string, mentionRegexes: RegExp[]) => boolean;

/** Shared type for Explicit Mention Signal in src/auto-reply/reply. */
export type ExplicitMentionSignal = {
  hasAnyMention: boolean;
  isExplicitlyMentioned: boolean;
  canResolveExplicit: boolean;
};

/** Shared type for Matches Mention With Explicit in src/auto-reply/reply. */
export type MatchesMentionWithExplicit = (params: {
  text: string;
  mentionRegexes: RegExp[];
  explicit?: ExplicitMentionSignal;
  transcript?: string;
}) => boolean;
