// Provider HTTP request override contracts for auth, proxy, TLS, and private-network policy.
import type { SecretInput } from "./types.secrets.js";

/** Auth override strategy applied on top of provider-default request auth. */
export type ConfiguredProviderRequestAuth =
  | {
      mode: "provider-default";
    }
  | {
      mode: "authorization-bearer";
      token: SecretInput;
    }
  | {
      mode: "header";
      headerName: string;
      value: SecretInput;
      prefix?: string;
    };

/** TLS material and verification overrides for provider or proxy connections. */
export type ConfiguredProviderRequestTls = {
  ca?: SecretInput;
  cert?: SecretInput;
  key?: SecretInput;
  passphrase?: SecretInput;
  serverName?: string;
  insecureSkipVerify?: boolean;
};

/** Proxy routing mode for provider HTTP requests. */
export type ConfiguredProviderRequestProxy =
  | {
      mode: "env-proxy";
      tls?: ConfiguredProviderRequestTls;
    }
  | {
      mode: "explicit-proxy";
      url: string;
      tls?: ConfiguredProviderRequestTls;
    };

/** Provider request customization shared by provider and model configs. */
export type ConfiguredProviderRequest = {
  headers?: Record<string, SecretInput>;
  auth?: ConfiguredProviderRequestAuth;
  proxy?: ConfiguredProviderRequestProxy;
  tls?: ConfiguredProviderRequestTls;
};

/** Model provider request config with private-network allowance for local providers. */
export type ConfiguredModelProviderRequest = ConfiguredProviderRequest & {
  allowPrivateNetwork?: boolean;
};
