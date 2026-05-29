// Host compatibility contracts for deciding whether a context engine can run
// safely in a given runtime surface.
import type {
  ContextEngine,
  ContextEngineHostCapability,
  ContextEngineHostRequirements,
  ContextEngineInfo,
  ContextEngineOperation,
} from "./types.js";

/** Host id, label, and capabilities advertised to context engines. */
export type ContextEngineHostSupport = {
  id: string;
  label: string;
  capabilities: readonly ContextEngineHostCapability[];
};

/** Baseline capabilities provided by generic CLI context-engine hosts. */
export const GENERIC_CLI_CONTEXT_ENGINE_HOST_CAPABILITIES = [
  "bootstrap",
  "after-turn",
  "maintain",
] as const satisfies readonly ContextEngineHostCapability[];

/** Capability profile for OpenClaw's embedded runner host. */
export const OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST = {
  id: "openclaw-embedded",
  label: "OpenClaw embedded runner",
  capabilities: [
    "bootstrap",
    "assemble-before-prompt",
    "after-turn",
    "maintain",
    "compact",
    "runtime-llm-complete",
  ],
} as const satisfies ContextEngineHostSupport;

/** Capability profile for the Codex app-server harness host. */
export const CODEX_APP_SERVER_CONTEXT_ENGINE_HOST = {
  id: "codex-app-server",
  label: "Codex app-server harness",
  capabilities: [
    "bootstrap",
    "assemble-before-prompt",
    "after-turn",
    "maintain",
    "compact",
    "runtime-llm-complete",
    "thread-bootstrap-projection",
  ],
} as const satisfies ContextEngineHostSupport;

/** Result of checking engine operation requirements against host capabilities. */
export type ContextEngineHostSupportEvaluation =
  | {
      ok: true;
      requirements?: ContextEngineHostRequirements;
      missingCapabilities: [];
    }
  | {
      ok: false;
      requirements: ContextEngineHostRequirements;
      missingCapabilities: ContextEngineHostCapability[];
    };

/** Build the default host support advertised by the generic CLI runner. */
export function buildGenericCliContextEngineHostSupport(params: {
  backendId: string;
  capabilities?: readonly ContextEngineHostCapability[];
}): ContextEngineHostSupport {
  return {
    id: `cli:${params.backendId}`,
    label: `CLI backend "${params.backendId}"`,
    capabilities: params.capabilities ?? GENERIC_CLI_CONTEXT_ENGINE_HOST_CAPABILITIES,
  };
}

/** Evaluate whether a context-engine host can safely run the requested operation. */
export function evaluateContextEngineHostSupport(params: {
  contextEngineInfo: ContextEngineInfo;
  operation: ContextEngineOperation;
  host: ContextEngineHostSupport;
}): ContextEngineHostSupportEvaluation {
  const requirements = params.contextEngineInfo.hostRequirements?.[params.operation];
  if (!requirements || requirements.requiredCapabilities.length === 0) {
    return { ok: true, requirements, missingCapabilities: [] };
  }

  const supported = new Set(params.host.capabilities);
  const missingCapabilities = requirements.requiredCapabilities.filter(
    (capability) => !supported.has(capability),
  );
  if (missingCapabilities.length === 0) {
    return { ok: true, requirements, missingCapabilities: [] };
  }

  return {
    ok: false,
    requirements,
    missingCapabilities,
  };
}

/** Assert that a context engine can safely run under the supplied host. */
export function assertContextEngineHostSupport(params: {
  contextEngine: ContextEngine;
  operation: ContextEngineOperation;
  host: ContextEngineHostSupport;
}): void {
  const evaluation = evaluateContextEngineHostSupport({
    contextEngineInfo: params.contextEngine.info,
    operation: params.operation,
    host: params.host,
  });
  if (evaluation.ok) {
    return;
  }

  const engineId = params.contextEngine.info.id;
  const required = evaluation.requirements.requiredCapabilities.join(", ");
  const actual =
    params.host.capabilities.length > 0 ? params.host.capabilities.join(", ") : "(none)";
  const guidance = evaluation.requirements.unsupportedMessage
    ? ` ${evaluation.requirements.unsupportedMessage}`
    : "";
  throw new Error(
    `Context engine "${engineId}" cannot run operation "${params.operation}" on ${params.host.label}. ` +
      `Missing host capabilities: ${evaluation.missingCapabilities.join(", ")}. ` +
      `Required capabilities: ${required}. ` +
      `Host capabilities: ${actual}.${guidance}`,
  );
}
