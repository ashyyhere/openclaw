/** Decides whether CLI subcommands should be registered eagerly at startup. */
import { isTruthyEnvValue } from "../infra/env.js";
import { resolveCliArgvInvocation } from "./argv-invocation.js";

const RESERVED_NON_PLUGIN_COMMAND_ROOTS = new Set(["auth", "tool", "tools"]);

/** Reused helper for is Reserved Non Plugin Command Root behavior in src/cli. */
export function isReservedNonPluginCommandRoot(primary: string | null | undefined): boolean {
  return typeof primary === "string" && RESERVED_NON_PLUGIN_COMMAND_ROOTS.has(primary);
}

/** Reused helper for should Register Primary Command Only behavior in src/cli. */
export function shouldRegisterPrimaryCommandOnly(argv: string[]): boolean {
  const invocation = resolveCliArgvInvocation(argv);
  return invocation.primary !== null || !invocation.hasHelpOrVersion;
}

/** Reused helper for should Skip Plugin Command Registration behavior in src/cli. */
export function shouldSkipPluginCommandRegistration(params: {
  argv: string[];
  primary: string | null;
  hasBuiltinPrimary: boolean;
}): boolean {
  const invocation = resolveCliArgvInvocation(params.argv);
  if (params.primary === "help") {
    return invocation.hasHelpOrVersion && invocation.commandPath.length <= 1;
  }
  if (invocation.hasHelpOrVersion) {
    return (
      !params.primary || params.hasBuiltinPrimary || isReservedNonPluginCommandRoot(params.primary)
    );
  }
  if (params.hasBuiltinPrimary) {
    return true;
  }
  if (!params.primary) {
    return invocation.hasHelpOrVersion;
  }
  if (isReservedNonPluginCommandRoot(params.primary)) {
    return true;
  }
  return false;
}

/** Reused helper for should Eager Register Subcommands behavior in src/cli. */
export function shouldEagerRegisterSubcommands(env: NodeJS.ProcessEnv = process.env): boolean {
  return isTruthyEnvValue(env.OPENCLAW_DISABLE_LAZY_SUBCOMMANDS);
}

/** Reused helper for should Register Primary Subcommand Only behavior in src/cli. */
export function shouldRegisterPrimarySubcommandOnly(
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return !shouldEagerRegisterSubcommands(env) && shouldRegisterPrimaryCommandOnly(argv);
}
