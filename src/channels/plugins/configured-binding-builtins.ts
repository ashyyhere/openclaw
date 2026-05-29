// Built-in configured binding provider registration.
import { acpConfiguredBindingConsumer } from "./acp-configured-binding-consumer.js";
import { registerConfiguredBindingConsumer } from "./configured-binding-consumers.js";

/** Reused helper for ensure Configured Binding Builtins Registered behavior in src/channels/plugins. */
export function ensureConfiguredBindingBuiltinsRegistered(): void {
  registerConfiguredBindingConsumer(acpConfiguredBindingConsumer);
}
