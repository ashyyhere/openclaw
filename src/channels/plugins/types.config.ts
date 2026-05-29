/** Config schema metadata types exposed by channel plugin manifests. */
import type { JsonSchemaObject } from "../../shared/json-schema.types.js";

/** Shared type for Channel Config Ui Hint in src/channels/plugins. */
export type ChannelConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  itemTemplate?: unknown;
};

/** Shared type for Channel Config Runtime Issue in src/channels/plugins. */
export type ChannelConfigRuntimeIssue = {
  path?: Array<string | number>;
  message?: string;
  code?: string;
} & Record<string, unknown>;

/** Shared type for Channel Config Runtime Parse Result in src/channels/plugins. */
export type ChannelConfigRuntimeParseResult =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      issues: ChannelConfigRuntimeIssue[];
    };

/** Shared type for Channel Config Runtime Schema in src/channels/plugins. */
export type ChannelConfigRuntimeSchema = {
  safeParse: (value: unknown) => ChannelConfigRuntimeParseResult;
};

/** Shared type for Channel Config Schema in src/channels/plugins. */
export type ChannelConfigSchema = {
  schema: JsonSchemaObject;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigRuntimeSchema;
};
