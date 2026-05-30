/**
 * @deprecated Broad public SDK barrel. Prefer focused CLI/runtime subpaths and
 * avoid adding new imports here.
 */

export * from "../cli/command-format.js";
/** Inherit CLI option values from parent commands when subcommands omit them. */
export { inheritOptionFromParent } from "../cli/command-options.js";
/** Run a CLI command through the configured runtime adapter. */
export { runCommandWithRuntime } from "../cli/cli-utils.js";
/** Format command examples for CLI help text. */
export { formatHelpExamples } from "../cli/help-format.js";
/** Register grouped CLI commands and placeholders in the program tree. */
export {
  registerCommandGroups,
  type CommandGroupEntry,
  type CommandGroupPlaceholder,
} from "../cli/program/register-command-groups.js";
export * from "../cli/parse-duration.js";
/** Parse the original CLI argv invocation for command forwarding. */
export { resolveCliArgvInvocation, type CliArgvInvocation } from "../cli/argv-invocation.js";
/** Decide whether subcommands should be registered eagerly for the current invocation. */
export { shouldEagerRegisterSubcommands } from "../cli/command-registration-policy.js";
export * from "../cli/wait.js";
export { note } from "../../packages/terminal-core/src/note.js";
export { stylePromptTitle } from "../../packages/terminal-core/src/prompt-style.js";
export { theme } from "../../packages/terminal-core/src/theme.js";
export * from "../version.js";
