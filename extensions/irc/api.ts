// extensions/irc api helpers and runtime behavior.
/** Re-exported irc plugin public API, starting with irc Plugin. */
export { ircPlugin } from "./src/channel.js";
/** Re-exported irc plugin public API, starting with set Irc Runtime. */
export { setIrcRuntime } from "./src/runtime.js";
/** Re-exported irc plugin public API. */
export {
  listEnabledIrcAccounts,
  listIrcAccountIds,
  resolveDefaultIrcAccountId,
  type ResolvedIrcAccount,
  resolveIrcAccount,
} from "./src/accounts.js";
/** Re-exported irc plugin public API, starting with irc Setup Adapter. */
export { ircSetupAdapter, ircSetupWizard } from "./src/setup-surface.js";
