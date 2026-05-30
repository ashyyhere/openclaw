// Diffs Shiki curated facade exposes bundled languages, themes, and highlighter shorthands.
import {
  createBundledHighlighter,
  createCssVariablesTheme,
  createSingletonShorthands,
  getTokenStyleObject,
  guessEmbeddedLanguages,
  normalizeTheme,
  stringifyTokenStyle,
} from "@shikijs/core";
import {
  createJavaScriptRegexEngine,
  defaultJavaScriptRegexConstructor,
} from "@shikijs/engine-javascript";
import { createOnigurumaEngine, loadWasm } from "@shikijs/engine-oniguruma";
import { bundledLanguages } from "../extensions/diffs/src/shiki-curated-languages.js";
/** Re-export core Shiki APIs for the curated Diffs bundle. */
export * from "@shikijs/core";
/** Re-export the curated language registry used by the Diffs plugin. */
export {
  bundledLanguages,
  bundledLanguagesAlias,
  bundledLanguagesBase,
  bundledLanguagesInfo,
} from "../extensions/diffs/src/shiki-curated-languages.js";
/** Re-export bundled Shiki themes for Diffs highlighting. */
export { bundledThemes, bundledThemesInfo } from "shiki/themes";
import { bundledThemes } from "shiki/themes";

/** Language id available in the curated Diffs Shiki bundle. */
export type BundledLanguage = keyof typeof bundledLanguages;
/** Theme id available in the bundled Shiki theme registry. */
export type BundledTheme = keyof typeof bundledThemes;

/** Curated Shiki highlighter factory for Diffs rendering. */
export const createHighlighter = createBundledHighlighter({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createOnigurumaEngine(import("shiki/wasm")),
});

const shorthands = createSingletonShorthands(createHighlighter, { guessEmbeddedLanguages });

/** Singleton shorthand for rendering code to highlighted HTML. */
export const codeToHtml = shorthands.codeToHtml;
/** Singleton shorthand for rendering code to HAST. */
export const codeToHast = shorthands.codeToHast;
/** Singleton shorthand for tokenizing code with one theme. */
export const codeToTokens = shorthands.codeToTokens;
/** Singleton shorthand for base tokenization. */
export const codeToTokensBase = shorthands.codeToTokensBase;
/** Singleton shorthand for tokenizing code across themes. */
export const codeToTokensWithThemes = shorthands.codeToTokensWithThemes;
/** Returns the shared highlighter instance. */
export const getSingletonHighlighter = shorthands.getSingletonHighlighter;
/** Reads the previous grammar state from singleton highlighting. */
export const getLastGrammarState = shorthands.getLastGrammarState;
/** Re-export engine and theme helpers needed by consumers of the curated facade. */
export {
  createCssVariablesTheme,
  createJavaScriptRegexEngine,
  createOnigurumaEngine,
  defaultJavaScriptRegexConstructor,
  getTokenStyleObject,
  loadWasm,
  normalizeTheme,
  stringifyTokenStyle,
};
