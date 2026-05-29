#!/usr/bin/env node
// OpenClaw index helpers and runtime behavior.
import process from "node:process";
import { fileURLToPath } from "node:url";
import { formatCliFailureLines } from "./cli/failure-output.js";
import { formatUncaughtError } from "./infra/errors.js";
import { runFatalErrorHooks } from "./infra/fatal-error-hooks.js";
import { isMainModule } from "./infra/is-main.js";
import {
  installUnhandledRejectionHandler,
  isBenignUncaughtExceptionError,
  isUncaughtExceptionHandled,
} from "./infra/unhandled-rejections.js";

type LegacyCliDeps = {
  runCli: (argv: string[]) => Promise<void>;
};

type LibraryExports = typeof import("./library.js");

// These bindings are populated only for library consumers. The CLI entry stays
// on the lean path and must not read them while running as main.
/** Reused constant for apply Template behavior in src. */
export let applyTemplate: LibraryExports["applyTemplate"];
/** Reused constant for create Default Deps behavior in src. */
export let createDefaultDeps: LibraryExports["createDefaultDeps"];
/** Reused constant for derive Session Key behavior in src. */
export let deriveSessionKey: LibraryExports["deriveSessionKey"];
/** Reused constant for describe Port Owner behavior in src. */
export let describePortOwner: LibraryExports["describePortOwner"];
/** Reused constant for ensure Binary behavior in src. */
export let ensureBinary: LibraryExports["ensureBinary"];
/** Reused constant for ensure Port Available behavior in src. */
export let ensurePortAvailable: LibraryExports["ensurePortAvailable"];
/** Reused constant for get Reply From Config behavior in src. */
export let getReplyFromConfig: LibraryExports["getReplyFromConfig"];
/** Reused constant for handle Port Error behavior in src. */
export let handlePortError: LibraryExports["handlePortError"];
/** Reused constant for load Config behavior in src. */
export let loadConfig: LibraryExports["loadConfig"];
/** Reused constant for load Session Store behavior in src. */
export let loadSessionStore: LibraryExports["loadSessionStore"];
/** Reused constant for monitor Web Channel behavior in src. */
export let monitorWebChannel: LibraryExports["monitorWebChannel"];
/** Reused constant for normalize E164 behavior in src. */
export let normalizeE164: LibraryExports["normalizeE164"];
/** Reused constant for Port In Use Error behavior in src. */
export let PortInUseError: LibraryExports["PortInUseError"];
/** Reused constant for prompt Yes No behavior in src. */
export let promptYesNo: LibraryExports["promptYesNo"];
/** Reused constant for resolve Session Key behavior in src. */
export let resolveSessionKey: LibraryExports["resolveSessionKey"];
/** Reused constant for resolve Store Path behavior in src. */
export let resolveStorePath: LibraryExports["resolveStorePath"];
/** Reused constant for run Command With Timeout behavior in src. */
export let runCommandWithTimeout: LibraryExports["runCommandWithTimeout"];
/** Reused constant for run Exec behavior in src. */
export let runExec: LibraryExports["runExec"];
/** Reused constant for save Session Store behavior in src. */
export let saveSessionStore: LibraryExports["saveSessionStore"];
/** Reused constant for wait Forever behavior in src. */
export let waitForever: LibraryExports["waitForever"];

async function loadLegacyCliDeps(): Promise<LegacyCliDeps> {
  const { runCli } = await import("./cli/run-main.js");
  return { runCli };
}

// Legacy direct file entrypoint only. Package root exports now live in library.ts.
/** Reused helper for run Legacy Cli Entry behavior in src. */
export async function runLegacyCliEntry(
  argv: string[] = process.argv,
  deps?: LegacyCliDeps,
): Promise<void> {
  const { runCli } = deps ?? (await loadLegacyCliDeps());
  await runCli(argv);
}

const isMain = isMainModule({
  currentFile: fileURLToPath(import.meta.url),
});

if (!isMain) {
  ({
    applyTemplate,
    createDefaultDeps,
    deriveSessionKey,
    describePortOwner,
    ensureBinary,
    ensurePortAvailable,
    getReplyFromConfig,
    handlePortError,
    loadConfig,
    loadSessionStore,
    monitorWebChannel,
    normalizeE164,
    PortInUseError,
    promptYesNo,
    resolveSessionKey,
    resolveStorePath,
    runCommandWithTimeout,
    runExec,
    saveSessionStore,
    waitForever,
  } = await import("./library.js"));
}

if (isMain) {
  const { restoreTerminalState } = await import("../packages/terminal-core/src/restore.js");

  // Global error handlers to prevent silent crashes from unhandled rejections/exceptions.
  // These log the error and exit gracefully instead of crashing without trace.
  installUnhandledRejectionHandler();

  process.on("uncaughtException", (error) => {
    if (isUncaughtExceptionHandled(error)) {
      return;
    }
    if (isBenignUncaughtExceptionError(error)) {
      console.warn(
        "[openclaw] Non-fatal uncaught exception (continuing):",
        formatUncaughtError(error),
      );
      return;
    }
    for (const line of formatCliFailureLines({
      title: "OpenClaw hit an unexpected runtime error.",
      error,
      argv: process.argv,
    })) {
      console.error(line);
    }
    for (const message of runFatalErrorHooks({ reason: "uncaught_exception", error })) {
      console.error("[openclaw]", message);
    }
    restoreTerminalState("uncaught exception", { resumeStdinIfPaused: false });
    process.exit(1);
  });

  void runLegacyCliEntry(process.argv).catch((err) => {
    for (const line of formatCliFailureLines({
      title: "The CLI command failed.",
      error: err,
      argv: process.argv,
    })) {
      console.error(line);
    }
    for (const message of runFatalErrorHooks({ reason: "legacy_cli_failure", error: err })) {
      console.error("[openclaw]", message);
    }
    restoreTerminalState("legacy cli failure", { resumeStdinIfPaused: false });
    process.exit(1);
  });
}
