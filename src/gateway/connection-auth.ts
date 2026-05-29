// gateway connection auth helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs.js";
import type {
  ExplicitGatewayAuth,
  GatewayCredentialMode,
  GatewayCredentialPrecedence,
  GatewayRemoteCredentialFallback,
  GatewayRemoteCredentialPrecedence,
} from "./credentials.js";
import { resolveGatewayCredentialsFromConfig } from "./credentials.js";

/** Shared type for Gateway Connection Auth Options in src/gateway. */
export type GatewayConnectionAuthOptions = {
  config: OpenClawConfig;
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
};

function toGatewayCredentialOptions(
  params: Omit<GatewayConnectionAuthOptions, "config"> & { cfg: OpenClawConfig },
) {
  return {
    cfg: params.cfg,
    env: params.env,
    explicitAuth: params.explicitAuth,
    urlOverride: params.urlOverride,
    urlOverrideSource: params.urlOverrideSource,
    modeOverride: params.modeOverride,
    localTokenPrecedence: params.localTokenPrecedence,
    localPasswordPrecedence: params.localPasswordPrecedence,
    remoteTokenPrecedence: params.remoteTokenPrecedence,
    remotePasswordPrecedence: params.remotePasswordPrecedence,
    remoteTokenFallback: params.remoteTokenFallback,
    remotePasswordFallback: params.remotePasswordFallback,
  };
}

/** Reused helper for resolve Gateway Connection Auth behavior in src/gateway. */
export async function resolveGatewayConnectionAuth(
  params: GatewayConnectionAuthOptions,
): Promise<{ token?: string; password?: string }> {
  return await resolveGatewayCredentialsWithSecretInputs({
    config: params.config,
    ...toGatewayCredentialOptions({ ...params, cfg: params.config }),
  });
}

/** Reused helper for resolve Gateway Connection Auth From Config behavior in src/gateway. */
export function resolveGatewayConnectionAuthFromConfig(
  params: Omit<GatewayConnectionAuthOptions, "config"> & { cfg: OpenClawConfig },
): { token?: string; password?: string } {
  return resolveGatewayCredentialsFromConfig(toGatewayCredentialOptions(params));
}
