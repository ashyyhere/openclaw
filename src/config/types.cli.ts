// config types cli helpers and runtime behavior.
/** Shared type for Cli Banner Tagline Mode in src/config. */
export type CliBannerTaglineMode = "random" | "default" | "off";

/** Shared type for Cli Config in src/config. */
export type CliConfig = {
  banner?: {
    /**
     * Controls CLI banner tagline behavior.
     * - "random": pick from tagline pool (default)
     * - "default": always use DEFAULT_TAGLINE
     * - "off": hide tagline text
     */
    taglineMode?: CliBannerTaglineMode;
  };
};
