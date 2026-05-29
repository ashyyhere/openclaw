// Chat type normalization shared by channel routing and reply policy.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Normalized chat surface kind. */
export type ChatType = "direct" | "group" | "channel";

/** Normalize user/plugin chat type labels into the closed chat type set. */
export function normalizeChatType(raw?: string): ChatType | undefined {
  const value = normalizeOptionalLowercaseString(raw);
  if (!value) {
    return undefined;
  }
  if (value === "direct" || value === "dm") {
    return "direct";
  }
  if (value === "group") {
    return "group";
  }
  if (value === "channel") {
    return "channel";
  }
  return undefined;
}
