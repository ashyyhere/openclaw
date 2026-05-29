/** Shared terminal note mocks for doctor tests. */
import type { Mock } from "vitest";
import { vi } from "vitest";

/** Reused constant for terminal Note Mock behavior in src/commands. */
export const terminalNoteMock: Mock<(...args: unknown[]) => unknown> = vi.fn();

vi.mock("../../packages/terminal-core/src/note.js", () => ({
  note: (...args: unknown[]) => terminalNoteMock(...args),
}));

/** Reused helper for load Doctor Command For Test behavior in src/commands. */
export async function loadDoctorCommandForTest(params?: { unmockModules?: string[] }) {
  vi.resetModules();
  vi.doMock("../../packages/terminal-core/src/note.js", () => ({
    note: (...args: unknown[]) => terminalNoteMock(...args),
  }));
  for (const modulePath of params?.unmockModules ?? []) {
    vi.doUnmock(modulePath);
  }
  const { doctorCommand } = await import("./doctor.js");
  terminalNoteMock.mockClear();
  return doctorCommand;
}
