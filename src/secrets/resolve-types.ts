// Shared cache shape for resolving secret references during one apply/read pass.
/** Memoizes secret-reference and provider file payload resolution promises. */
export type SecretRefResolveCache = {
  resolvedByRefKey?: Map<string, Promise<unknown>>;
  filePayloadByProvider?: Map<string, Promise<unknown>>;
};
