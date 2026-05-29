// Prompt abstraction shared by terminal and session-backed setup wizards.
/** Selectable wizard option with optional secondary hint text. */
export type WizardSelectOption<T = string> = {
  value: T;
  label: string;
  hint?: string;
};

/** Parameters for one single-select wizard prompt. */
export type WizardSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValue?: T;
  searchable?: boolean;
};

/** Parameters for one multi-select wizard prompt. */
export type WizardMultiSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValues?: T[];
  searchable?: boolean;
};

/** Parameters for one text prompt, including optional validation and masking. */
export type WizardTextParams = {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
  // Render as a masked input. The entered value is never echoed to the
  // terminal — keeps secrets out of scrollback, transcripts, and screenshots.
  sensitive?: boolean;
};

/** Parameters for one yes/no confirmation prompt. */
export type WizardConfirmParams = {
  message: string;
  initialValue?: boolean;
};

/** Long-running wizard progress handle. */
export type WizardProgress = {
  update: (message: string) => void;
  stop: (message?: string) => void;
};

/** UI-independent prompt interface consumed by setup flows. */
export type WizardPrompter = {
  intro: (title: string) => Promise<void>;
  outro: (message: string) => Promise<void>;
  note: (message: string, title?: string) => Promise<void>;
  plain?: (message: string) => Promise<void>;
  select: <T>(params: WizardSelectParams<T>) => Promise<T>;
  multiselect: <T>(params: WizardMultiSelectParams<T>) => Promise<T[]>;
  text: (params: WizardTextParams) => Promise<string>;
  confirm: (params: WizardConfirmParams) => Promise<boolean>;
  progress: (label: string) => WizardProgress;
};

/** Error thrown when the user cancels a wizard flow. */
export class WizardCancelledError extends Error {
  constructor(message = "wizard cancelled") {
    super(message);
    this.name = "WizardCancelledError";
  }
}
