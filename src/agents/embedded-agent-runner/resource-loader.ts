/** Creates a resource loader for embedded-agent session managers. */
import { DefaultResourceLoader } from "../sessions/index.js";

type DefaultResourceLoaderInit = ConstructorParameters<typeof DefaultResourceLoader>[0];

/** Discovery disables unrelated local resources so embedded sessions stay startup-cheap. */
export const EMBEDDED_AGENT_RESOURCE_LOADER_DISCOVERY_OPTIONS = {
  noExtensions: true,
  noSkills: true,
  noPromptTemplates: true,
  noThemes: true,
  noContextFiles: true,
} satisfies Partial<DefaultResourceLoaderInit>;

/** Creates the resource loader used by embedded-agent session managers. */
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
