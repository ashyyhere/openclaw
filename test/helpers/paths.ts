// Cross-platform path containment checks shared by filesystem-oriented tests.
import path from "node:path";

/** Return true when target resolves inside base on the current platform. */
export function isPathWithinBase(base: string, target: string): boolean {
  if (process.platform === "win32") {
    const normalizedBase = path.win32.normalize(path.win32.resolve(base));
    const normalizedTarget = path.win32.normalize(path.win32.resolve(target));

    const rel = path.win32.relative(normalizedBase.toLowerCase(), normalizedTarget.toLowerCase());
    return rel === "" || (!rel.startsWith("..") && !path.win32.isAbsolute(rel));
  }

  const normalizedBase = path.resolve(base);
  const normalizedTarget = path.resolve(target);
  const rel = path.relative(normalizedBase, normalizedTarget);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}
