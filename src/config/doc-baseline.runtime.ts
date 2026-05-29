// Runtime boundary for config doc baseline runtime behavior.
import { collectBundledChannelConfigs as collectBundledChannelConfigsImpl } from "../plugins/bundled-channel-config-metadata.js";
import { loadPluginManifestRegistry as loadPluginManifestRegistryImpl } from "../plugins/manifest-registry.js";
import {
  collectChannelSchemaMetadata as collectChannelSchemaMetadataImpl,
  collectPluginSchemaMetadata as collectPluginSchemaMetadataImpl,
} from "./channel-config-metadata.js";
import { buildConfigSchema as buildConfigSchemaImpl } from "./schema.js";

/** Reused constant for load Plugin Manifest Registry behavior in src/config. */
export const loadPluginManifestRegistry = loadPluginManifestRegistryImpl;
/** Reused constant for collect Bundled Channel Configs behavior in src/config. */
export const collectBundledChannelConfigs = collectBundledChannelConfigsImpl;
/** Reused constant for collect Channel Schema Metadata behavior in src/config. */
export const collectChannelSchemaMetadata = collectChannelSchemaMetadataImpl;
/** Reused constant for collect Plugin Schema Metadata behavior in src/config. */
export const collectPluginSchemaMetadata = collectPluginSchemaMetadataImpl;
/** Reused constant for build Config Schema behavior in src/config. */
export const buildConfigSchema = buildConfigSchemaImpl;
