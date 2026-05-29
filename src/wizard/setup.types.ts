// Shared types for wizard setup types behavior.
import type { GatewayAuthChoice } from "../commands/onboard-types.js";
import type { SecretInput } from "../config/types.secrets.js";

/** Shared type for Wizard Flow in src/wizard. */
export type WizardFlow = "quickstart" | "advanced";

/** Shared type for Quickstart Gateway Defaults in src/wizard. */
export type QuickstartGatewayDefaults = {
  hasExisting: boolean;
  port: number;
  bind: "loopback" | "lan" | "auto" | "custom" | "tailnet";
  authMode: GatewayAuthChoice;
  tailscaleMode: "off" | "serve" | "funnel";
  token?: SecretInput;
  password?: SecretInput;
  customBindHost?: string;
  tailscaleResetOnExit: boolean;
};

/** Shared type for Gateway Wizard Settings in src/wizard. */
export type GatewayWizardSettings = {
  port: number;
  bind: "loopback" | "lan" | "auto" | "custom" | "tailnet";
  customBindHost?: string;
  authMode: GatewayAuthChoice;
  gatewayToken?: string;
  tailscaleMode: "off" | "serve" | "funnel";
  tailscaleResetOnExit: boolean;
};
