import { createConfigIO } from "../config/config.js";
import type { TaglineMode } from "./tagline.js";

/** Narrows raw config values to supported CLI banner tagline modes. */
export function parseTaglineMode(value: unknown): TaglineMode | undefined {
  if (value === "random" || value === "default" || value === "off") {
    return value;
  }
  return undefined;
}

/** Reads banner tagline mode without forcing full CLI config validation. */
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
