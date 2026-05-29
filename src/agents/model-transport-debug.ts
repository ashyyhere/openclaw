/** Env-controlled model transport debugging helpers. */
import type { createSubsystemLogger } from "../logging/subsystem.js";

type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;

type ModelTransportDebugEnv = NodeJS.ProcessEnv;

/** Model payload debug verbosity. */
export type ModelPayloadDebugMode = "off" | "summary" | "tools" | "full-redacted";
/** SSE debug verbosity. */
export type ModelSseDebugMode = "off" | "events" | "peek";

function normalizeEnv(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isTruthyEnv(value: unknown): boolean {
  const normalized = normalizeEnv(value);
  return (
    normalized.length > 0 &&
    normalized !== "0" &&
    normalized !== "false" &&
    normalized !== "off" &&
    normalized !== "no"
  );
}

/** Resolve payload debug mode from env. */
export function resolveModelPayloadDebugMode(
  env: ModelTransportDebugEnv = process.env,
): ModelPayloadDebugMode {
  const normalized = normalizeEnv(env.OPENCLAW_DEBUG_MODEL_PAYLOAD);
  if (normalized === "tools" || normalized === "full-redacted") {
    return normalized;
  }
  if (normalized === "summary") {
    return "summary";
  }
  return "off";
}

/** Resolve SSE debug mode from env. */
export function resolveModelSseDebugMode(
  env: ModelTransportDebugEnv = process.env,
): ModelSseDebugMode {
  const normalized = normalizeEnv(env.OPENCLAW_DEBUG_SSE);
  if (normalized === "peek") {
    return "peek";
  }
  if (normalized === "events" || isTruthyEnv(normalized)) {
    return "events";
  }
  return "off";
}

/** Return whether any model transport debug flag is enabled. */
export function isModelTransportDebugEnabled(env: ModelTransportDebugEnv = process.env): boolean {
  return (
    isTruthyEnv(env.OPENCLAW_DEBUG_MODEL_TRANSPORT) ||
    resolveModelPayloadDebugMode(env) !== "off" ||
    resolveModelSseDebugMode(env) !== "off" ||
    isTruthyEnv(env.OPENCLAW_DEBUG_CODE_MODE)
  );
}

/** Return whether code-mode debug is enabled. */
export function isCodeModeDebugEnabled(env: ModelTransportDebugEnv = process.env): boolean {
  return isTruthyEnv(env.OPENCLAW_DEBUG_CODE_MODE) || isModelTransportDebugEnabled(env);
}

/** Emit model transport debug text when enabled. */
export function emitModelTransportDebug(log: SubsystemLogger, message: string): void {
  if (isModelTransportDebugEnabled()) {
    log.info(message);
    return;
  }
  log.debug(message);
}
