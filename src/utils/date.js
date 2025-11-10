// src/utils/date.js
/**
 * Parses any ISO-like date safely and returns a local Date object at noon
 * (avoids DST issues). Accepts "YYYY-MM-DD" or full ISO strings.
 */
export function parseLocalDate(value) {
  if (!value) return new Date();
  if (value instanceof Date && !isNaN(value)) return value;

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [_, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d), 12);
  }

  const dt = new Date(value);
  return isNaN(dt) ? new Date() : dt;
}

/** Converts a dateish value to local "YYYY-MM-DD" string */
export function toIsoLocalYmd(dateish) {
  const d = parseLocalDate(dateish);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
