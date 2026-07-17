/** @type {(input: string) => string} */
let twMerge = (input) => input;
// Try to load tailwind-merge if available. Use dynamic import.
try {
  import("tailwind-merge")
    .then((mod) => {
      if (mod && mod.twMerge) twMerge = mod.twMerge;
    })
    .catch(() => {});
} catch (e) {
  // tailwind-merge not available, use fallback
}

/**
 * @param {...any} inputs
 * @returns {string}
 */
function clsx(...inputs) {
  return inputs
    .flatMap((input) => {
      if (!input) return []
      if (typeof input === "string" || typeof input === "number") {
        return [input]
      }
      if (Array.isArray(input)) {
        return clsx(...input).split(" ")
      }
      if (typeof input === "object") {
        return Object.keys(input).filter((key) => input[key])
      }
      return []
    })
    .join(" ")
}

/**
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isIframe = window.self !== window.top;
