#!/usr/bin/env node
// Dual package entrypoint: lazy library exports for imports, CLI handoff for direct execution.
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
/** Template application helper loaded lazily for library consumers. */
export let applyTemplate: LibraryExports["applyTemplate"];
/** Default dependency factory loaded lazily for library consumers. */
export let createDefaultDeps: LibraryExports["createDefaultDeps"];
/** Session key derivation helper loaded lazily for library consumers. */
export let deriveSessionKey: LibraryExports["deriveSessionKey"];
/** Port-owner diagnostic helper loaded lazily for library consumers. */
export let describePortOwner: LibraryExports["describePortOwner"];
/** Binary availability helper loaded lazily for library consumers. */
export let ensureBinary: LibraryExports["ensureBinary"];
/** Port availability helper loaded lazily for library consumers. */
export let ensurePortAvailable: LibraryExports["ensurePortAvailable"];
/** Reply-config resolver loaded lazily for library consumers. */
export let getReplyFromConfig: LibraryExports["getReplyFromConfig"];
/** Port error formatter loaded lazily for library consumers. */
export let handlePortError: LibraryExports["handlePortError"];
/** Config loader loaded lazily for library consumers. */
export let loadConfig: LibraryExports["loadConfig"];
/** Session store loader loaded lazily for library consumers. */
export let loadSessionStore: LibraryExports["loadSessionStore"];
/** Web channel monitor loaded lazily for library consumers. */
export let monitorWebChannel: LibraryExports["monitorWebChannel"];
/** Phone-number normalization helper loaded lazily for library consumers. */
export let normalizeE164: LibraryExports["normalizeE164"];
/** Port-in-use error class loaded lazily for library consumers. */
export let PortInUseError: LibraryExports["PortInUseError"];
/** CLI yes/no prompt helper loaded lazily for library consumers. */
export let promptYesNo: LibraryExports["promptYesNo"];
/** Session key resolver loaded lazily for library consumers. */
export let resolveSessionKey: LibraryExports["resolveSessionKey"];
/** Store path resolver loaded lazily for library consumers. */
export let resolveStorePath: LibraryExports["resolveStorePath"];
/** Timed command runner loaded lazily for library consumers. */
export let runCommandWithTimeout: LibraryExports["runCommandWithTimeout"];
/** Exec runner loaded lazily for library consumers. */
export let runExec: LibraryExports["runExec"];
/** Session store saver loaded lazily for library consumers. */
export let saveSessionStore: LibraryExports["saveSessionStore"];
/** Indefinite wait helper loaded lazily for library consumers. */
export let waitForever: LibraryExports["waitForever"];

async function loadLegacyCliDeps(): Promise<LegacyCliDeps> {
  const { runCli } = await import("./cli/run-main.js");
  return { runCli };
}

// Legacy direct file entrypoint only. Package root exports now live in library.ts.
/** Runs the legacy direct-file CLI entry after loading CLI dependencies. */
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
