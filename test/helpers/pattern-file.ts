// Pattern-file helpers create temporary JSON include/exclude files for Vitest config tests.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/** Create temp pattern files and expose cleanup for config tests. */
export function createPatternFileHelper(prefix: string) {
  const tempDirs = new Set<string>();

  return {
    cleanup() {
      for (const dir of tempDirs) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
      tempDirs.clear();
    },
    writePatternFile(basename: string, value: unknown) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
      tempDirs.add(dir);
      const filePath = path.join(dir, basename);
      fs.writeFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
      return filePath;
    },
  };
}
