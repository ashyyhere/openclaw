// packages/memory-host-sdk/src/host secret input helpers and runtime behavior.
import {
  hasConfiguredSecretInput,
  normalizeEnvSecretInputString,
  normalizeResolvedSecretInputString,
  resolveSecretInputRef,
} from "./secret-input-utils.js";

/** Public helper for has Configured Memory Secret Input behavior in packages/memory-host-sdk. */
export function hasConfiguredMemorySecretInput(value: unknown): boolean {
  return hasConfiguredSecretInput(value);
}

/** Public helper for resolve Memory Secret Input String behavior in packages/memory-host-sdk. */
export function resolveMemorySecretInputString(params: {
  value: unknown;
  path: string;
}): string | undefined {
  const ref = resolveSecretInputRef(params.value);
  if (ref?.source === "env") {
    const envValue = normalizeEnvSecretInputString(process.env[ref.id]);
    if (envValue) {
      return envValue;
    }
  }
  return normalizeResolvedSecretInputString({
    value: params.value,
    path: params.path,
  });
}
