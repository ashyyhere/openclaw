// Test helpers for exec approval command/path resolution.
// Fixtures keep shell parser and wrapper-resolution parity tests data-driven.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { CommandResolution, ExecutableResolution } from "./exec-command-resolution.js";

/** Build a minimal PATH/PATHEXT environment for executable resolution tests. */
export function makePathEnv(binDir: string): NodeJS.ProcessEnv {
  if (process.platform !== "win32") {
    return { PATH: binDir };
  }
  return { PATH: binDir, PATHEXT: ".EXE;.CMD;.BAT;.COM" };
}

/** Create a realpath-normalized temp directory for exec approval fixtures. */
export function makeTempDir(): string {
  return fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-exec-approvals-")));
}

/** Build an executable-resolution object for command-resolution tests. */
export function makeMockExecutableResolution(params: {
  rawExecutable: string;
  executableName: string;
  resolvedPath?: string;
  resolvedRealPath?: string;
}): ExecutableResolution {
  return {
    rawExecutable: params.rawExecutable,
    resolvedPath: params.resolvedPath,
    resolvedRealPath: params.resolvedRealPath,
    executableName: params.executableName,
  };
}

/** Build a command-resolution object with legacy getter aliases used by older tests. */
export function makeMockCommandResolution(params: {
  execution: ExecutableResolution;
  policy?: ExecutableResolution;
  effectiveArgv?: string[];
  wrapperChain?: string[];
  policyBlocked?: boolean;
  blockedWrapper?: string;
}): CommandResolution {
  const policy = params.policy ?? params.execution;
  const resolution: CommandResolution = {
    execution: params.execution,
    policy,
    effectiveArgv: params.effectiveArgv,
    wrapperChain: params.wrapperChain,
    policyBlocked: params.policyBlocked,
    blockedWrapper: params.blockedWrapper,
  };
  return Object.defineProperties(resolution, {
    rawExecutable: {
      get: () => params.execution.rawExecutable,
    },
    resolvedPath: {
      get: () => params.execution.resolvedPath,
    },
    resolvedRealPath: {
      get: () => params.execution.resolvedRealPath,
    },
    executableName: {
      get: () => params.execution.executableName,
    },
    policyResolution: {
      get: () => (policy === params.execution ? undefined : policy),
    },
  });
}

type ShellParserParityFixtureCase = {
  id: string;
  command: string;
  ok: boolean;
  executables: string[];
};

type ShellParserParityFixture = {
  cases: ShellParserParityFixtureCase[];
};

type WrapperResolutionParityFixtureCase = {
  id: string;
  argv: string[];
  expectedRawExecutable: string | null;
};

type WrapperResolutionParityFixture = {
  cases: WrapperResolutionParityFixtureCase[];
};

/** Load shell parser parity fixture cases from the repo test fixtures. */
export function loadShellParserParityFixtureCases(): ShellParserParityFixtureCase[] {
  const fixturePath = path.join(
    process.cwd(),
    "test",
    "fixtures",
    "exec-allowlist-shell-parser-parity.json",
  );
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as ShellParserParityFixture;
  return fixture.cases;
}

/** Load wrapper resolution parity fixture cases from the repo test fixtures. */
export function loadWrapperResolutionParityFixtureCases(): WrapperResolutionParityFixtureCase[] {
  const fixturePath = path.join(
    process.cwd(),
    "test",
    "fixtures",
    "exec-wrapper-resolution-parity.json",
  );
  const fixture = JSON.parse(
    fs.readFileSync(fixturePath, "utf8"),
  ) as WrapperResolutionParityFixture;
  return fixture.cases;
}
