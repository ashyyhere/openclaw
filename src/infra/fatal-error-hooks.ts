// infra fatal error hooks helpers and runtime behavior.
/** Shared type for Fatal Error Hook Context in src/infra. */
export type FatalErrorHookContext = {
  reason: string;
  error?: unknown;
};

/** Shared type for Fatal Error Hook in src/infra. */
export type FatalErrorHook = (context: FatalErrorHookContext) => string | undefined | void;

const hooks = new Set<FatalErrorHook>();

function formatHookFailure(error: unknown): string {
  const name = error instanceof Error && error.name ? error.name : "unknown";
  return `fatal-error hook failed: ${name}`;
}

/** Reused helper for register Fatal Error Hook behavior in src/infra. */
export function registerFatalErrorHook(hook: FatalErrorHook): () => void {
  hooks.add(hook);
  return () => {
    hooks.delete(hook);
  };
}

/** Reused helper for run Fatal Error Hooks behavior in src/infra. */
export function runFatalErrorHooks(context: FatalErrorHookContext): string[] {
  const messages: string[] = [];
  for (const hook of hooks) {
    try {
      const message = hook(context);
      if (typeof message === "string" && message.trim()) {
        messages.push(message);
      }
    } catch (err) {
      messages.push(formatHookFailure(err));
    }
  }
  return messages;
}

/** Reused helper for reset Fatal Error Hooks For Test behavior in src/infra. */
export function resetFatalErrorHooksForTest(): void {
  hooks.clear();
}
