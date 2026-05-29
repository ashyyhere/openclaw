// test global setup helpers and runtime behavior.
import { installTestEnv } from "./test-env";

export default async () => {
  const { cleanup } = installTestEnv();
  return () => cleanup();
};
