import { uniqueStrings } from "../shared/string-normalization.js";
import { readCliStartupMetadata } from "./startup-metadata.js";

function dedupe(values: string[]): string[] {
  return uniqueStrings(values.filter(Boolean));
}

let precomputedChannelOptions: string[] | null | undefined;

function loadPrecomputedChannelOptions(): string[] | null {
  if (precomputedChannelOptions !== undefined) {
    return precomputedChannelOptions;
  }
  try {
    const parsed = readCliStartupMetadata(import.meta.url) as { channelOptions?: unknown } | null;
    if (parsed && Array.isArray(parsed.channelOptions)) {
      precomputedChannelOptions = dedupe(
        parsed.channelOptions.filter((value): value is string => typeof value === "string"),
      );
      return precomputedChannelOptions;
    }
  } catch {
    // Source checkouts may not have generated startup metadata yet.
  }
  precomputedChannelOptions = null;
  return null;
}

/** Returns startup-metadata channel choices without loading plugin registries. */
export function resolveCliChannelOptions(): string[] {
  const precomputed = loadPrecomputedChannelOptions();
  return precomputed ?? [];
}

/** Formats channel option choices for Commander help text. */
export function formatCliChannelOptions(extra: string[] = []): string {
  const options = [...extra, ...resolveCliChannelOptions()];
  return options.length > 0 ? options.join("|") : "channel";
}

/** Test seam for resetting cached startup-metadata channel options. */
export const testing = {
  resetPrecomputedChannelOptionsForTests(): void {
    precomputedChannelOptions = undefined;
  },
};
/** Backward-compatible test export for channel option cache controls. */
export { testing as __testing };
