/**
 * ✅ Safely parses various date formats and keeps them local.
 * Works for:
 *  - "YYYY-MM-DD"
 *  - ISO strings like "2025-11-10T00:00:00Z"
 *  - JS Date objects
 * Returns a Date object set to local noon (avoids DST issues).
 */
export function parseLocalDate(value) {
  if (!value) return new Date();

  // Already a valid Date object
  if (value instanceof Date && !isNaN(value)) return value;

  // Match "YYYY-MM-DD" format explicitly
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, y, m, d] = match;
    // Local date at noon to avoid DST boundary shifts
    return new Date(Number(y), Number(m) - 1, Number(d), 12);
  }

  // Fallback: parse full ISO or timestamp
  const dt = new Date(value);
  return isNaN(dt) ? new Date() : dt;
}

/**
 * ✅ Converts a Date or date-like value to a local "YYYY-MM-DD" string.
 * Example: new Date("2025-11-10T00:00:00Z") → "2025-11-09" (if you're in UTC-5)
 */
export function toIsoLocalYmd(dateish) {
  const d = parseLocalDate(dateish);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * ✅ Normalizes any incoming date (ISO or plain) to a local "YYYY-MM-DD" string.
 * Use this before saving or displaying dates to ensure consistency.
 */
export function normalizeNoteDate(value) {
  if (!value) return toIsoLocalYmd(new Date());

  // If it's already "YYYY-MM-DD", just return it untouched
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // Otherwise, safely parse and normalize
  return toIsoLocalYmd(parseLocalDate(value));
}
