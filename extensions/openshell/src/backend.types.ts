// Shared types for extensions/openshell/src backend types behavior.
import type { RemoteShellSandboxHandle, SandboxBackendHandle } from "openclaw/plugin-sdk/sandbox";

export type OpenShellFsBridgeContext = Parameters<
  NonNullable<SandboxBackendHandle["createFsBridge"]>
>[0]["sandbox"];

export type OpenShellSandboxBackend = SandboxBackendHandle &
  RemoteShellSandboxHandle & {
    mode: "mirror" | "remote";
    syncLocalPathToRemote(localPath: string, remotePath: string): Promise<void>;
  };
