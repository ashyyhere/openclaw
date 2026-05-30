// Package metadata readers for install/update diagnostics.
// Values are normalized to nullable strings so callers do not inspect raw package JSON.
import path from "node:path";
import { normalizeNullableString as normalizeString } from "../shared/string-coerce.js";
import { tryReadJson } from "./json-files.js";

type PackageJson = {
  name?: unknown;
  packageManager?: unknown;
  version?: unknown;
};

/** Read package.json as a narrow metadata object, returning null for invalid files. */
export async function readPackageJson(root: string): Promise<PackageJson | null> {
  const parsed = await tryReadJson<unknown>(path.join(root, "package.json"));
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as PackageJson)
    : null;
}

/** Read the package version field as a normalized string. */
export async function readPackageVersion(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.version);
}

/** Read the package name field as a normalized string. */
export async function readPackageName(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.name);
}

/** Read the packageManager field used to choose install/update tooling. */
export async function readPackageManagerSpec(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.packageManager);
}
