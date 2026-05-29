/** Shared channel target builders and validators for messaging destinations. */
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Directory config params re-exported for channel setup and docs helpers. */
export type { DirectoryConfigParams } from "./plugins/directory-types.js";
/** Public directory entry shape re-exported for channel target pickers. */
export type { ChannelDirectoryEntry } from "./plugins/types.public.js";

/** Supported generic messaging destination families. */
export type MessagingTargetKind = "user" | "channel";

/** Parsed messaging destination with raw and normalized forms for comparisons. */
export type MessagingTarget = {
  kind: MessagingTargetKind;
  id: string;
  raw: string;
  normalized: string;
};

/** Parser options for channel-specific destination grammars. */
export type MessagingTargetParseOptions = {
  defaultKind?: MessagingTargetKind;
  ambiguousMessage?: string;
};

/** Build the normalized comparison key for a target kind/id pair. */
export function normalizeTargetId(kind: MessagingTargetKind, id: string): string {
  return normalizeLowercaseStringOrEmpty(`${kind}:${id}`);
}

/** Build a parsed target while preserving the user-supplied raw string. */
export function buildMessagingTarget(
  kind: MessagingTargetKind,
  id: string,
  raw: string,
): MessagingTarget {
  return {
    kind,
    id,
    raw,
    normalized: normalizeTargetId(kind, id),
  };
}

/** Validate a target id against a channel grammar and return the original id. */
export function ensureTargetId(params: {
  candidate: string;
  pattern: RegExp;
  errorMessage: string;
}): string {
  if (!params.pattern.test(params.candidate)) {
    throw new Error(params.errorMessage);
  }
  return params.candidate;
}

/** Parse native mention syntax into a messaging target when the regex captures an id. */
export function parseTargetMention(params: {
  raw: string;
  mentionPattern: RegExp;
  kind: MessagingTargetKind;
}): MessagingTarget | undefined {
  const match = params.raw.match(params.mentionPattern);
  if (!match?.[1]) {
    return undefined;
  }
  return buildMessagingTarget(params.kind, match[1], params.raw);
}

/** Parse a single `prefix:id`-style target. */
export function parseTargetPrefix(params: {
  raw: string;
  prefix: string;
  kind: MessagingTargetKind;
}): MessagingTarget | undefined {
  if (!params.raw.startsWith(params.prefix)) {
    return undefined;
  }
  const id = params.raw.slice(params.prefix.length).trim();
  return id ? buildMessagingTarget(params.kind, id, params.raw) : undefined;
}

/** Try prefixed target grammars in order and return the first match. */
export function parseTargetPrefixes(params: {
  raw: string;
  prefixes: Array<{ prefix: string; kind: MessagingTargetKind }>;
}): MessagingTarget | undefined {
  for (const entry of params.prefixes) {
    const parsed = parseTargetPrefix({
      raw: params.raw,
      prefix: entry.prefix,
      kind: entry.kind,
    });
    if (parsed) {
      return parsed;
    }
  }
  return undefined;
}

/** Parse shorthand `@user` syntax with channel-specific id validation. */
export function parseAtUserTarget(params: {
  raw: string;
  pattern: RegExp;
  errorMessage: string;
}): MessagingTarget | undefined {
  if (!params.raw.startsWith("@")) {
    return undefined;
  }
  const candidate = params.raw.slice(1).trim();
  const id = ensureTargetId({
    candidate,
    pattern: params.pattern,
    errorMessage: params.errorMessage,
  });
  return buildMessagingTarget("user", id, params.raw);
}

/** Parse mention, prefixed, then `@user` target forms in precedence order. */
export function parseMentionPrefixOrAtUserTarget(params: {
  raw: string;
  mentionPattern: RegExp;
  prefixes: Array<{ prefix: string; kind: MessagingTargetKind }>;
  atUserPattern: RegExp;
  atUserErrorMessage: string;
}): MessagingTarget | undefined {
  const mentionTarget = parseTargetMention({
    raw: params.raw,
    mentionPattern: params.mentionPattern,
    kind: "user",
  });
  if (mentionTarget) {
    return mentionTarget;
  }
  const prefixedTarget = parseTargetPrefixes({
    raw: params.raw,
    prefixes: params.prefixes,
  });
  if (prefixedTarget) {
    return prefixedTarget;
  }
  return parseAtUserTarget({
    raw: params.raw,
    pattern: params.atUserPattern,
    errorMessage: params.atUserErrorMessage,
  });
}

/** Require a parsed target of the expected kind and return its channel-specific id. */
export function requireTargetKind(params: {
  platform: string;
  target: MessagingTarget | undefined;
  kind: MessagingTargetKind;
}): string {
  const kindLabel = params.kind;
  if (!params.target) {
    throw new Error(`${params.platform} ${kindLabel} id is required.`);
  }
  if (params.target.kind !== params.kind) {
    throw new Error(`${params.platform} ${kindLabel} id is required (use ${kindLabel}:<id>).`);
  }
  return params.target.id;
}
