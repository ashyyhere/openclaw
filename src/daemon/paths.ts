// daemon paths helpers and runtime behavior.
import path from "node:path";
import { normalizeOptionalString } from "../shared/string-coerce.js";
import { resolveGatewayProfileSuffix } from "./constants.js";

const windowsAbsolutePath = /^[a-zA-Z]:[\\/]/;
const windowsUncPath = /^\\\\/;

/** Reused helper for resolve Home Dir behavior in src/daemon. */
export function resolveHomeDir(env: Record<string, string | undefined>): string {
  const home = normalizeOptionalString(env.HOME) || normalizeOptionalString(env.USERPROFILE);
  if (!home) {
    throw new Error("Missing HOME");
  }
  return home;
}

function resolveUserPathWithHome(input: string, home?: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    if (!home) {
      throw new Error("Missing HOME");
    }
    const expanded = trimmed.replace(/^~(?=$|[\\/])/, home);
    return path.resolve(expanded);
  }
  if (windowsAbsolutePath.test(trimmed) || windowsUncPath.test(trimmed)) {
    return trimmed;
  }
  return path.resolve(trimmed);
}

/** Reused helper for resolve Gateway State Dir behavior in src/daemon. */
export function resolveGatewayStateDir(env: Record<string, string | undefined>): string {
  const override = normalizeOptionalString(env.OPENCLAW_STATE_DIR);
  if (override) {
    const home = override.startsWith("~") ? resolveHomeDir(env) : undefined;
    return resolveUserPathWithHome(override, home);
  }
  const home = resolveHomeDir(env);
  const suffix = resolveGatewayProfileSuffix(env.OPENCLAW_PROFILE);
  return path.join(home, `.openclaw${suffix}`);
}

/** Reused helper for resolve Gateway Task Script Path behavior in src/daemon. */
export function resolveGatewayTaskScriptPath(env: Record<string, string | undefined>): string {
  const override = normalizeOptionalString(env.OPENCLAW_TASK_SCRIPT);
  if (override) {
    return override;
  }
  const scriptName = normalizeOptionalString(env.OPENCLAW_TASK_SCRIPT_NAME) || "gateway.cmd";
  if (/[/\\]|\.\./.test(scriptName)) {
    throw new Error(
      `OPENCLAW_TASK_SCRIPT_NAME must be a file name only, not a path: ${scriptName}`,
    );
  }
  return path.join(resolveGatewayStateDir(env), scriptName);
}
