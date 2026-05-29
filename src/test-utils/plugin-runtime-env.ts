// Mock plugin runtime environments for command/runtime unit tests.
import type { OutputRuntimeEnv, RuntimeEnv } from "openclaw/plugin-sdk/runtime";
import { vi } from "vitest";

type RuntimeEnvOptions = {
  throwOnExit?: boolean;
};

/** Creates a mocked output runtime whose exit throws by default for assertions. */
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

/** Creates a mocked runtime and casts it to the narrower runtime shape under test. */
export function createTypedRuntimeEnv<TRuntime extends RuntimeEnv = OutputRuntimeEnv>(
  options?: RuntimeEnvOptions,
  _runtimeShape?: (runtime: TRuntime) => void,
): TRuntime {
  return createRuntimeEnv(options) as unknown as TRuntime;
}

/** Creates a mocked output runtime whose exit call is recorded but does not throw. */
export function createNonExitingRuntimeEnv(): OutputRuntimeEnv {
  return createRuntimeEnv({ throwOnExit: false });
}

/** Creates a non-throwing mocked runtime with a caller-specified runtime type. */
export function createNonExitingTypedRuntimeEnv<TRuntime extends RuntimeEnv = OutputRuntimeEnv>(
  runtimeShape?: (runtime: TRuntime) => void,
): TRuntime {
  return createTypedRuntimeEnv<TRuntime>({ throwOnExit: false }, runtimeShape);
}
