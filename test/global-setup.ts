// Vitest global setup installs the shared isolated OpenClaw test environment once per worker pool.
import { installTestEnv } from "./test-env";

export default async () => {
  const { cleanup } = installTestEnv();
  return () => cleanup();
};
