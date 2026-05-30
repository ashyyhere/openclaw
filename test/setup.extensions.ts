// Extension Vitest setup installs isolated shared state and cleans it after extension suites.
import { afterAll } from "vitest";
import { installSharedTestSetup } from "./setup.shared.js";

const testEnv = installSharedTestSetup({ loadProfileEnv: false });

afterAll(() => {
  testEnv.cleanup();
});
