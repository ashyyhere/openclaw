// config redact snapshot secret ref helpers and runtime behavior.
/** Reused helper for is Secret Ref Shape behavior in src/config. */
export function isSecretRefShape(
  value: Record<string, unknown>,
): value is Record<string, unknown> & { source: string; id: string } {
  return typeof value.source === "string" && typeof value.id === "string";
}

/** Reused helper for redact Secret Ref Id behavior in src/config. */
export function redactSecretRefId(params: {
  value: Record<string, unknown> & { source: string; id: string };
  values: string[];
  redactedSentinel: string;
  isEnvVarPlaceholder: (value: string) => boolean;
}): Record<string, unknown> {
  const { value, values, redactedSentinel, isEnvVarPlaceholder } = params;
  const redacted: Record<string, unknown> = { ...value };
  if (!isEnvVarPlaceholder(value.id)) {
    values.push(value.id);
    redacted.id = redactedSentinel;
  }
  return redacted;
}
