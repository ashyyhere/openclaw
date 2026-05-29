/** Helpers for recognizing local install specs in plugin package inputs. */
import path from "node:path";

/** Reused helper for looks Like Local Install Spec behavior in src/cli. */
export function looksLikeLocalInstallSpec(spec: string, knownSuffixes: readonly string[]): boolean {
  return (
    spec.startsWith(".") ||
    spec.startsWith("~") ||
    path.isAbsolute(spec) ||
    knownSuffixes.some((suffix) => spec.endsWith(suffix))
  );
}
