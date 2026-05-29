/**
 * Utilities for formatting keybinding hints in the UI.
 */

import { getKeybindings, type Keybinding, type KeyId } from "@earendil-works/pi-tui";
import { theme } from "../theme/theme.js";

/** Shared type for Key Text Format Options in src/agents/modes. */
export interface KeyTextFormatOptions {
  capitalize?: boolean;
}

function formatKeyPart(part: string, options: KeyTextFormatOptions): string {
  const displayPart =
    process.platform === "darwin" && part.toLowerCase() === "alt" ? "option" : part;
  return options.capitalize
    ? displayPart.charAt(0).toUpperCase() + displayPart.slice(1)
    : displayPart;
}

/** Reused helper for format Key Text behavior in src/agents/modes. */
export function formatKeyText(key: string, options: KeyTextFormatOptions = {}): string {
  return key
    .split("/")
    .map((k) =>
      k
        .split("+")
        .map((part) => formatKeyPart(part, options))
        .join("+"),
    )
    .join("/");
}

function formatKeys(keys: KeyId[], options: KeyTextFormatOptions = {}): string {
  if (keys.length === 0) {
    return "";
  }
  return formatKeyText(keys.join("/"), options);
}

/** Reused helper for key Text behavior in src/agents/modes. */
export function keyText(keybinding: Keybinding): string {
  return formatKeys(getKeybindings().getKeys(keybinding));
}

/** Reused helper for key Display Text behavior in src/agents/modes. */
export function keyDisplayText(keybinding: Keybinding): string {
  return formatKeys(getKeybindings().getKeys(keybinding), { capitalize: true });
}

/** Reused helper for key Hint behavior in src/agents/modes. */
export function keyHint(keybinding: Keybinding, description: string): string {
  return theme.fg("dim", keyText(keybinding)) + theme.fg("muted", ` ${description}`);
}

/** Reused helper for raw Key Hint behavior in src/agents/modes. */
export function rawKeyHint(key: string, description: string): string {
  return theme.fg("dim", formatKeyText(key)) + theme.fg("muted", ` ${description}`);
}
