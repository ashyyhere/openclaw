// Wizard tests use this mocked prompter fixture for predictable prompt answers.
import { vi } from "vitest";
import type { WizardPrompter } from "../../src/wizard/prompts.js";

/** Create a wizard prompter with mocked methods and optional overrides. */
export function createWizardPrompter(overrides?: Partial<WizardPrompter>): WizardPrompter {
  const select = vi.fn(async () => "quickstart") as unknown as WizardPrompter["select"];
  return {
    intro: vi.fn(async () => {}),
    outro: vi.fn(async () => {}),
    note: vi.fn(async () => {}),
    select,
    multiselect: vi.fn(async () => []),
    text: vi.fn(async () => ""),
    confirm: vi.fn(async () => false),
    progress: vi.fn(() => ({ update: vi.fn(), stop: vi.fn() })),
    ...overrides,
  };
}
