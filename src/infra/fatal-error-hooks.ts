// Fatal-error hook registry.
// Hooks can append final diagnostics without throwing through shutdown paths.
/** Context passed to fatal-error hooks before process exit/reporting. */
export type FatalErrorHookContext = {
  reason: string;
  error?: unknown;
};

/** Hook that may return one diagnostic line for a fatal error. */
export type FatalErrorHook = (context: FatalErrorHookContext) => string | undefined | void;

const hooks = new Set<FatalErrorHook>();

function formatHookFailure(error: unknown): string {
  const name = error instanceof Error && error.name ? error.name : "unknown";
  return `fatal-error hook failed: ${name}`;
}

/** Register a fatal-error hook and return an unregister callback. */
export function registerFatalErrorHook(hook: FatalErrorHook): () => void {
  hooks.add(hook);
  return () => {
    hooks.delete(hook);
  };
}

/** Run registered fatal-error hooks, converting hook failures into diagnostics. */
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

/** Clear hook state for isolated tests. */
export function resetFatalErrorHooksForTest(): void {
  hooks.clear();
}
