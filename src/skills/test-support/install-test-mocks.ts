/** Shared vi mocks for skill installer dependency overrides. */
import { vi } from "vitest";
import type { Mock } from "vitest";

/** Mocked command runner used by install command tests. */
export const runCommandWithTimeoutMock: Mock<(...args: unknown[]) => unknown> = vi.fn();
/** Mocked source scanner used by install safety tests. */
export const scanDirectoryWithSummaryMock: Mock<(...args: unknown[]) => unknown> = vi.fn();
/** Mocked guarded fetch used by download installer tests. */
export const fetchWithSsrFGuardMock: Mock<(...args: unknown[]) => unknown> = vi.fn();
/** Mocked binary lookup used by installer fallback tests. */
export const hasBinaryMock: Mock<(bin: string) => boolean> = vi.fn();
