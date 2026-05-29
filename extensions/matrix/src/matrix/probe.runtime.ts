// Runtime boundary for extensions/matrix/src/matrix probe runtime behavior.
import { createMatrixClient } from "./client.js";

// Keep probe's runtime seam narrow so tests can mock it without loading the full client barrel.
export { createMatrixClient };
