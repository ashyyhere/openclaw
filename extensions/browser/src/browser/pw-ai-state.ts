// extensions/browser/src/browser pw ai state helpers and runtime behavior.
let pwAiLoaded = false;

export function markPwAiLoaded(): void {
  pwAiLoaded = true;
}

export function isPwAiLoaded(): boolean {
  return pwAiLoaded;
}
