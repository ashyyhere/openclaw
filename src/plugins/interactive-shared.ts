// plugins interactive shared helpers and runtime behavior.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Reused helper for to Plugin Interactive Registry Key behavior in src/plugins. */
export function toPluginInteractiveRegistryKey(channel: string, namespace: string): string {
  return `${normalizeOptionalLowercaseString(channel) ?? ""}:${namespace.trim()}`;
}

/** Reused helper for normalize Plugin Interactive Namespace behavior in src/plugins. */
export function normalizePluginInteractiveNamespace(namespace: string): string {
  return namespace.trim();
}

/** Reused helper for validate Plugin Interactive Namespace behavior in src/plugins. */
export function validatePluginInteractiveNamespace(namespace: string): string | null {
  if (!namespace.trim()) {
    return "Interactive handler namespace cannot be empty";
  }
  if (!/^[A-Za-z0-9._-]+$/.test(namespace.trim())) {
    return "Interactive handler namespace must contain only letters, numbers, dots, underscores, and hyphens";
  }
  return null;
}

/** Reused helper for resolve Plugin Interactive Match behavior in src/plugins. */
export function resolvePluginInteractiveMatch<TRegistration>(params: {
  interactiveHandlers: Map<string, TRegistration>;
  channel: string;
  data: string;
}): { registration: TRegistration; namespace: string; payload: string } | null {
  const trimmedData = params.data.trim();
  if (!trimmedData) {
    return null;
  }

  const separatorIndex = trimmedData.indexOf(":");
  const namespace =
    separatorIndex >= 0
      ? trimmedData.slice(0, separatorIndex)
      : normalizePluginInteractiveNamespace(trimmedData);
  const registration = params.interactiveHandlers.get(
    toPluginInteractiveRegistryKey(params.channel, namespace),
  );
  if (!registration) {
    return null;
  }

  return {
    registration,
    namespace,
    payload: separatorIndex >= 0 ? trimmedData.slice(separatorIndex + 1) : "",
  };
}
