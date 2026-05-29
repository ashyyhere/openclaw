// Theme transition entry point. Current UI applies themes immediately while
// retaining the context/options shape for callers that pass pointer metadata.
import type { ResolvedTheme } from "./theme.ts";

/** Pointer/element metadata retained for theme transition callers. */
export type ThemeTransitionContext = {
  element?: HTMLElement | null;
  pointerClientX?: number;
  pointerClientY?: number;
};

/** Inputs required to switch the resolved theme. */
export type ThemeTransitionOptions = {
  nextTheme: ResolvedTheme;
  applyTheme: () => void;
  // Retained so callers from stacked slices can keep passing pointer metadata
  // while theme switching remains an immediate, non-animated update here.
  context?: ThemeTransitionContext;
  currentTheme?: ResolvedTheme | null;
};

const cleanupThemeTransition = (root: HTMLElement) => {
  root.classList.remove("theme-transition");
  root.style.removeProperty("--theme-switch-x");
  root.style.removeProperty("--theme-switch-y");
};

/** Apply the next theme immediately and clean up transition CSS state. */
export const startThemeTransition = ({
  nextTheme,
  applyTheme,
  currentTheme,
}: ThemeTransitionOptions) => {
  if (currentTheme === nextTheme) {
    // Even when the resolved palette is unchanged (e.g. system->dark on a dark OS),
    // we still need to persist the user's explicit selection immediately.
    applyTheme();
    return;
  }

  const documentReference = globalThis.document ?? null;
  if (!documentReference) {
    applyTheme();
    return;
  }

  const root = documentReference.documentElement;
  // Theme updates should be visible immediately on click with no transition lag.
  applyTheme();
  cleanupThemeTransition(root);
};
