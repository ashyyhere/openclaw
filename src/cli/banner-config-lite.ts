/** Lightweight config reader used by banner rendering without full CLI startup. */
import { createConfigIO } from "../config/config.js";
import type { TaglineMode } from "./tagline.js";

/** Reused helper for parse Tagline Mode behavior in src/cli. */
export function parseTaglineMode(value: unknown): TaglineMode | undefined {
  if (value === "random" || value === "default" || value === "off") {
    return value;
  }
  return undefined;
}

/** Reused helper for read Cli Banner Tagline Mode behavior in src/cli. */
export function readCliBannerTaglineMode(
  env: NodeJS.ProcessEnv = process.env,
): TaglineMode | undefined {
  try {
    const parsed = createConfigIO({ env }).loadConfig() as {
      cli?: { banner?: { taglineMode?: unknown } };
    };
    return parseTaglineMode(parsed.cli?.banner?.taglineMode);
  } catch {
    return undefined;
  }
}
