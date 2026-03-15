/* ==========================================================================
   Input Validation Utilities
   --------------------------------------------------------------------------
   Provides validation functions for all mortgage calculator inputs.
   Each function returns an error message string or null if valid.
   ========================================================================== */

/**
 * Validate the borrower's age.
 * Age is optional. If provided, it must be an integer between 18 and 100.
 *
 * @param age - The age value to validate (can be undefined or empty string)
 * @returns Error message string, or null if valid
 */
export function validateAge(age: number | undefined | null): string | null {
  if (age === undefined || age === null) {
    return null; // Age is optional.
  }
  if (!Number.isInteger(age)) {
    return 'Age must be a whole number.';
  }
  if (age < 18) {
    return 'Age must be at least 18.';
  }
  if (age > 100) {
    return 'Age must be 100 or less.';
  }
  return null;
}

/**
 * Validate the property price.
 * Must be a positive number greater than zero.
 *
 * @param price - The property price to validate
 * @returns Error message string, or null if valid
 */
export function validatePropertyPrice(price: number | undefined | null): string | null {
  if (price === undefined || price === null || isNaN(price)) {
    return 'Property price is required.';
  }
  if (price <= 0) {
    return 'Property price must be greater than zero.';
  }
  return null;
}

/**
 * Validate the annual interest rate.
 * Must be between 0 and 25 percent.
 *
 * @param rate - The interest rate to validate (as a percentage, e.g. 9.85)
 * @returns Error message string, or null if valid
 */
export function validateInterestRate(rate: number | undefined | null): string | null {
  if (rate === undefined || rate === null || isNaN(rate)) {
    return 'Interest rate is required.';
  }
  if (rate < 0) {
    return 'Interest rate cannot be negative.';
  }
  if (rate > 25) {
    return 'Interest rate must be 25% or less.';
  }
  return null;
}

/**
 * Validate the loan-to-value (LTV) percentage.
 * Must be between 0 and 100.
 *
 * @param ltv - The LTV percentage to validate
 * @returns Error message string, or null if valid
 */
export function validateLTV(ltv: number | undefined | null): string | null {
  if (ltv === undefined || ltv === null || isNaN(ltv)) {
    return 'Loan-to-value percentage is required.';
  }
  if (ltv <= 0) {
    return 'LTV must be greater than 0%.';
  }
  if (ltv > 100) {
    return 'LTV cannot exceed 100%.';
  }
  return null;
}

/**
 * Validate the salary and total monthly debt payments as a pair.
 * Both fields are optional, but if one is filled the other must be too.
 *
 * @param salary - The gross monthly salary
 * @param debtPayments - The total monthly debt payments
 * @returns An object with error messages for each field (null if valid)
 */
export function validateSalaryDebtPair(
  salary: number | undefined | null,
  debtPayments: number | undefined | null
): { salary: string | null; debtPayments: string | null } {
  const hasSalary = salary !== undefined && salary !== null && !isNaN(salary);
  const hasDebt = debtPayments !== undefined && debtPayments !== null && !isNaN(debtPayments);

  const result = { salary: null as string | null, debtPayments: null as string | null };

  // If neither is provided, both are valid (fully optional pair).
  if (!hasSalary && !hasDebt) {
    return result;
  }

  // If one is provided but not the other, flag the missing one.
  if (hasSalary && !hasDebt) {
    result.debtPayments = 'Total monthly debt payments is required when salary is provided.';
  }
  if (hasDebt && !hasSalary) {
    result.salary = 'Monthly salary is required when debt payments are provided.';
  }

  // Validate salary value if present.
  if (hasSalary && salary! <= 0) {
    result.salary = 'Monthly salary must be greater than zero.';
  }

  // Validate debt payments value if present (zero is allowed — no existing debt).
  if (hasDebt && debtPayments! < 0) {
    result.debtPayments = 'Total monthly debt payments cannot be negative.';
  }

  return result;
}

/**
 * Validate the loan term in years.
 * Must be between 1 and maxTerm (default 40).
 *
 * @param term - The loan term in years
 * @param maxTerm - The maximum allowed term (defaults to 40)
 * @returns Error message string, or null if valid
 */
export function validateLoanTerm(
  term: number | undefined | null,
  maxTerm: number = 40
): string | null {
  if (term === undefined || term === null || isNaN(term)) {
    return 'Loan term is required.';
  }
  if (term < 1) {
    return 'Loan term must be at least 1 year.';
  }
  if (term > maxTerm) {
    return `Loan term cannot exceed ${maxTerm} years.`;
  }
  return null;
}

/**
 * Validate an optional non-negative monetary value (property tax, insurance).
 * If provided, it must be zero or positive.
 *
 * @param value - The value to validate
 * @param fieldName - The name of the field (for the error message)
 * @returns Error message string, or null if valid
 */
export function validateOptionalAmount(
  value: number | undefined | null,
  fieldName: string
): string | null {
  if (value === undefined || value === null) {
    return null; // Optional field, absence is fine.
  }
  if (isNaN(value)) {
    return `${fieldName} must be a number.`;
  }
  if (value < 0) {
    return `${fieldName} cannot be negative.`;
  }
  return null;
}

/**
 * Parse a string into a number, returning undefined if the string is
 * empty or not a valid number. This is used for form inputs that might
 * contain empty strings. Commas are stripped before parsing so that
 * comma-formatted monetary inputs (e.g. "20,000,000") work correctly.
 *
 * @param value - The string value from an input field
 * @returns The parsed number, or undefined if empty/invalid
 */
export function parseNumericInput(value: string): number | undefined {
  if (value === '' || value === undefined || value === null) {
    return undefined;
  }
  // Strip commas so comma-formatted values parse correctly.
  const cleaned = value.replace(/,/g, '');
  const num = Number(cleaned);
  if (isNaN(num)) {
    return undefined;
  }
  return num;
}
