// test-utils plugin runtime env helpers and runtime behavior.
import type { OutputRuntimeEnv, RuntimeEnv } from "openclaw/plugin-sdk/runtime";
import { vi } from "vitest";

type RuntimeEnvOptions = {
  throwOnExit?: boolean;
};

/** Reused helper for create Runtime Env behavior in src/test-utils. */
export function createRuntimeEnv(options?: RuntimeEnvOptions): OutputRuntimeEnv {
  const throwOnExit = options?.throwOnExit ?? true;
  return {
    log: vi.fn(),
    error: vi.fn(),
    writeStdout: vi.fn(),
    writeJson: vi.fn(),
    exit: throwOnExit
      ? vi.fn((code: number): never => {
          throw new Error(`exit ${code}`);
        })
      : vi.fn(),
  };
}

/** Reused helper for create Typed Runtime Env behavior in src/test-utils. */
export function createTypedRuntimeEnv<TRuntime extends RuntimeEnv = OutputRuntimeEnv>(
  options?: RuntimeEnvOptions,
  _runtimeShape?: (runtime: TRuntime) => void,
): TRuntime {
  return createRuntimeEnv(options) as unknown as TRuntime;
}

/** Reused helper for create Non Exiting Runtime Env behavior in src/test-utils. */
export function createNonExitingRuntimeEnv(): OutputRuntimeEnv {
  return createRuntimeEnv({ throwOnExit: false });
}

/** Reused helper for create Non Exiting Typed Runtime Env behavior in src/test-utils. */
export function createNonExitingTypedRuntimeEnv<TRuntime extends RuntimeEnv = OutputRuntimeEnv>(
  runtimeShape?: (runtime: TRuntime) => void,
): TRuntime {
  return createTypedRuntimeEnv<TRuntime>({ throwOnExit: false }, runtimeShape);
}
