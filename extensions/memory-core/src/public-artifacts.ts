// extensions/memory-core/src public artifacts helpers and runtime behavior.
import {
  listMemoryHostPublicArtifacts,
  type MemoryPluginPublicArtifact,
} from "openclaw/plugin-sdk/memory-host-core";
import type { OpenClawConfig } from "../api.js";

export async function listMemoryCorePublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]> {
  return await listMemoryHostPublicArtifacts(params);
}
