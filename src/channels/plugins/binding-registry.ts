// Configured binding provider registry.
import { ensureConfiguredBindingBuiltinsRegistered } from "./configured-binding-builtins.js";
import {
  primeConfiguredBindingRegistry as primeConfiguredBindingRegistryRaw,
  resolveConfiguredBinding as resolveConfiguredBindingRaw,
  resolveConfiguredBindingRecord as resolveConfiguredBindingRecordRaw,
  resolveConfiguredBindingRecordBySessionKey as resolveConfiguredBindingRecordBySessionKeyRaw,
  resolveConfiguredBindingRecordForConversation as resolveConfiguredBindingRecordForConversationRaw,
} from "./configured-binding-registry.js";

// Thin public wrapper around the configured-binding registry. Runtime plugin
// conversation bindings use a separate approval-driven path in src/plugins/.

/** Reused helper for prime Configured Binding Registry behavior in src/channels/plugins. */
export function primeConfiguredBindingRegistry(
  ...args: Parameters<typeof primeConfiguredBindingRegistryRaw>
): ReturnType<typeof primeConfiguredBindingRegistryRaw> {
  ensureConfiguredBindingBuiltinsRegistered();
  return primeConfiguredBindingRegistryRaw(...args);
}

/** Reused helper for resolve Configured Binding Record behavior in src/channels/plugins. */
export function resolveConfiguredBindingRecord(
  ...args: Parameters<typeof resolveConfiguredBindingRecordRaw>
): ReturnType<typeof resolveConfiguredBindingRecordRaw> {
  ensureConfiguredBindingBuiltinsRegistered();
  return resolveConfiguredBindingRecordRaw(...args);
}

/** Reused helper for resolve Configured Binding Record For Conversation behavior in src/channels/plugins. */
export function resolveConfiguredBindingRecordForConversation(
  ...args: Parameters<typeof resolveConfiguredBindingRecordForConversationRaw>
): ReturnType<typeof resolveConfiguredBindingRecordForConversationRaw> {
  ensureConfiguredBindingBuiltinsRegistered();
  return resolveConfiguredBindingRecordForConversationRaw(...args);
}

/** Reused helper for resolve Configured Binding behavior in src/channels/plugins. */
export function resolveConfiguredBinding(
  ...args: Parameters<typeof resolveConfiguredBindingRaw>
): ReturnType<typeof resolveConfiguredBindingRaw> {
  ensureConfiguredBindingBuiltinsRegistered();
  return resolveConfiguredBindingRaw(...args);
}

/** Reused helper for resolve Configured Binding Record By Session Key behavior in src/channels/plugins. */
export function resolveConfiguredBindingRecordBySessionKey(
  ...args: Parameters<typeof resolveConfiguredBindingRecordBySessionKeyRaw>
): ReturnType<typeof resolveConfiguredBindingRecordBySessionKeyRaw> {
  ensureConfiguredBindingBuiltinsRegistered();
  return resolveConfiguredBindingRecordBySessionKeyRaw(...args);
}
