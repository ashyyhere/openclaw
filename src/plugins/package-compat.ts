// plugins package compat helpers and runtime behavior.
import { isRecord } from "../shared/record-coerce.js";

/** Shared type for Package Plugin Api Range Result in src/plugins. */
export type PackagePluginApiRangeResult =
  | { ok: true; range?: string }
  | { ok: false; error: string };

/** Reused helper for resolve Package Plugin Api Range behavior in src/plugins. */
export function resolvePackagePluginApiRange(
  packageMetadata: unknown,
): PackagePluginApiRangeResult {
  if (packageMetadata === undefined || packageMetadata === null) {
    return { ok: true };
  }
  if (!isRecord(packageMetadata)) {
    return { ok: true };
  }
  if (!("compat" in packageMetadata)) {
    return { ok: true };
  }
  const compat = packageMetadata.compat;
  if (compat === undefined || compat === null) {
    return { ok: true };
  }
  if (!isRecord(compat)) {
    return { ok: false, error: "package.json openclaw.compat must be an object" };
  }
  if (!("pluginApi" in compat)) {
    return { ok: true };
  }
  const pluginApi = compat.pluginApi;
  if (typeof pluginApi !== "string") {
    return { ok: false, error: "package.json openclaw.compat.pluginApi must be a string" };
  }
  const range = pluginApi.trim();
  if (!range) {
    return { ok: false, error: "package.json openclaw.compat.pluginApi must not be empty" };
  }
  return { ok: true, range };
}
