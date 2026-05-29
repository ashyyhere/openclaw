/** Runtime id normalization for embedded agent harness selection. */
export type EmbeddedAgentRuntime = "openclaw" | "auto" | (string & {});

/** Reused constant for OPENCLAW AGENT RUNTIME ID behavior in src/agents. */
export const OPENCLAW_AGENT_RUNTIME_ID = "openclaw";
/** Reused constant for AUTO AGENT RUNTIME ID behavior in src/agents. */
export const AUTO_AGENT_RUNTIME_ID = "auto";

/** Normalize configured embedded agent runtime ids and retired aliases. */
export function normalizeEmbeddedAgentRuntime(raw: string | undefined): EmbeddedAgentRuntime {
  const value = raw?.trim();
  if (!value) {
    return OPENCLAW_AGENT_RUNTIME_ID;
  }
  if (value === "openclaw" || value === "pi") {
    return OPENCLAW_AGENT_RUNTIME_ID;
  }
  if (value === "auto") {
    return AUTO_AGENT_RUNTIME_ID;
  }
  if (value === "codex-app-server") {
    return "codex";
  }
  return value;
}

/** Normalize an optional unknown runtime id from config/input. */
export function normalizeOptionalAgentRuntimeId(raw: unknown): EmbeddedAgentRuntime | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }
  const value = raw.trim().toLowerCase();
  return value ? normalizeEmbeddedAgentRuntime(value) : undefined;
}

/**
 * @deprecated Whole-agent runtime environment selection is retired. Use
 * provider/model runtime policy or a registered agent harness instead.
 */
export function resolveEmbeddedAgentRuntime(
  _env: NodeJS.ProcessEnv = process.env,
): EmbeddedAgentRuntime {
  return OPENCLAW_AGENT_RUNTIME_ID;
}

/** Return whether a runtime id means the default/auto runtime. */
export function isDefaultAgentRuntimeId(runtime: string | undefined): boolean {
  return runtime === undefined || runtime === AUTO_AGENT_RUNTIME_ID || runtime === "default";
}
