// extensions/browser/src/browser output atomic helpers and runtime behavior.
import { writeExternalFileWithinRoot } from "../sdk-security-runtime.js";
import { ensureOutputDirectory } from "./output-directories.js";

export async function writeViaSiblingTempPath(params: {
  rootDir: string;
  targetPath: string;
  writeTemp: (tempPath: string) => Promise<void>;
}): Promise<void> {
  await ensureOutputDirectory(params.rootDir);
  await writeExternalFileWithinRoot({
    rootDir: params.rootDir,
    path: params.targetPath,
    write: params.writeTemp,
  });
}
