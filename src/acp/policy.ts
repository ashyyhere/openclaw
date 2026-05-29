/** ACP enablement and allowlist policy checks for dispatch/session creation. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizeAgentId } from "../routing/session-key.js";
import { AcpRuntimeError } from "./runtime/errors.js";

const ACP_DISABLED_MESSAGE = "ACP is disabled by policy (`acp.enabled=false`).";
const ACP_DISPATCH_DISABLED_MESSAGE =
  "ACP dispatch is disabled by policy (`acp.dispatch.enabled=false`).";

/** Shared type for Acp Dispatch Policy State in src/acp. */
export type AcpDispatchPolicyState = "enabled" | "acp_disabled" | "dispatch_disabled";

/** Return whether ACP is globally enabled by config policy. */
export function isAcpEnabledByPolicy(cfg: OpenClawConfig): boolean {
  return cfg.acp?.enabled !== false;
}

/** Resolve the dispatch gate state used by inbound ACP routing. */
export function resolveAcpDispatchPolicyState(cfg: OpenClawConfig): AcpDispatchPolicyState {
  if (!isAcpEnabledByPolicy(cfg)) {
    return "acp_disabled";
  }
  // ACP dispatch is enabled unless explicitly disabled.
  if (cfg.acp?.dispatch?.enabled === false) {
    return "dispatch_disabled";
  }
  return "enabled";
}

/** Return whether inbound ACP dispatch is enabled by config policy. */
export function isAcpDispatchEnabledByPolicy(cfg: OpenClawConfig): boolean {
  return resolveAcpDispatchPolicyState(cfg) === "enabled";
}

/** Return a human-readable dispatch policy denial message, when denied. */
export function resolveAcpDispatchPolicyMessage(cfg: OpenClawConfig): string | null {
  const state = resolveAcpDispatchPolicyState(cfg);
  if (state === "acp_disabled") {
    return ACP_DISABLED_MESSAGE;
  }
  if (state === "dispatch_disabled") {
    return ACP_DISPATCH_DISABLED_MESSAGE;
  }
  return null;
}

/** Return the ACP runtime error for dispatch denial, when denied. */
export function resolveAcpDispatchPolicyError(cfg: OpenClawConfig): AcpRuntimeError | null {
  const message = resolveAcpDispatchPolicyMessage(cfg);
  if (!message) {
    return null;
  }
  return new AcpRuntimeError("ACP_DISPATCH_DISABLED", message);
}

/** Return the ACP runtime error for explicit turns when ACP is globally disabled. */
export function resolveAcpExplicitTurnPolicyError(cfg: OpenClawConfig): AcpRuntimeError | null {
  if (isAcpEnabledByPolicy(cfg)) {
    return null;
  }
  return new AcpRuntimeError("ACP_DISPATCH_DISABLED", ACP_DISABLED_MESSAGE);
}

/** Return whether an ACP agent id passes the configured allowlist. */
export function isAcpAgentAllowedByPolicy(cfg: OpenClawConfig, agentId: string): boolean {
  const allowed = (cfg.acp?.allowedAgents ?? [])
    .map((entry) => normalizeAgentId(entry))
    .filter(Boolean);
  if (allowed.length === 0) {
    return true;
  }
  return allowed.includes(normalizeAgentId(agentId));
}

/** Return the ACP runtime error for agent allowlist denial, when denied. */
export function resolveAcpAgentPolicyError(
  cfg: OpenClawConfig,
  agentId: string,
): AcpRuntimeError | null {
  if (isAcpAgentAllowedByPolicy(cfg, agentId)) {
    return null;
  }
  return new AcpRuntimeError(
    "ACP_SESSION_INIT_FAILED",
    `ACP agent "${normalizeAgentId(agentId)}" is not allowed by policy.`,
  );
}
