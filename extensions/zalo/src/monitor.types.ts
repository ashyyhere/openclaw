// Shared types for extensions/zalo/src monitor types behavior.
export type ZaloRuntimeEnv = {
  log?: (message: string) => void;
  error?: (message: string) => void;
};
