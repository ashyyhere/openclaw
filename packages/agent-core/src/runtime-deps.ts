import type { CompleteSimpleFn, StreamFn } from "../../llm-core/src/index.js";

/** Public type describing Agent Core Runtime Deps for packages/agent-core. */
export interface AgentCoreRuntimeDeps {
  streamSimple: StreamFn;
  completeSimple: CompleteSimpleFn;
}

/** Public type describing Agent Core Stream Runtime Deps for packages/agent-core. */
export type AgentCoreStreamRuntimeDeps = Pick<AgentCoreRuntimeDeps, "streamSimple">;
/** Public type describing Agent Core Completion Runtime Deps for packages/agent-core. */
export type AgentCoreCompletionRuntimeDeps = Pick<AgentCoreRuntimeDeps, "completeSimple">;

function missingRuntimeDep(name: keyof AgentCoreRuntimeDeps): Error {
  return new Error(
    `@openclaw/agent-core runtime dependency "${name}" is not configured. Pass an AgentCoreRuntimeDeps instance or a streamFn explicitly.`,
  );
}

/** Public helper for resolve Agent Core Stream Fn behavior in packages/agent-core. */
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

/** Public helper for resolve Agent Core Complete Fn behavior in packages/agent-core. */
export function resolveAgentCoreCompleteFn(
  runtime: AgentCoreCompletionRuntimeDeps | undefined,
): CompleteSimpleFn {
  if (runtime?.completeSimple) {
    return runtime.completeSimple;
  }
  throw missingRuntimeDep("completeSimple");
}
