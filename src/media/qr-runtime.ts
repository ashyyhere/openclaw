// Lazy QR-code runtime loader and input validation helpers.
import type QRCode from "qrcode";
import { createLazyImportLoader } from "../shared/lazy-promise.js";

type QrCodeRuntime = typeof QRCode;

const qrCodeRuntimeLoader = createLazyImportLoader<QrCodeRuntime>(() =>
  import("qrcode").then((mod) => mod.default ?? mod),
);

/** Loads the optional qrcode package once for QR generation callers. */
export async function loadQrCodeRuntime(): Promise<QrCodeRuntime> {
  return await qrCodeRuntimeLoader.load();
}

/** Validates QR payload text before handing it to the QR runtime. */
export function normalizeQrText(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("QR text must be a string.");
  }
  if (text.length === 0) {
    throw new Error("QR text must not be empty.");
  }
  return text;
}
