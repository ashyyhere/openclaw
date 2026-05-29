// Capability helpers for choosing music-generation generate/edit mode and per-mode provider limits.
import type {
  MusicGenerationEditCapabilities,
  MusicGenerationMode,
  MusicGenerationModeCapabilities,
  MusicGenerationProvider,
} from "./types.js";

/** Selects edit mode when source images are present, otherwise generate mode. */
export function resolveMusicGenerationMode(params: {
  inputImageCount?: number;
}): MusicGenerationMode {
  return (params.inputImageCount ?? 0) > 0 ? "edit" : "generate";
}

/** Lists provider modes exposed to runtime/UI callers. */
export function listSupportedMusicGenerationModes(
  provider: Pick<MusicGenerationProvider, "capabilities">,
): MusicGenerationMode[] {
  const modes: MusicGenerationMode[] = ["generate"];
  const edit = provider.capabilities.edit;
  if (edit?.enabled) {
    modes.push("edit");
  }
  return modes;
}

/** Returns the capability block relevant to the resolved generate/edit mode. */
export function resolveMusicGenerationModeCapabilities(params: {
  provider?: Pick<MusicGenerationProvider, "capabilities">;
  inputImageCount?: number;
}): {
  mode: MusicGenerationMode;
  capabilities: MusicGenerationModeCapabilities | MusicGenerationEditCapabilities | undefined;
} {
  const mode = resolveMusicGenerationMode(params);
  const capabilities = params.provider?.capabilities;
  if (!capabilities) {
    return { mode, capabilities: undefined };
  }
  if (mode === "generate") {
    return {
      mode,
      capabilities: capabilities.generate,
    };
  }
  return {
    mode,
    capabilities: capabilities.edit,
  };
}
