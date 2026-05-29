// Vitest mock call inspection helpers with clearer assertion failures.
import { expect } from "vitest";

/** Returns a mock call by index or throws an explicit missing-call error. */
export function mockCall(mock: unknown, index = 0): Array<unknown> {
  const calls = (mock as { mock?: { calls?: Array<Array<unknown>> } }).mock?.calls ?? [];
  const call = calls.at(index);
  if (!call) {
    throw new Error(`Expected mock call ${index + 1}`);
  }
  return call;
}

/** Returns the first mock argument when it is an object record. */
export function mockFirstObjectArg(mock: unknown): Record<string, unknown> {
  const [arg] = mockCall(mock);
  if (!arg || typeof arg !== "object") {
    throw new Error("expected first mock argument object");
  }
  return arg as Record<string, unknown>;
}

/** Asserts selected object fields without requiring a full object match. */
export function expectObjectFields(value: unknown, expected: Record<string, unknown>): void {
  if (!value || typeof value !== "object") {
    throw new Error("expected object fields");
  }
  const record = value as Record<string, unknown>;
  for (const [key, expectedValue] of Object.entries(expected)) {
    expect(record[key], key).toEqual(expectedValue);
  }
}
