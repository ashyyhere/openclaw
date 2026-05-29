// infra openclaw exec env helpers and runtime behavior.
/** Reused constant for OPENCLAW CLI ENV VAR behavior in src/infra. */
export const OPENCLAW_CLI_ENV_VAR = "OPENCLAW_CLI";
/** Reused constant for OPENCLAW CLI ENV VALUE behavior in src/infra. */
export const OPENCLAW_CLI_ENV_VALUE = "1";

/** Reused helper for mark Open Claw Exec Env behavior in src/infra. */
export function markOpenClawExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [OPENCLAW_CLI_ENV_VAR]: OPENCLAW_CLI_ENV_VALUE,
  };
}

/** Reused helper for ensure Open Claw Exec Marker On Process behavior in src/infra. */
export function ensureOpenClawExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[OPENCLAW_CLI_ENV_VAR] = OPENCLAW_CLI_ENV_VALUE;
  return env;
}
