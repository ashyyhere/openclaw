// config types provider request helpers and runtime behavior.
import type { SecretInput } from "./types.secrets.js";

/** Shared type for Configured Provider Request Auth in src/config. */
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

/** Shared type for Configured Provider Request Tls in src/config. */
export type ConfiguredProviderRequestTls = {
  ca?: SecretInput;
  cert?: SecretInput;
  key?: SecretInput;
  passphrase?: SecretInput;
  serverName?: string;
  insecureSkipVerify?: boolean;
};

/** Shared type for Configured Provider Request Proxy in src/config. */
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

/** Shared type for Configured Provider Request in src/config. */
export type ConfiguredProviderRequest = {
  headers?: Record<string, SecretInput>;
  auth?: ConfiguredProviderRequestAuth;
  proxy?: ConfiguredProviderRequestProxy;
  tls?: ConfiguredProviderRequestTls;
};

/** Shared type for Configured Model Provider Request in src/config. */
export type ConfiguredModelProviderRequest = ConfiguredProviderRequest & {
  allowPrivateNetwork?: boolean;
};
