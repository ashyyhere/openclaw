import type { CompleteSimpleFn, StreamFn } from "../../llm-core/src/index.js";

/** Provider callbacks required when agent-core is used without direct streamFn injection. */
export interface AgentCoreRuntimeDeps {
  streamSimple: StreamFn;
  completeSimple: CompleteSimpleFn;
}

/** Runtime dependency subset needed by streaming agent loops. */
export type AgentCoreStreamRuntimeDeps = Pick<AgentCoreRuntimeDeps, "streamSimple">;
/** Runtime dependency subset needed by one-shot completions. */
export type AgentCoreCompletionRuntimeDeps = Pick<AgentCoreRuntimeDeps, "completeSimple">;

function missingRuntimeDep(name: keyof AgentCoreRuntimeDeps): Error {
  return new Error(
    `@openclaw/agent-core runtime dependency "${name}" is not configured. Pass an AgentCoreRuntimeDeps instance or a streamFn explicitly.`,
  );
}

/** Prefer explicit streamFn, then runtime stream dependency, or throw a setup error. */
export function resolveAgentCoreStreamFn(
  runtime: AgentCoreStreamRuntimeDeps | undefined,
  streamFn?: StreamFn,
): StreamFn {
  if (streamFn) {
    return streamFn;
  }
  if (runtime?.streamSimple) {
    return runtime.streamSimple;
  }
  throw missingRuntimeDep("streamSimple");
}

/** Resolve the configured one-shot completion dependency or throw a setup error. */
export function resolveAgentCoreCompleteFn(
  runtime: AgentCoreCompletionRuntimeDeps | undefined,
): CompleteSimpleFn {
  if (runtime?.completeSimple) {
    return runtime.completeSimple;
  }
  throw missingRuntimeDep("completeSimple");
}
