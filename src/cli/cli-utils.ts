import type { Command } from "commander";
import { formatErrorMessage } from "../infra/errors.js";

/**
 * Re-export the shared error formatter used by CLI command wrappers.
 */
export { formatErrorMessage };

type ManagerLookupResult<T> = {
  manager: T | null;
  error?: string;
};

/** Run a manager-backed command and always close the manager after successful lookup. */
export async function withManager<T>(params: {
  getManager: () => Promise<ManagerLookupResult<T>>;
  onMissing: (error?: string) => void;
  run: (manager: T) => Promise<void>;
  close: (manager: T) => Promise<void>;
  onCloseError?: (err: unknown) => void;
}): Promise<void> {
  const { manager, error } = await params.getManager();
  if (!manager) {
    params.onMissing(error);
    return;
  }
  try {
    await params.run(manager);
  } finally {
    try {
      await params.close(manager);
    } catch (err) {
      params.onCloseError?.(err);
    }
  }
}

/** Execute a CLI action through an injectable runtime so tests can observe errors/exits. */
export async function runCommandWithRuntime(
  runtime: { error: (message: string) => void; exit: (code: number) => void },
  action: () => Promise<void>,
  onError?: (error: unknown) => void,
): Promise<void> {
  try {
    await action();
  } catch (err) {
    if (onError) {
      onError(err);
      return;
    }
    runtime.error(String(err));
    runtime.exit(1);
  }
}

/** Resolve an option from the command or its parents, matching Commander global lookup. */
export function resolveOptionFromCommand<T>(
  command: Command | undefined,
  key: string,
): T | undefined {
  // oxlint-disable-line typescript/no-unnecessary-type-parameters -- Commander option values are typed by the caller.
  let current: Command | null | undefined = command;
  while (current) {
    const opts = current.opts?.() ?? {};
    if (opts[key] !== undefined) {
      return opts[key];
    }
    current = current.parent ?? undefined;
  }
  return undefined;
}
