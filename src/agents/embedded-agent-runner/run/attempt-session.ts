/** Creates SDK sessions with embedded-agent resource-loader wiring. */
import type { CreateAgentSessionOptions } from "../../sessions/index.js";

/** SDK session options after embedded-agent runtime resources have been prepared. */
export type EmbeddedAgentSessionOptions = {
  cwd: string;
  agentDir: string;
  authStorage: unknown;
  modelRegistry: unknown;
  model: unknown;
  thinkingLevel: unknown;
  tools: NonNullable<CreateAgentSessionOptions["tools"]>;
  customTools: NonNullable<CreateAgentSessionOptions["customTools"]>;
  sessionManager: unknown;
  settingsManager: unknown;
  resourceLoader: unknown;
  withSessionWriteLock?: CreateAgentSessionOptions["withSessionWriteLock"];
};

/** Runs a callback with session options that include an embedded resource loader. */
export async function createEmbeddedAgentSessionWithResourceLoader<Result>(params: {
  createAgentSession: (options: EmbeddedAgentSessionOptions) => Promise<Result> | Result;
  options: EmbeddedAgentSessionOptions;
}): Promise<Result> {
  return await params.createAgentSession(params.options);
}
