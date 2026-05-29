// extensions/matrix/src/matrix/actions limits helpers and runtime behavior.
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";

export function resolveMatrixActionLimit(raw: unknown, fallback: number): number {
  return resolveIntegerOption(raw, fallback, { min: 1 });
}
