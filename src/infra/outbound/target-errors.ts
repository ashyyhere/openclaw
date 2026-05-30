// Shared outbound target error messages.
// Helpers keep CLI/tool errors consistent across channel target resolvers.
/** Build the message for a missing outbound target. */
export function missingTargetMessage(provider: string, hint?: string): string {
  return `Delivering to ${provider} requires target${formatTargetHint(hint)}`;
}

/** Build an Error for a missing outbound target. */
export function missingTargetError(provider: string, hint?: string): Error {
  return new Error(missingTargetMessage(provider, hint));
}

/** Build the message for an ambiguous directory target match. */
export function ambiguousTargetMessage(provider: string, raw: string, hint?: string): string {
  return `Ambiguous target "${raw}" for ${provider}. Provide a unique name or an explicit id.${formatTargetHint(hint, true)}`;
}

/** Build an Error for an ambiguous directory target match. */
export function ambiguousTargetError(provider: string, raw: string, hint?: string): Error {
  return new Error(ambiguousTargetMessage(provider, raw, hint));
}

/** Build the message for an unknown outbound target. */
export function unknownTargetMessage(provider: string, raw: string, hint?: string): string {
  return `Unknown target "${raw}" for ${provider}.${formatTargetHint(hint, true)}`;
}

/** Build an Error for an unknown outbound target. */
export function unknownTargetError(provider: string, raw: string, hint?: string): Error {
  return new Error(unknownTargetMessage(provider, raw, hint));
}

function formatTargetHint(hint?: string, withLabel = false): string {
  const normalized = hint?.trim();
  if (!normalized) {
    return "";
  }
  return withLabel ? ` Hint: ${normalized}` : ` ${normalized}`;
}
