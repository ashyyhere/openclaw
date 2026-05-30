/** Builds a cached human-readable summary for the current operating system. */
import { spawnSync } from "node:child_process";
import os from "node:os";
import { normalizeOptionalString } from "../shared/string-coerce.js";

type OsSummary = {
  platform: NodeJS.Platform;
  arch: string;
  release: string;
  label: string;
};

const cachedOsSummaryByKey = new Map<string, OsSummary>();

function macosVersion(): string {
  const res = spawnSync("sw_vers", ["-productVersion"], { encoding: "utf-8" });
  const out = normalizeOptionalString(res.stdout) ?? "";
  return out || os.release();
}

/** Resolve platform, arch, release, and display label for diagnostics. */
export function resolveOsSummary(): OsSummary {
  const platform = os.platform();
  const release = os.release();
  const arch = os.arch();
  const cacheKey = `${platform}\0${release}\0${arch}`;
  const cached = cachedOsSummaryByKey.get(cacheKey);
  if (cached) {
    return cached;
  }
  const label = (() => {
    if (platform === "darwin") {
      return `macos ${macosVersion()} (${arch})`;
    }
    if (platform === "win32") {
      return `windows ${release} (${arch})`;
    }
    return `${platform} ${release} (${arch})`;
  })();
  const summary = { platform, arch, release, label };
  cachedOsSummaryByKey.set(cacheKey, summary);
  return summary;
}
