// media-understanding image runtime helpers and runtime behavior.
import { createLazyRuntimeMethodBinder, createLazyRuntimeModule } from "../shared/lazy-runtime.js";

const loadImageRuntime = createLazyRuntimeModule(() => import("./image.js"));
const bindImageRuntime = createLazyRuntimeMethodBinder(loadImageRuntime);

/** Reused constant for describe Image With Model behavior in src/media-understanding. */
export const describeImageWithModel = bindImageRuntime((runtime) => runtime.describeImageWithModel);
/** Reused constant for describe Images With Model behavior in src/media-understanding. */
export const describeImagesWithModel = bindImageRuntime(
  (runtime) => runtime.describeImagesWithModel,
);
/** Reused constant for describe Image With Model Payload Transform behavior in src/media-understanding. */
export const describeImageWithModelPayloadTransform = bindImageRuntime(
  (runtime) => runtime.describeImageWithModelPayloadTransform,
);
/** Reused constant for describe Images With Model Payload Transform behavior in src/media-understanding. */
export const describeImagesWithModelPayloadTransform = bindImageRuntime(
  (runtime) => runtime.describeImagesWithModelPayloadTransform,
);
