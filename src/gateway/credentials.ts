// Gateway credential resolution. Merges explicit auth, env, local/remote config,
// secret-reference availability, and probe-specific fallback rules.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  createGatewayCredentialPlan,
  type GatewayCredentialPlan,
  trimCredentialToUndefined,
  trimToUndefined,
} from "./credential-planner.js";
/** Credential planner helpers re-exported for gateway command paths. */
export {
  hasGatewayPasswordEnvCandidate,
  hasGatewayTokenEnvCandidate,
  trimToUndefined,
} from "./credential-planner.js";

/** Explicit token/password auth supplied by CLI or caller options. */
export type ExplicitGatewayAuth = {
  token?: string;
  password?: string;
};

type ResolvedGatewayCredentials = {
  token?: string;
  password?: string;
};

/** Credential lookup mode for local gateway versus remote targets. */
export type GatewayCredentialMode = "local" | "remote";
/** Precedence rule for choosing between env and local config credentials. */
export type GatewayCredentialPrecedence = "env-first" | "config-first";
/** Precedence rule for remote credential values versus env values. */
export type GatewayRemoteCredentialPrecedence = "remote-first" | "env-first";
/** Whether remote credential lookup may fall back to env/local values. */
export type GatewayRemoteCredentialFallback = "remote-env-local" | "remote-only";

const GATEWAY_SECRET_REF_UNAVAILABLE_ERROR_CODE = "GATEWAY_SECRET_REF_UNAVAILABLE"; // pragma: allowlist secret

/** Error raised when a configured gateway secret reference cannot be resolved here. */
export class GatewaySecretRefUnavailableError extends Error {
  readonly code = GATEWAY_SECRET_REF_UNAVAILABLE_ERROR_CODE;
  readonly path: string;

  constructor(path: string) {
    super(
      [
        `${path} is configured as a secret reference but is unavailable in this command path.`,
        "Fix: set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD, pass explicit --token/--password,",
        "or run a gateway command path that resolves secret references before credential selection.",
      ].join("\n"),
    );
    this.name = "GatewaySecretRefUnavailableError";
    this.path = path;
  }
}

/** Type guard for unresolved gateway secret-reference failures. */
export function isGatewaySecretRefUnavailableError(
  error: unknown,
  expectedPath?: string,
): error is GatewaySecretRefUnavailableError {
  if (!(error instanceof GatewaySecretRefUnavailableError)) {
    return false;
  }
  if (!expectedPath) {
    return true;
  }
  return error.path === expectedPath;
}

function firstDefined(values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value) {
      return value;
    }
  }
  return undefined;
}

function throwUnresolvedGatewaySecretInput(path: string): never {
  throw new GatewaySecretRefUnavailableError(path);
}

/** Resolves token/password from raw config values and environment variables. */
export function resolveGatewayCredentialsFromValues(params: {
  configToken?: unknown;
  configPassword?: unknown;
  env?: NodeJS.ProcessEnv;
  tokenPrecedence?: GatewayCredentialPrecedence;
  passwordPrecedence?: GatewayCredentialPrecedence;
}): ResolvedGatewayCredentials {
  const env = params.env ?? process.env;
  const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
  const envPassword = trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD);
  const configToken = trimCredentialToUndefined(params.configToken);
  const configPassword = trimCredentialToUndefined(params.configPassword);
  const tokenPrecedence = params.tokenPrecedence ?? "env-first";
  const passwordPrecedence = params.passwordPrecedence ?? "env-first";

  const token =
    tokenPrecedence === "config-first"
      ? firstDefined([configToken, envToken])
      : firstDefined([envToken, configToken]);
  const password =
    passwordPrecedence === "config-first" // pragma: allowlist secret
      ? firstDefined([configPassword, envPassword])
      : firstDefined([envPassword, configPassword]);

  return { token, password };
}

function resolveLocalGatewayCredentials(params: {
  plan: GatewayCredentialPlan;
  env: NodeJS.ProcessEnv;
  localTokenPrecedence: GatewayCredentialPrecedence;
  localPasswordPrecedence: GatewayCredentialPrecedence;
}): ResolvedGatewayCredentials {
  const fallbackToken = params.plan.localToken.configured
    ? params.plan.localToken.value
    : params.plan.remoteToken.value;
  const fallbackPassword = params.plan.localPassword.configured
    ? params.plan.localPassword.value
    : params.plan.authMode === "trusted-proxy"
      ? undefined
      : params.plan.remotePassword.value;
  const localResolved = resolveGatewayCredentialsFromValues({
    configToken: fallbackToken,
    configPassword: fallbackPassword,
    env: params.env,
    tokenPrecedence: params.localTokenPrecedence,
    passwordPrecedence: params.localPasswordPrecedence,
  });
  const localPasswordCanWin =
    params.plan.authMode === "password" ||
    params.plan.authMode === "trusted-proxy" ||
    (params.plan.authMode !== "token" && params.plan.authMode !== "none" && !localResolved.token);
  const localTokenCanWin =
    params.plan.authMode === "token" ||
    (params.plan.authMode !== "password" &&
      params.plan.authMode !== "none" &&
      params.plan.authMode !== "trusted-proxy" &&
      !localResolved.password);

  if (
    params.plan.localToken.refPath &&
    params.localTokenPrecedence === "config-first" &&
    !params.plan.localToken.value &&
    Boolean(params.plan.envToken) &&
    localTokenCanWin
  ) {
    throwUnresolvedGatewaySecretInput(params.plan.localToken.refPath);
  }
  if (
    params.plan.localPassword.refPath &&
    params.localPasswordPrecedence === "config-first" && // pragma: allowlist secret
    !params.plan.localPassword.value &&
    Boolean(params.plan.envPassword) &&
    localPasswordCanWin
  ) {
    throwUnresolvedGatewaySecretInput(params.plan.localPassword.refPath);
  }
  if (
    params.plan.localToken.refPath &&
    !localResolved.token &&
    !params.plan.envToken &&
    localTokenCanWin
  ) {
    throwUnresolvedGatewaySecretInput(params.plan.localToken.refPath);
  }
  if (
    params.plan.localPassword.refPath &&
    !localResolved.password &&
    !params.plan.envPassword &&
    localPasswordCanWin
  ) {
    throwUnresolvedGatewaySecretInput(params.plan.localPassword.refPath);
  }
  return localResolved;
}

function resolveRemoteGatewayCredentials(params: {
  plan: GatewayCredentialPlan;
  remoteTokenPrecedence: GatewayRemoteCredentialPrecedence;
  remotePasswordPrecedence: GatewayRemoteCredentialPrecedence;
  remoteTokenFallback: GatewayRemoteCredentialFallback;
  remotePasswordFallback: GatewayRemoteCredentialFallback;
}): ResolvedGatewayCredentials {
  const token =
    params.remoteTokenFallback === "remote-only"
      ? params.plan.remoteToken.value
      : params.remoteTokenPrecedence === "env-first"
        ? firstDefined([
            params.plan.envToken,
            params.plan.remoteToken.value,
            params.plan.localToken.value,
          ])
        : firstDefined([
            params.plan.remoteToken.value,
            params.plan.envToken,
            params.plan.localToken.value,
          ]);
  const password =
    params.remotePasswordFallback === "remote-only" // pragma: allowlist secret
      ? params.plan.remotePassword.value
      : params.remotePasswordPrecedence === "env-first" // pragma: allowlist secret
        ? firstDefined([
            params.plan.envPassword,
            params.plan.remotePassword.value,
            params.plan.localPassword.value,
          ])
        : firstDefined([
            params.plan.remotePassword.value,
            params.plan.envPassword,
            params.plan.localPassword.value,
          ]);
  const localTokenFallbackEnabled = params.remoteTokenFallback !== "remote-only";
  const localTokenFallback =
    params.remoteTokenFallback === "remote-only" ? undefined : params.plan.localToken.value;
  const localPasswordFallback =
    params.remotePasswordFallback === "remote-only" ? undefined : params.plan.localPassword.value; // pragma: allowlist secret

  if (
    params.plan.remoteToken.refPath &&
    !token &&
    !params.plan.envToken &&
    !localTokenFallback &&
    !password
  ) {
    throwUnresolvedGatewaySecretInput(params.plan.remoteToken.refPath);
  }
  if (
    params.plan.remotePassword.refPath &&
    !password &&
    !params.plan.envPassword &&
    !localPasswordFallback &&
    !token
  ) {
    throwUnresolvedGatewaySecretInput(params.plan.remotePassword.refPath);
  }
  if (
    params.plan.localToken.refPath &&
    localTokenFallbackEnabled &&
    !token &&
    !password &&
    !params.plan.envToken &&
    !params.plan.remoteToken.value &&
    params.plan.localTokenCanWin
  ) {
    throwUnresolvedGatewaySecretInput(params.plan.localToken.refPath);
  }

  return { token, password };
}

/** Resolves gateway credentials from config, env, explicit auth, URL, and mode. */
export function resolveGatewayCredentialsFromConfig(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  explicitAuth?: ExplicitGatewayAuth;
  urlOverride?: string;
  urlOverrideSource?: "cli" | "env";
  modeOverride?: GatewayCredentialMode;
  localTokenPrecedence?: GatewayCredentialPrecedence;
  localPasswordPrecedence?: GatewayCredentialPrecedence;
  remoteTokenPrecedence?: GatewayRemoteCredentialPrecedence;
  remotePasswordPrecedence?: GatewayRemoteCredentialPrecedence;
  remoteTokenFallback?: GatewayRemoteCredentialFallback;
  remotePasswordFallback?: GatewayRemoteCredentialFallback;
}): ResolvedGatewayCredentials {
  const env = params.env ?? process.env;
  const explicitToken = trimToUndefined(params.explicitAuth?.token);
  const explicitPassword = trimToUndefined(params.explicitAuth?.password);
  if (explicitToken || explicitPassword) {
    return { token: explicitToken, password: explicitPassword };
  }
  if (trimToUndefined(params.urlOverride) && params.urlOverrideSource !== "env") {
    return {};
  }
  if (trimToUndefined(params.urlOverride) && params.urlOverrideSource === "env") {
    return resolveGatewayCredentialsFromValues({
      configToken: undefined,
      configPassword: undefined,
      env,
      tokenPrecedence: "env-first",
      passwordPrecedence: "env-first", // pragma: allowlist secret
    });
  }

  const plan = createGatewayCredentialPlan({
    config: params.cfg,
    env,
  });
  const mode: GatewayCredentialMode = params.modeOverride ?? plan.configuredMode;

  const localTokenPrecedence =
    params.localTokenPrecedence ??
    (env.OPENCLAW_SERVICE_KIND === "gateway" ? "config-first" : "env-first");
  const localPasswordPrecedence = params.localPasswordPrecedence ?? "env-first";

  if (mode === "local") {
    return resolveLocalGatewayCredentials({
      plan,
      env,
      localTokenPrecedence,
      localPasswordPrecedence,
    });
  }

  const remoteTokenFallback = params.remoteTokenFallback ?? "remote-env-local";
  const remotePasswordFallback = params.remotePasswordFallback ?? "remote-env-local";
  const remoteTokenPrecedence = params.remoteTokenPrecedence ?? "remote-first";
  const remotePasswordPrecedence = params.remotePasswordPrecedence ?? "env-first";

  return resolveRemoteGatewayCredentials({
    plan,
    remoteTokenPrecedence,
    remotePasswordPrecedence,
    remoteTokenFallback,
    remotePasswordFallback,
  });
}

/** Resolves probe credentials without falling back from remote refs to local config. */
export function resolveGatewayProbeCredentialsFromConfig(params: {
  cfg: OpenClawConfig;
  mode: GatewayCredentialMode;
  env?: NodeJS.ProcessEnv;
  explicitAuth?: ExplicitGatewayAuth;
}): ResolvedGatewayCredentials {
  return resolveGatewayCredentialsFromConfig({
    cfg: params.cfg,
    env: params.env,
    explicitAuth: params.explicitAuth,
    modeOverride: params.mode,
    remoteTokenFallback: "remote-only",
  });
}
