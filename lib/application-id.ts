/**
 * Apex Process — Application reference ID generator.
 * Format: APX-YYYY-MM-XXXX  (e.g. APX-2026-06-7Q4K)
 * The suffix is a short, human-readable, ambiguous-character-free code.
 */

// Crockford-ish alphabet: no 0/O, 1/I/L confusion.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function randomSuffix(length = 4): string {
  // Prefer crypto when available (Node 24 / Edge both expose globalThis.crypto).
  const cryptoObj = (globalThis as { crypto?: Crypto }).crypto;
  let out = "";
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(length);
    cryptoObj.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      out += ALPHABET[bytes[i]! % ALPHABET.length];
    }
    return out;
  }
  // Fallback (should not happen on supported runtimes).
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/**
 * Generate an application reference ID.
 * @param date injectable for testability (defaults to now).
 */
export function generateApplicationId(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `APX-${year}-${month}-${randomSuffix(4)}`;
}
