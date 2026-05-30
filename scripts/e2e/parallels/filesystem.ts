// Parallels filesystem helpers manage smoke artifacts, summaries, and executable scripts.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { repoRoot } from "./host-command.ts";

/** Return whether a path exists without throwing on missing files. */
export async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** Read and parse a JSON artifact file. */
export async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

/** Write a pretty JSON artifact, creating parent directories first. */
export async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

/** Create a Parallels artifact temp directory under the configured artifact root. */
export async function makeTempDir(prefix: string): Promise<string> {
  const root =
    process.env.OPENCLAW_PARALLELS_ARTIFACT_ROOT || path.join(repoRoot, ".artifacts", "parallels");
  mkdirSync(root, { recursive: true });
  return mkdtempSync(path.join(root, prefix));
}

/** Write a Markdown summary next to a JSON smoke summary artifact. */
export async function writeSummaryMarkdown(input: {
  summaryPath: string;
  title: string;
  lines: string[];
}): Promise<string> {
  const markdownPath = path.join(path.dirname(input.summaryPath), "summary.md");
  await writeFile(
    markdownPath,
    [
      `# ${input.title}`,
      "",
      ...input.lines,
      "",
      `JSON: ${path.basename(input.summaryPath)}`,
      "",
    ].join("\n"),
    "utf8",
  );
  return markdownPath;
}

/** Remove a path recursively, ignoring cleanup failures. */
export async function cleanupPath(filePath: string): Promise<void> {
  await rm(filePath, { force: true, recursive: true }).catch(() => undefined);
}

/** Synchronously remove a path recursively for process-exit cleanup paths. */
export function cleanupPathSync(filePath: string): void {
  rmSync(filePath, { force: true, recursive: true });
}

/** Write an executable script file for guest-side smoke helpers. */
export function writeExecutable(filePath: string, content: string): void {
  writeFileSync(filePath, content, { encoding: "utf8", mode: 0o755 });
}
