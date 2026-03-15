/* ==========================================================================
   Bank Configuration Data
   --------------------------------------------------------------------------
   Each bank object holds the default mortgage parameters used to pre-fill
   the calculator form. Values are sourced from the markdown files in /banks.
   ========================================================================== */

/**
 * Describes a bank's mortgage lending parameters.
 * Used by the calculator form to pre-populate defaults and enforce limits.
 */
export interface BankConfig {
  /** Unique slug used in routes and lookups (e.g. "jn-bank") */
  id: string;

  /** Display name shown in the UI */
  name: string;

  /** Available interest rate options the user can pick from (percent) */
  interestRates: number[];

  /** The rate pre-filled when the calculator loads (percent) */
  defaultRate: number;

  /** Maximum loan-to-value ratio the bank allows (percent, e.g. 90) */
  maxLTV: number;

  /** The LTV pre-filled when the calculator loads (percent) */
  defaultLTV: number;

  /** Maximum repayment period in years */
  maxTermYears: number;

  /** Borrower's age must not exceed this at loan maturity */
  maxAgeAtMaturity: number;

  /** Default total-debt-service ratio shown in the form (percent) */
  defaultTDSR: number;

  /** Filename of the bank's markdown info file in /banks (e.g. "jn-bank.md") */
  markdownFile: string;
}

/* --------------------------------------------------------------------------
   Bank configurations — one object per supported bank.
   The order here determines the order on the Home screen.
   -------------------------------------------------------------------------- */

export const banks: BankConfig[] = [
  {
    id: 'jn-bank',
    name: 'JN Bank',
    interestRates: [8.5, 9.5, 9.85, 10.0, 10.35, 10.5],
    defaultRate: 9.85,
    maxLTV: 90,
    defaultLTV: 90,
    maxTermYears: 40,
    maxAgeAtMaturity: 70,
    defaultTDSR: 40,
    markdownFile: 'jn-bank.md',
  },
  {
    id: 'vmbs',
    name: 'VMBS',
    interestRates: [8.25, 8.50],
    defaultRate: 8.50,
    maxLTV: 95,
    defaultLTV: 95,
    maxTermYears: 35,
    maxAgeAtMaturity: 70,
    defaultTDSR: 45,
    markdownFile: 'vmbs.md',
  },
  {
    id: 'sagicor',
    name: 'Sagicor',
    interestRates: [6.75, 8.0, 9.0, 10.0, 12.0],
    defaultRate: 9.0,
    maxLTV: 90,
    defaultLTV: 90,
    maxTermYears: 35,
    maxAgeAtMaturity: 70,
    defaultTDSR: 45,
    markdownFile: 'sagicor.md',
  },
  {
    id: 'scotiabank',
    name: 'Scotiabank',
    interestRates: [8.5, 9.5, 10.5, 12.49],
    defaultRate: 8.5,
    maxLTV: 90,
    defaultLTV: 90,
    maxTermYears: 30,
    maxAgeAtMaturity: 70,
    defaultTDSR: 40,
    markdownFile: 'scotiabank.md',
  },
  {
    id: 'ncb',
    name: 'NCB',
    interestRates: [8.0, 8.5, 9.0, 9.5],
    defaultRate: 8.5,
    maxLTV: 90,
    defaultLTV: 90,
    maxTermYears: 30,
    maxAgeAtMaturity: 70,
    defaultTDSR: 45,
    markdownFile: 'ncb.md',
  },
  {
    id: 'jmmb',
    name: 'JMMB',
    interestRates: [8.85],
    defaultRate: 8.85,
    maxLTV: 95,
    defaultLTV: 95,
    maxTermYears: 35,
    maxAgeAtMaturity: 65,
    defaultTDSR: 45,
    markdownFile: 'jmmb.md',
  },
  {
    id: 'first-caribbean',
    name: 'FirstCaribbean',
    interestRates: [7.0, 8.0, 9.0],
    defaultRate: 8.0,
    maxLTV: 95,
    defaultLTV: 95,
    maxTermYears: 35,
    maxAgeAtMaturity: 70,
    defaultTDSR: 42,
    markdownFile: 'first-caribbean.md',
  },
];

/**
 * Look up a single bank configuration by its ID slug.
 * Returns undefined if no bank matches.
 */
export function getBankById(id: string): BankConfig | undefined {
  return banks.find((bank) => bank.id === id);
}
