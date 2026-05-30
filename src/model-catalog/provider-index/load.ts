// Loader for the built-in OpenClaw provider index.
import { normalizeOpenClawProviderIndex } from "./normalize.js";
import { OPENCLAW_PROVIDER_INDEX } from "./openclaw-provider-index.js";
import type { OpenClawProviderIndex } from "./types.js";

/** Normalize an OpenClaw provider index source or return an empty index. */
export function loadOpenClawProviderIndex(
  source: unknown = OPENCLAW_PROVIDER_INDEX,
): OpenClawProviderIndex {
  return normalizeOpenClawProviderIndex(source) ?? { version: 1, providers: {} };
}
