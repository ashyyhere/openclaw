// music-generation capabilities helpers and runtime behavior.
import type {
  MusicGenerationEditCapabilities,
  MusicGenerationMode,
  MusicGenerationModeCapabilities,
  MusicGenerationProvider,
} from "./types.js";

/** Reused helper for resolve Music Generation Mode behavior in src/music-generation. */
export function resolveMusicGenerationMode(params: {
  inputImageCount?: number;
}): MusicGenerationMode {
  return (params.inputImageCount ?? 0) > 0 ? "edit" : "generate";
}

/** Reused helper for list Supported Music Generation Modes behavior in src/music-generation. */
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

/** Reused helper for resolve Music Generation Mode Capabilities behavior in src/music-generation. */
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
