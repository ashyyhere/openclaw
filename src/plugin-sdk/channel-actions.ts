/** Public SDK helpers for channel action tools, schemas, gates, and parameter readers. */
import { Type } from "typebox";
import type { TSchema } from "typebox";
import { stringEnum as createStringEnum } from "../agents/schema/typebox.js";

/** Re-exported API for src/plugin-sdk. */
export {
  createUnionActionGate,
  listTokenSourcedAccounts,
} from "../channels/plugins/actions/shared.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Reaction Message Id. */
export { resolveReactionMessageId } from "../channels/plugins/actions/reaction-message-id.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createActionGate,
  imageResultFromFile,
  jsonResult,
  readNonNegativeIntegerParam,
  parseAvailableTags,
  readNumberParam,
  readPositiveIntegerParam,
  readReactionParams,
  readStringArrayParam,
  readStringOrNumberParam,
  readStringParam,
  ToolAuthorizationError,
} from "../agents/tools/common.js";
/** Re-exported API for src/plugin-sdk, starting with Action Gate. */
export type { ActionGate } from "../agents/tools/common.js";
/** Re-exported API for src/plugin-sdk, starting with with Normalized Timestamp. */
export { withNormalizedTimestamp } from "../agents/date-time.js";
/** Re-exported API for src/plugin-sdk, starting with assert Media Not Data Url. */
export { assertMediaNotDataUrl } from "../agents/sandbox-paths.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Poll Max Selections. */
export { resolvePollMaxSelections } from "../polls.js";
/** Re-exported API for src/plugin-sdk. */
export {
  optionalFiniteNumberSchema,
  optionalNonNegativeIntegerSchema,
  optionalPositiveIntegerSchema,
  optionalStringEnum,
  stringEnum,
} from "../agents/schema/typebox.js";

/**
 * @deprecated Use semantic `presentation` capabilities instead of exposing
 * provider-native button schemas through the shared message tool.
 */
export function createMessageToolButtonsSchema(): TSchema {
  return Type.Optional(
    Type.Array(
      Type.Array(
        Type.Object({
          text: Type.String(),
          callback_data: Type.String(),
          style: Type.Optional(createStringEnum(["danger", "success", "primary"])),
        }),
      ),
      {
        description: "Button rows for channels that support button-style actions.",
      },
    ),
  );
}

/**
 * @deprecated Use semantic `presentation` capabilities instead of exposing
 * provider-native card schemas through the shared message tool.
 */
export function createMessageToolCardSchema(): TSchema {
  return Type.Optional(
    Type.Object(
      {},
      {
        additionalProperties: true,
        description: "Structured card payload for channels that support card-style messages.",
      },
    ),
  );
}
