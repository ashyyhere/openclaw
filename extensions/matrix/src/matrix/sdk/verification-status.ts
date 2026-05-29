// extensions/matrix/src/matrix/sdk verification status helpers and runtime behavior.
import type { MatrixDeviceVerificationStatusLike } from "./types.js";

function isMatrixDeviceLocallyVerified(
  status: MatrixDeviceVerificationStatusLike | null | undefined,
): boolean {
  return status?.localVerified === true;
}

export function isMatrixDeviceOwnerVerified(
  status: MatrixDeviceVerificationStatusLike | null | undefined,
): boolean {
  return status?.crossSigningVerified === true;
}

export function isMatrixDeviceVerifiedInCurrentClient(
  status: MatrixDeviceVerificationStatusLike | null | undefined,
): boolean {
  return (
    status?.isVerified?.() === true ||
    isMatrixDeviceLocallyVerified(status) ||
    isMatrixDeviceOwnerVerified(status)
  );
}
