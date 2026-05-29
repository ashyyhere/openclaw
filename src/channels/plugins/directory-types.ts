// Channel directory type contracts.
import type { OpenClawConfig } from "../../config/types.js";

/** Shared type for Directory Config Params in src/channels/plugins. */
export type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
