/** Creates a resource loader for embedded-agent session managers. */
import { DefaultResourceLoader } from "../sessions/index.js";

type DefaultResourceLoaderInit = ConstructorParameters<typeof DefaultResourceLoader>[0];

/** Reused constant for EMBEDDED AGENT RESOURCE LOADER DISCOVERY OPTIONS behavior in src/agents/embedded-agent-runner. */
export const EMBEDDED_AGENT_RESOURCE_LOADER_DISCOVERY_OPTIONS = {
  noExtensions: true,
  noSkills: true,
  noPromptTemplates: true,
  noThemes: true,
  noContextFiles: true,
} satisfies Partial<DefaultResourceLoaderInit>;

/** Reused helper for create Embedded Agent Resource Loader behavior in src/agents/embedded-agent-runner. */
export function createEmbeddedAgentResourceLoader(
  options: Pick<
    DefaultResourceLoaderInit,
    "cwd" | "agentDir" | "settingsManager" | "extensionFactories"
  >,
): DefaultResourceLoader {
  return new DefaultResourceLoader({
    ...options,
    ...EMBEDDED_AGENT_RESOURCE_LOADER_DISCOVERY_OPTIONS,
  });
}
