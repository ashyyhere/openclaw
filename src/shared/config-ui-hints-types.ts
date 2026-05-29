// shared config ui hints types helpers and runtime behavior.
/** Shared type for Config Ui Hint in src/shared. */
export type ConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  group?: string;
  order?: number;
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  itemTemplate?: unknown;
};

/** Shared type for Config Ui Hints in src/shared. */
export type ConfigUiHints = Record<string, ConfigUiHint>;
