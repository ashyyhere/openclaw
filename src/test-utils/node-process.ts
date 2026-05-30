// Helpers for running small Node ESM snippets in subprocess tests.
import { execFileSync, spawnSync, type SpawnSyncReturns } from "node:child_process";

type NodeEvalArgsOptions = {
  evalFlag?: "--eval" | "-e";
  imports?: readonly string[];
};

type ExecNodeEvalOptions = Omit<NonNullable<Parameters<typeof execFileSync>[2]>, "encoding"> &
  NodeEvalArgsOptions & {
    encoding?: BufferEncoding;
  };

type SpawnNodeEvalOptions = Omit<NonNullable<Parameters<typeof spawnSync>[2]>, "encoding"> &
  NodeEvalArgsOptions & {
    encoding?: BufferEncoding;
  };

/** Build Node args for evaluating an ESM snippet with optional preloaded imports. */
export function createNodeEvalArgs(source: string, options: NodeEvalArgsOptions = {}): string[] {
  const args = (options.imports ?? []).flatMap((specifier) => ["--import", specifier]);
  args.push("--input-type=module", options.evalFlag ?? "--eval", source);
  return args;
}

/** Execute an ESM snippet with the current Node binary and return stdout. */
export function execNodeEvalSync(source: string, options: ExecNodeEvalOptions = {}): string {
  const { evalFlag, imports, ...execOptions } = options;
  return execFileSync(process.execPath, createNodeEvalArgs(source, { evalFlag, imports }), {
    cwd: process.cwd(),
    encoding: "utf8",
    ...execOptions,
  });
}

/** Spawn an ESM snippet with the current Node binary and return the full sync result. */
export function spawnNodeEvalSync(
  source: string,
  options: SpawnNodeEvalOptions = {},
): SpawnSyncReturns<string> {
  const { evalFlag, imports, ...spawnOptions } = options;
  return spawnSync(process.execPath, createNodeEvalArgs(source, { evalFlag, imports }), {
    cwd: process.cwd(),
    encoding: "utf8",
    ...spawnOptions,
  });
}
