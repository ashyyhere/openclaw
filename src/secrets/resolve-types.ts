// secrets resolve types helpers and runtime behavior.
/** Shared type for Secret Ref Resolve Cache in src/secrets. */
export type SecretRefResolveCache = {
  resolvedByRefKey?: Map<string, Promise<unknown>>;
  filePayloadByProvider?: Map<string, Promise<unknown>>;
};
