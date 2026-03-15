/* ==========================================================================
   Mortgage Calculator — Core Amortization Logic
   --------------------------------------------------------------------------
   Implements the standard amortization formula:
     M = P * [r(1+r)^n] / [(1+r)^n - 1]
   Where:
     M = monthly payment
     P = loan principal
     r = monthly interest rate (annual rate / 12 / 100)
     n = total number of monthly payments (term in years * 12)
   ========================================================================== */

/**
 * Input parameters for the mortgage calculation.
 */
export interface MortgageInput {
  /** Total property price in JMD */
  propertyPrice: number;

  /** Loan-to-value ratio as a percentage (e.g. 90 means 90%) */
  ltvPercent: number;

  /** Annual interest rate as a percentage (e.g. 9.85 means 9.85%) */
  annualInterestRate: number;

  /** Loan term in years */
  termYears: number;

  /** Annual property tax in JMD (optional, defaults to 0) */
  annualPropertyTax?: number;

  /** Annual home insurance in JMD (optional, defaults to 0) */
  annualInsurance?: number;

  /** Borrower's gross monthly salary in JMD (optional, for TDSR calculation) */
  monthlySalary?: number;

  /** Borrower's total existing monthly debt payments in JMD (optional, for TDSR) */
  totalMonthlyDebtPayments?: number;

  /** The bank's TDSR limit as a decimal (e.g. 0.40 for 40%). Optional. */
  bankTdsrLimit?: number;
}

/**
 * Output from the mortgage calculation.
 * All monetary values are in JMD.
 */
export interface MortgageResult {
  /** The loan principal (propertyPrice * ltvPercent / 100) */
  loanAmount: number;

  /** Monthly mortgage payment (principal + interest only) */
  monthlyPayment: number;

  /** Monthly property tax (annualPropertyTax / 12) */
  monthlyPropertyTax: number;

  /** Monthly insurance (annualInsurance / 12) */
  monthlyInsurance: number;

  /** Total monthly housing cost (mortgage + tax + insurance) */
  totalMonthlyHousingCost: number;

  /** Total number of monthly payments */
  totalPayments: number;

  /** Total interest paid over the life of the loan */
  totalInterest: number;

  /** Total amount paid (principal + interest) */
  totalAmountPaid: number;

  /** Estimated payoff date */
  payoffDate: Date;

  /** Down payment amount */
  downPayment: number;

  /* ---- TDSR fields (only present when salary + debt data was provided) ---- */

  /** The borrower's calculated TDSR percentage (e.g. 38.5 means 38.5%) */
  tdsrPercent?: number;

  /** The bank's TDSR limit as a percentage (e.g. 40 means 40%) */
  bankTdsrLimitPercent?: number;

  /** Maximum allowed total monthly debt based on salary × bank TDSR limit */
  maxAllowedMonthlyDebt?: number;

  /** Whether the borrower is eligible (their TDSR is within the bank's limit) */
  isEligible?: boolean;
}

/**
 * Calculate monthly mortgage payment using the standard amortization formula.
 *
 * Edge case: if the interest rate is 0, the monthly payment is simply
 * the principal divided by the number of months (no interest component).
 *
 * @param principal - The loan amount in JMD
 * @param annualRate - The annual interest rate as a percentage (e.g. 9.85)
 * @param termYears - The loan term in years
 * @returns The monthly payment amount in JMD
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  const totalMonths = termYears * 12;

  // Handle edge case: 0% interest rate means no interest component.
  if (annualRate === 0) {
    return principal / totalMonths;
  }

  // Convert annual percentage rate to monthly decimal rate.
  const monthlyRate = annualRate / 100 / 12;

  // Standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const payment = principal * (monthlyRate * factor) / (factor - 1);

  return payment;
}

/**
 * Run a full mortgage calculation and return all result fields.
 *
 * This is the main entry point for the calculator. It computes the loan
 * amount from the property price and LTV, runs the amortization formula,
 * and assembles the complete results object.
 *
 * @param input - The mortgage input parameters
 * @returns A MortgageResult with all computed values
 */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  // Derive the loan principal from property price and LTV percentage.
  const loanAmount = input.propertyPrice * (input.ltvPercent / 100);
  const downPayment = input.propertyPrice - loanAmount;

  // Calculate the core monthly mortgage payment.
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    input.annualInterestRate,
    input.termYears
  );

  // Total number of monthly payments over the loan's lifetime.
  const totalPayments = input.termYears * 12;

  // Total amount paid = monthly payment * number of payments.
  const totalAmountPaid = monthlyPayment * totalPayments;

  // Total interest is the difference between total paid and the principal.
  const totalInterest = totalAmountPaid - loanAmount;

  // Calculate optional monthly extras (tax and insurance).
  const monthlyPropertyTax = (input.annualPropertyTax ?? 0) / 12;
  const monthlyInsurance = (input.annualInsurance ?? 0) / 12;

  // Total monthly housing cost includes mortgage + tax + insurance.
  const totalMonthlyHousingCost =
    monthlyPayment + monthlyPropertyTax + monthlyInsurance;

  // Payoff date is today + termYears * 12 months.
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + totalPayments);

  // Build the base result object.
  const result: MortgageResult = {
    loanAmount,
    monthlyPayment,
    monthlyPropertyTax,
    monthlyInsurance,
    totalMonthlyHousingCost,
    totalPayments,
    totalInterest,
    totalAmountPaid,
    payoffDate,
    downPayment,
  };

  // Calculate TDSR fields only when salary and debt data are both provided.
  // TDSR includes the new mortgage payment + tax + insurance on top of existing debt,
  // because banks evaluate whether the borrower can handle ALL obligations combined.
  if (input.monthlySalary && input.totalMonthlyDebtPayments !== undefined) {
    // Total monthly obligations = existing debt + new housing costs.
    const totalMonthlyObligations =
      input.totalMonthlyDebtPayments + totalMonthlyHousingCost;

    // TDSR = total monthly obligations / gross monthly income.
    const tdsrDecimal = totalMonthlyObligations / input.monthlySalary;
    result.tdsrPercent = tdsrDecimal * 100;

    // If a bank TDSR limit was provided, compute eligibility.
    if (input.bankTdsrLimit !== undefined) {
      result.bankTdsrLimitPercent = input.bankTdsrLimit * 100;
      result.maxAllowedMonthlyDebt = input.monthlySalary * input.bankTdsrLimit;
      result.isEligible = tdsrDecimal <= input.bankTdsrLimit;
    }
  }

  return result;
}

/**
 * Calculate the maximum loan term based on the borrower's age and the
 * bank's constraints (maxTermYears and maxAgeAtMaturity).
 *
 * If no age is provided, returns the bank's maxTermYears.
 *
 * @param maxTermYears - The bank's maximum allowed term in years
 * @param maxAgeAtMaturity - The bank's maximum age at loan maturity
 * @param borrowerAge - The borrower's current age (optional)
 * @returns The maximum allowed term in years
 */
export function calculateMaxTerm(
  maxTermYears: number,
  maxAgeAtMaturity: number,
  borrowerAge?: number
): number {
  // If no age is given, default to the bank's max term.
  if (borrowerAge === undefined || borrowerAge === null) {
    return maxTermYears;
  }

  // Term limited by either the bank's max or remaining years before age limit.
  const yearsUntilMaxAge = maxAgeAtMaturity - borrowerAge;
  return Math.min(maxTermYears, yearsUntilMaxAge);
}
