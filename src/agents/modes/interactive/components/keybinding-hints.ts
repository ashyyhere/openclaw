/**
 * Utilities for formatting keybinding hints in the UI.
 */

import { getKeybindings, type Keybinding, type KeyId } from "@earendil-works/pi-tui";
import { theme } from "../theme/theme.js";

/** Formatting switches for keyboard shortcut labels shown in the interactive UI. */
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

/** Format a slash-delimited shortcut string with platform-specific key names. */
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

/** Return the raw keybinding shortcut text for a registered action. */
export function keyText(keybinding: Keybinding): string {
  return formatKeys(getKeybindings().getKeys(keybinding));
}

/** Return display-cased keybinding shortcut text for a registered action. */
export function keyDisplayText(keybinding: Keybinding): string {
  return formatKeys(getKeybindings().getKeys(keybinding), { capitalize: true });
}

/** Render a dim keybinding plus muted description for footer/status hints. */
export function keyHint(keybinding: Keybinding, description: string): string {
  return theme.fg("dim", keyText(keybinding)) + theme.fg("muted", ` ${description}`);
}

/** Render a hint for an ad hoc shortcut string that is not registered in keybindings. */
export function rawKeyHint(key: string, description: string): string {
  return theme.fg("dim", formatKeyText(key)) + theme.fg("muted", ` ${description}`);
}
