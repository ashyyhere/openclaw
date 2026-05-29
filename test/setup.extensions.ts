// test setup extensions helpers and runtime behavior.
import { afterAll } from "vitest";
import { installSharedTestSetup } from "./setup.shared.js";

const testEnv = installSharedTestSetup({ loadProfileEnv: false });

afterAll(() => {
  testEnv.cleanup();
});
