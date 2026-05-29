/** Gateway probing helpers shared by status and doctor commands. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  resolveGatewayProbeAuthSafeWithSecretInputs,
  resolveGatewayProbeTarget,
} from "../gateway/probe-auth.js";
/** Re-exported API for src/commands, starting with pick Gateway Self Presence. */
export { pickGatewaySelfPresence } from "./gateway-presence.js";

/** Reused helper for resolve Gateway Probe Auth Resolution behavior in src/commands. */
export async function resolveGatewayProbeAuthResolution(cfg: OpenClawConfig): Promise<{
  auth: {
    token?: string;
    password?: string;
  };
  warning?: string;
}> {
  const target = resolveGatewayProbeTarget(cfg);
  return resolveGatewayProbeAuthSafeWithSecretInputs({
    cfg,
    mode: target.mode,
    env: process.env,
  });
}

/** Reused helper for resolve Gateway Probe Auth behavior in src/commands. */
export async function resolveGatewayProbeAuth(cfg: OpenClawConfig): Promise<{
  token?: string;
  password?: string;
}> {
  return (await resolveGatewayProbeAuthResolution(cfg)).auth;
}
