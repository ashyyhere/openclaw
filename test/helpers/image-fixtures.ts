// Re-export shared image fixture builders for tests outside the plugin SDK tree.
/** Shared image fixture builders used by media and plugin tests. */
export {
  createGrayscaleAlphaPngBuffer,
  createNoisyPngBuffer,
  createNoisyRgbaBuffer,
  createSolidPngBuffer,
  createTinyJpegBuffer,
} from "../../src/plugin-sdk/test-helpers/image-fixtures.js";
