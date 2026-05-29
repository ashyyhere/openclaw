// config/sessions transcript write context helpers and runtime behavior.
import { AsyncLocalStorage } from "node:async_hooks";
import path from "node:path";

type OwnedSessionTranscriptWriteContext = {
  sessionFile?: string;
  sessionKey?: string;
  withSessionWriteLock: <T>(
    run: () => Promise<T> | T,
    options?: { publishOwnedWrite?: boolean },
  ) => Promise<T>;
};

const ownedTranscriptWriteContext = new AsyncLocalStorage<OwnedSessionTranscriptWriteContext>();

function normalizePathForCompare(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? path.resolve(trimmed) : undefined;
}

function contextMatches(params: {
  context: OwnedSessionTranscriptWriteContext;
  sessionFile?: string;
  sessionKey?: string;
}): boolean {
  const contextSessionFile = normalizePathForCompare(params.context.sessionFile);
  const sessionFile = normalizePathForCompare(params.sessionFile);
  if (contextSessionFile && sessionFile) {
    return contextSessionFile === sessionFile;
  }

  const contextSessionKey = params.context.sessionKey?.trim();
  const sessionKey = params.sessionKey?.trim();
  return Boolean(contextSessionKey && sessionKey && contextSessionKey === sessionKey);
}

/** Reused helper for with Owned Session Transcript Writes behavior in src/config/sessions. */
export async function withOwnedSessionTranscriptWrites<T>(
  context: OwnedSessionTranscriptWriteContext,
  run: () => Promise<T>,
): Promise<T> {
  return await ownedTranscriptWriteContext.run(context, run);
}

/** Reused helper for bind Owned Session Transcript Writes behavior in src/config/sessions. */
export function bindOwnedSessionTranscriptWrites<TArgs extends unknown[], TResult>(
  context: OwnedSessionTranscriptWriteContext,
  run: (...args: TArgs) => TResult,
): (...args: TArgs) => TResult {
  return (...args) => ownedTranscriptWriteContext.run(context, () => run(...args));
}

/** Reused helper for run With Owned Session Transcript Write Lock behavior in src/config/sessions. */
export async function runWithOwnedSessionTranscriptWriteLock<T>(
  params: {
    sessionFile?: string;
    sessionKey?: string;
  },
  run: () => Promise<T> | T,
): Promise<T> {
  return await runWithOwnedSessionTranscriptWriteContext(params, run);
}

/** Reused helper for run With Owned Session Transcript Write Publication behavior in src/config/sessions. */
export async function runWithOwnedSessionTranscriptWritePublication<T>(
  params: {
    sessionFile?: string;
    sessionKey?: string;
  },
  run: () => Promise<T> | T,
): Promise<T> {
  return await runWithOwnedSessionTranscriptWriteContext(params, run, {
    publishOwnedWrite: true,
  });
}

/** Reused helper for resolve Owned Session Transcript Write Lock Runner behavior in src/config/sessions. */
export function resolveOwnedSessionTranscriptWriteLockRunner(params: {
  sessionFile?: string;
  sessionKey?: string;
}): OwnedSessionTranscriptWriteContext["withSessionWriteLock"] | undefined {
  const context = ownedTranscriptWriteContext.getStore();
  if (!context || !contextMatches({ context, ...params })) {
    return undefined;
  }
  return context.withSessionWriteLock;
}

async function runWithOwnedSessionTranscriptWriteContext<T>(
  params: {
    sessionFile?: string;
    sessionKey?: string;
  },
  run: () => Promise<T> | T,
  options?: { publishOwnedWrite?: boolean },
): Promise<T> {
  const context = ownedTranscriptWriteContext.getStore();
  if (!context || !contextMatches({ context, ...params })) {
    return await run();
  }
  return await context.withSessionWriteLock(run, options);
}
