// QA Lab temp-dir test helper tracks temporary workspaces for cleanup.
import {
  tempWorkspace,
  resolvePreferredOpenClawTmpDir,
  type TempWorkspace,
} from "openclaw/plugin-sdk/temp-path";

/** Creates a test harness for allocating and cleaning temporary directories. */
export function createTempDirHarness() {
  const tempDirs: TempWorkspace[] = [];

  return {
    async cleanup() {
      await Promise.all(tempDirs.splice(0).map((dir) => dir.cleanup()));
    },
    async makeTempDir(prefix: string) {
      const dir = await tempWorkspace({
        rootDir: resolvePreferredOpenClawTmpDir(),
        prefix,
      });
      tempDirs.push(dir);
      return dir.dir;
    },
  };
}
