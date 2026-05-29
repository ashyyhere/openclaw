/** Runtime-safe exports for built-in model suppression helpers. */
import {
  buildShouldSuppressBuiltInModel as buildShouldSuppressBuiltInModelImpl,
  shouldSuppressBuiltInModel as shouldSuppressBuiltInModelImpl,
} from "./model-suppression.js";

type ShouldSuppressBuiltInModel =
  typeof import("./model-suppression.js").shouldSuppressBuiltInModel;
type BuildShouldSuppressBuiltInModel =
  typeof import("./model-suppression.js").buildShouldSuppressBuiltInModel;

/** Forward built-in model suppression check through runtime boundary. */
export function shouldSuppressBuiltInModel(
  ...args: Parameters<ShouldSuppressBuiltInModel>
): ReturnType<ShouldSuppressBuiltInModel> {
  return shouldSuppressBuiltInModelImpl(...args);
}

/** Forward suppression resolver construction through runtime boundary. */
export function buildShouldSuppressBuiltInModel(
  ...args: Parameters<BuildShouldSuppressBuiltInModel>
): ReturnType<BuildShouldSuppressBuiltInModel> {
  return buildShouldSuppressBuiltInModelImpl(...args);
}
