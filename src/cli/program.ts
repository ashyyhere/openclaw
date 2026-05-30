/**
 * Re-export port cleanup for command tests that need to release a bound dev port.
 */
export { forceFreePort } from "./ports.js";
/**
 * Re-export the canonical Commander program builder for CLI entrypoints.
 */
export { buildProgram } from "./program/build-program.js";
