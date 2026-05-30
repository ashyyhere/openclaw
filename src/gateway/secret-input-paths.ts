// Maps gateway auth/remote secret-input paths to config reads and writes.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Config paths whose gateway credentials may be resolved from secret input. */
export type SupportedGatewaySecretInputPath =
  | "gateway.auth.token"
  | "gateway.auth.password"
  | "gateway.remote.token"
  | "gateway.remote.password";

/** Complete set of supported gateway credential config paths. */
export const ALL_GATEWAY_SECRET_INPUT_PATHS: SupportedGatewaySecretInputPath[] = [
  "gateway.auth.token",
  "gateway.auth.password",
  "gateway.remote.token",
  "gateway.remote.password",
];

/** Type guard for gateway credential paths accepted by secret-input resolution. */
export function isSupportedGatewaySecretInputPath(
  path: string,
): path is SupportedGatewaySecretInputPath {
  return ALL_GATEWAY_SECRET_INPUT_PATHS.includes(path as SupportedGatewaySecretInputPath);
}

/** Read the raw configured value at one supported gateway credential path. */
export function readGatewaySecretInputValue(
  config: OpenClawConfig,
  path: SupportedGatewaySecretInputPath,
): unknown {
  if (path === "gateway.auth.token") {
    return config.gateway?.auth?.token;
  }
  if (path === "gateway.auth.password") {
    return config.gateway?.auth?.password;
  }
  if (path === "gateway.remote.token") {
    return config.gateway?.remote?.token;
  }
  return config.gateway?.remote?.password;
}

/** Write a resolved gateway credential value back into its config path. */
export function assignResolvedGatewaySecretInput(params: {
  config: OpenClawConfig;
  path: SupportedGatewaySecretInputPath;
  value: string | undefined;
}): void {
  const { config, path, value } = params;
  if (path === "gateway.auth.token") {
    if (config.gateway?.auth) {
      config.gateway.auth.token = value;
    }
    return;
  }
  if (path === "gateway.auth.password") {
    if (config.gateway?.auth) {
      config.gateway.auth.password = value;
    }
    return;
  }
  if (path === "gateway.remote.token") {
    if (config.gateway?.remote) {
      config.gateway.remote.token = value;
    }
    return;
  }
  if (config.gateway?.remote) {
    config.gateway.remote.password = value;
  }
}

/** Distinguish token paths from password paths for prompting/display policy. */
export function isTokenGatewaySecretInputPath(path: SupportedGatewaySecretInputPath): boolean {
  return path === "gateway.auth.token" || path === "gateway.remote.token";
}
