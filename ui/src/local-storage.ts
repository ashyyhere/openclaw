// Browser storage guards for Control UI code that also runs in tests or
// restricted browser contexts where storage access can throw.
function isStorage(value: unknown): value is Storage {
  return (
    Boolean(value) &&
    typeof (value as Storage).getItem === "function" &&
    typeof (value as Storage).setItem === "function"
  );
}

function getSafeStorage(name: "localStorage" | "sessionStorage"): Storage | null {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);

  if (typeof process !== "undefined" && process.env?.VITEST) {
    return descriptor && !descriptor.get && isStorage(descriptor.value) ? descriptor.value : null;
  }

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    try {
      const storage = window[name];
      return isStorage(storage) ? storage : null;
    } catch {
      return null;
    }
  }

  return descriptor && !descriptor.get && isStorage(descriptor.value) ? descriptor.value : null;
}

/** Returns localStorage when it is accessible, otherwise null for safe fallback paths. */
export function getSafeLocalStorage(): Storage | null {
  return getSafeStorage("localStorage");
}

/** Returns sessionStorage when it is accessible, otherwise null for safe fallback paths. */
export function getSafeSessionStorage(): Storage | null {
  return getSafeStorage("sessionStorage");
}
