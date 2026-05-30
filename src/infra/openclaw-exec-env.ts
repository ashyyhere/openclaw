/** Marks child processes as launched by the OpenClaw CLI. */
/** Environment variable used by child processes to detect OpenClaw CLI launch context. */
export const OPENCLAW_CLI_ENV_VAR = "OPENCLAW_CLI";
/** Canonical marker value for OpenClaw CLI launch context. */
export const OPENCLAW_CLI_ENV_VALUE = "1";

/** Return a copy of an environment map with the OpenClaw CLI marker applied. */
export function markOpenClawExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [OPENCLAW_CLI_ENV_VAR]: OPENCLAW_CLI_ENV_VALUE,
  };
}

/** Mutate process.env-style maps so the current process advertises CLI ownership. */
export function ensureOpenClawExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[OPENCLAW_CLI_ENV_VAR] = OPENCLAW_CLI_ENV_VALUE;
  return env;
}
