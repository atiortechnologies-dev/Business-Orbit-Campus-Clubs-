/**
 * Simple client-side error capture utility.
 */

let lastError: unknown = null;

export function captureError(error: unknown): void {
  lastError = error;

  if ((import.meta as any).env?.DEV) {
    console.error("Captured Error:", error);
  }
}

export function getLastCapturedError(): unknown {
  return lastError;
}

export function clearCapturedError(): void {
  lastError = null;
}

window.addEventListener("error", (event) => {
  captureError(event.error ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  captureError(event.reason);
});