// infra package json helpers and runtime behavior.
import path from "node:path";
import { normalizeNullableString as normalizeString } from "../shared/string-coerce.js";
import { tryReadJson } from "./json-files.js";

type PackageJson = {
  name?: unknown;
  packageManager?: unknown;
  version?: unknown;
};

/** Reused helper for read Package Json behavior in src/infra. */
export async function readPackageJson(root: string): Promise<PackageJson | null> {
  const parsed = await tryReadJson<unknown>(path.join(root, "package.json"));
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as PackageJson)
    : null;
}

/** Reused helper for read Package Version behavior in src/infra. */
export async function readPackageVersion(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.version);
}

/** Reused helper for read Package Name behavior in src/infra. */
export async function readPackageName(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.name);
}

/** Reused helper for read Package Manager Spec behavior in src/infra. */
export async function readPackageManagerSpec(root: string): Promise<string | null> {
  return normalizeString((await readPackageJson(root))?.packageManager);
}
