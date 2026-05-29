// plugins interactive registry helpers and runtime behavior.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import {
  normalizePluginInteractiveNamespace,
  resolvePluginInteractiveMatch,
  toPluginInteractiveRegistryKey,
  validatePluginInteractiveNamespace,
} from "./interactive-shared.js";
import {
  clearPluginInteractiveHandlerRegistrationsState,
  clearPluginInteractiveHandlersState,
  getPluginInteractiveHandlersState,
  type RegisteredInteractiveHandler,
} from "./interactive-state.js";
import type { PluginInteractiveHandlerRegistration } from "./types.js";

/** Shared type for Interactive Registration Result in src/plugins. */
export type InteractiveRegistrationResult = {
  ok: boolean;
  error?: string;
};

/** Reused helper for resolve Plugin Interactive Namespace Match behavior in src/plugins. */
export function resolvePluginInteractiveNamespaceMatch(
  channel: string,
  data: string,
): { registration: RegisteredInteractiveHandler; namespace: string; payload: string } | null {
  return resolvePluginInteractiveMatch({
    interactiveHandlers: getPluginInteractiveHandlersState(),
    channel,
    data,
  });
}

/** Reused helper for register Plugin Interactive Handler behavior in src/plugins. */
export function registerPluginInteractiveHandler(
  pluginId: string,
  registration: PluginInteractiveHandlerRegistration,
  opts?: { pluginName?: string; pluginRoot?: string },
): InteractiveRegistrationResult {
  const interactiveHandlers = getPluginInteractiveHandlersState();
  const namespace = normalizePluginInteractiveNamespace(registration.namespace);
  const validationError = validatePluginInteractiveNamespace(namespace);
  if (validationError) {
    return { ok: false, error: validationError };
  }
  const key = toPluginInteractiveRegistryKey(registration.channel, namespace);
  const existing = interactiveHandlers.get(key);
  if (existing) {
    return {
      ok: false,
      error: `Interactive handler namespace "${namespace}" already registered by plugin "${existing.pluginId}"`,
    };
  }
  interactiveHandlers.set(key, {
    ...registration,
    namespace,
    channel: normalizeOptionalLowercaseString(registration.channel) ?? "",
    pluginId,
    pluginName: opts?.pluginName,
    pluginRoot: opts?.pluginRoot,
  });
  return { ok: true };
}

/** Reused helper for clear Plugin Interactive Handlers behavior in src/plugins. */
export function clearPluginInteractiveHandlers(): void {
  clearPluginInteractiveHandlersState();
}

/** Reused helper for clear Plugin Interactive Handler Registrations behavior in src/plugins. */
export function clearPluginInteractiveHandlerRegistrations(): void {
  clearPluginInteractiveHandlerRegistrationsState();
}

/** Reused helper for clear Plugin Interactive Handlers For Plugin behavior in src/plugins. */
export function clearPluginInteractiveHandlersForPlugin(pluginId: string): void {
  const interactiveHandlers = getPluginInteractiveHandlersState();
  for (const [key, value] of interactiveHandlers.entries()) {
    if (value.pluginId === pluginId) {
      interactiveHandlers.delete(key);
    }
  }
}

/** Reused helper for list Plugin Interactive Handlers behavior in src/plugins. */
export function listPluginInteractiveHandlers(): RegisteredInteractiveHandler[] {
  return Array.from(getPluginInteractiveHandlersState().values());
}

/** Reused helper for restore Plugin Interactive Handlers behavior in src/plugins. */
export function restorePluginInteractiveHandlers(
  registrations: readonly RegisteredInteractiveHandler[],
): void {
  clearPluginInteractiveHandlerRegistrations();
  const interactiveHandlers = getPluginInteractiveHandlersState();
  for (const registration of registrations) {
    const namespace = normalizePluginInteractiveNamespace(registration.namespace);
    if (!namespace) {
      continue;
    }
    interactiveHandlers.set(toPluginInteractiveRegistryKey(registration.channel, namespace), {
      ...registration,
      namespace,
      channel: normalizeOptionalLowercaseString(registration.channel) ?? "",
    });
  }
}
