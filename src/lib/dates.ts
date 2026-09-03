/**
 * "14 August 2026". Written out rather than numeric, because 14/08 and 08/14
 * are the same string to a machine and opposite dates to a reader.
 *
 * Parsed and formatted in UTC on purpose. `new Date('2026-08-14')` is midnight
 * UTC, so anyone west of Greenwich formatting it in local time sees the 13th —
 * and the prerenderer would then bake a different date into the HTML than the
 * browser shows, which is a hydration mismatch on a date nobody would think to
 * check.
 */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
