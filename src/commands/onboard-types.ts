/** Shared option and selection types for onboarding flows. */
import type { ChannelId } from "../channels/plugins/types.public.js";
import type { SecretInputMode } from "../plugins/provider-auth-types.js";
import type { GatewayDaemonRuntime } from "./daemon-runtime.js";

/** Installation target for the onboarding flow. */
export type OnboardMode = "local" | "remote";
/**
 * Auth choices are plugin-owned contract ids plus a few legacy aliases that
 * are normalized elsewhere (for example `oauth` -> `setup-token`).
 */
type BuiltInAuthChoice =
  /** @deprecated Use `setup-token`. */
  "oauth" | "setup-token" | "token" | "apiKey" | "custom-api-key" | "skip";
/** Provider auth choice selected interactively or through non-interactive flags. */
export type AuthChoice = BuiltInAuthChoice | (string & {});

/** Auth choice groups are plugin-owned ids plus the core `custom` bucket. */
export type AuthChoiceGroupId = "custom" | (string & {});
/** Gateway authentication mode selected during onboarding. */
export type GatewayAuthChoice = "token" | "password";
/** Data scope removed by reset-oriented onboarding flows. */
export type ResetScope = "config" | "config+creds+sessions" | "full";
/** Network binding preset for the gateway daemon. */
export type GatewayBind = "loopback" | "lan" | "auto" | "custom" | "tailnet";
/** Tailscale exposure mode configured by onboarding. */
export type TailscaleMode = "off" | "serve" | "funnel";
/** Package manager used by node-host setup steps. */
export type NodeManagerChoice = "npm" | "pnpm" | "bun";
/** Channel id selected for messaging-channel setup. */
export type ChannelChoice = ChannelId;
/** Secret input/persistence modes accepted by provider auth setup. */
export type { SecretInputMode } from "../plugins/provider-auth-types.js";

type OnboardDynamicProviderOptions = {
  /**
   * Provider-specific non-interactive auth flags are plugin-owned and keyed by
   * manifest `providerAuthChoices[].optionKey` values.
   */
  [optionKey: string]: unknown;
};

/** CLI and programmatic options consumed by the onboarding command. */
export type OnboardOptions = OnboardDynamicProviderOptions & {
  mode?: OnboardMode;
  /** "manual" is an alias for "advanced". */
  flow?: "quickstart" | "advanced" | "manual" | "import";
  workspace?: string;
  nonInteractive?: boolean;
  /** Required for non-interactive setup; skips the interactive risk prompt when true. */
  acceptRisk?: boolean;
  reset?: boolean;
  resetScope?: ResetScope;
  authChoice?: AuthChoice;
  /** Used when `authChoice=token` in non-interactive mode. */
  tokenProvider?: string;
  /** Used when `authChoice=token` in non-interactive mode. */
  token?: string;
  /** Used when `authChoice=token` in non-interactive mode. */
  tokenProfileId?: string;
  /** Used when `authChoice=token` in non-interactive mode. */
  tokenExpiresIn?: string;
  /** API key persistence mode for setup flows (default: plaintext). */
  secretInputMode?: SecretInputMode;
  arceeaiApiKey?: string;
  cloudflareAiGatewayAccountId?: string;
  cloudflareAiGatewayGatewayId?: string;
  customBaseUrl?: string;
  customApiKey?: string;
  lmstudioApiKey?: string;
  customModelId?: string;
  customProviderId?: string;
  customCompatibility?: "openai" | "anthropic";
  customImageInput?: boolean;
  gatewayPort?: number;
  gatewayBind?: GatewayBind;
  gatewayAuth?: GatewayAuthChoice;
  gatewayToken?: string;
  gatewayTokenRefEnv?: string;
  gatewayPassword?: string;
  tailscale?: TailscaleMode;
  tailscaleResetOnExit?: boolean;
  installDaemon?: boolean;
  daemonRuntime?: GatewayDaemonRuntime;
  skipChannels?: boolean;
  /** @deprecated Legacy alias for `skipChannels`. */
  skipProviders?: boolean;
  skipSkills?: boolean;
  skipBootstrap?: boolean;
  skipSearch?: boolean;
  skipHealth?: boolean;
  skipUi?: boolean;
  suppressGatewayTokenOutput?: boolean;
  skipHooks?: boolean;
  nodeManager?: NodeManagerChoice;
  remoteUrl?: string;
  remoteToken?: string;
  importFrom?: string;
  importSource?: string;
  importSecrets?: boolean;
  json?: boolean;
};
