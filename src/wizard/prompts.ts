// wizard prompts helpers and runtime behavior.
/** Shared type for Wizard Select Option in src/wizard. */
export type WizardSelectOption<T = string> = {
  value: T;
  label: string;
  hint?: string;
};

/** Shared type for Wizard Select Params in src/wizard. */
export type WizardSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValue?: T;
  searchable?: boolean;
};

/** Shared type for Wizard Multi Select Params in src/wizard. */
export type WizardMultiSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValues?: T[];
  searchable?: boolean;
};

/** Shared type for Wizard Text Params in src/wizard. */
export type WizardTextParams = {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
  // Render as a masked input. The entered value is never echoed to the
  // terminal — keeps secrets out of scrollback, transcripts, and screenshots.
  sensitive?: boolean;
};

/** Shared type for Wizard Confirm Params in src/wizard. */
export type WizardConfirmParams = {
  message: string;
  initialValue?: boolean;
};

/** Shared type for Wizard Progress in src/wizard. */
export type WizardProgress = {
  update: (message: string) => void;
  stop: (message?: string) => void;
};

/** Shared type for Wizard Prompter in src/wizard. */
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

/** Reused class for Wizard Cancelled Error behavior in src/wizard. */
export class WizardCancelledError extends Error {
  constructor(message = "wizard cancelled") {
    super(message);
    this.name = "WizardCancelledError";
  }
}
