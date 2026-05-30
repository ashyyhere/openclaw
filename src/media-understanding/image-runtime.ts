// Lazy image-runtime facade so callers can import image helpers without loading
// provider-heavy image modules during non-image media runs.
import { createLazyRuntimeMethodBinder, createLazyRuntimeModule } from "../shared/lazy-runtime.js";

const loadImageRuntime = createLazyRuntimeModule(() => import("./image.js"));
const bindImageRuntime = createLazyRuntimeMethodBinder(loadImageRuntime);

/** Lazily describes one image with an explicit provider/model selection. */
export const describeImageWithModel = bindImageRuntime((runtime) => runtime.describeImageWithModel);
/** Lazily describes multiple images with an explicit provider/model selection. */
export const describeImagesWithModel = bindImageRuntime(
  (runtime) => runtime.describeImagesWithModel,
);
/** Lazily exposes the single-image payload transform used by tool/runtime callers. */
export const describeImageWithModelPayloadTransform = bindImageRuntime(
  (runtime) => runtime.describeImageWithModelPayloadTransform,
);
/** Lazily exposes the multi-image payload transform used by tool/runtime callers. */
export const describeImagesWithModelPayloadTransform = bindImageRuntime(
  (runtime) => runtime.describeImagesWithModelPayloadTransform,
);
