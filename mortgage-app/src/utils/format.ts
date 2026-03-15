/* ==========================================================================
   Formatting Utilities
   --------------------------------------------------------------------------
   Handles JMD currency formatting and date formatting for display.
   ========================================================================== */

/**
 * Format a number as Jamaican Dollar (JMD) currency.
 * Uses Intl.NumberFormat for locale-aware comma separators and 2 decimal places.
 *
 * Example: 18000000 → "$18,000,000.00"
 *
 * @param amount - The monetary value to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-JM', {
    style: 'currency',
    currency: 'JMD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a Date object as a human-readable string.
 * Example: "March 2061"
 *
 * @param date - The date to format
 * @returns Formatted date string (month and year)
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-JM', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a percentage value for display.
 * Example: 9.85 → "9.85%"
 *
 * @param value - The percentage number
 * @returns Formatted percentage string
 */
export function formatPercent(value: number): string {
  return `${value}%`;
}
