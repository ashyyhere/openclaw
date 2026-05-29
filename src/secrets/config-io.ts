// secrets config io helpers and runtime behavior.
import { createConfigIO } from "../config/config.js";

const silentConfigIoLogger = {
  error: () => {},
  warn: () => {},
} as const;

/** Reused helper for create Secrets Config IO behavior in src/secrets. */
export function createSecretsConfigIO(params: { env: NodeJS.ProcessEnv }) {
  // Secrets command output is owned by the CLI command so --json stays machine-parseable.
  return createConfigIO({
    env: params.env,
    logger: silentConfigIoLogger,
  });
}
