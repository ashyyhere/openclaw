// Shared types for config markdown tables types behavior.
import type { MarkdownTableMode } from "./types.base.js";
import type { OpenClawConfig } from "./types.openclaw.js";

/** Shared type for Resolve Markdown Table Mode Params in src/config. */
export type ResolveMarkdownTableModeParams = {
  cfg?: Partial<OpenClawConfig>;
  channel?: string | null;
  accountId?: string | null;
};

/** Shared type for Resolve Markdown Table Mode in src/config. */
export type ResolveMarkdownTableMode = (
  params: ResolveMarkdownTableModeParams,
) => MarkdownTableMode;
