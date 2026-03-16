/* ==========================================================================
   MortgageForm Component
   --------------------------------------------------------------------------
   Shared form used by both the Bank Calculator and Generic Calculator pages.
   Handles all mortgage inputs with validation and pre-population from bank
   defaults when available.
   ========================================================================== */

import { useState, useEffect } from 'react';
import {
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
} from '@ionic/react';
import { BankConfig } from '../data/banks';
import { MortgageInput } from '../calculators/mortgage';
import { calculateMaxTerm } from '../calculators/mortgage';
import {
  validateAge,
  validatePropertyPrice,
  validateInterestRate,
  validateLTV,
  validateLoanTerm,
  validateOptionalAmount,
  validateSalaryDebtPair,
  parseNumericInput,
} from '../utils/validation';
import './MortgageForm.css';

interface MortgageFormProps {
  /** Bank configuration (null for the generic calculator) */
  bank: BankConfig | null;

  /** Called when the user submits a valid form */
  onCalculate: (input: MortgageInput) => void;

  /** Called when the user resets the form (so the parent can clear results) */
  onReset?: () => void;
}

/**
 * The main mortgage input form. Pre-fills fields from the bank config
 * if provided, otherwise starts empty for the generic calculator.
 */
const MortgageForm: React.FC<MortgageFormProps> = ({ bank, onCalculate, onReset }) => {
  /* ---- Form state ---- */
  const [age, setAge] = useState<string>('');
  const [propertyPrice, setPropertyPrice] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [ltv, setLtv] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [monthlySalary, setMonthlySalary] = useState<string>('');
  const [totalMonthlyDebt, setTotalMonthlyDebt] = useState<string>('');
  const [annualPropertyTax, setAnnualPropertyTax] = useState<string>('');
  const [annualInsurance, setAnnualInsurance] = useState<string>('');

  /* ---- Validation error messages ---- */
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  /**
   * Format a raw numeric string with commas for display (e.g. "20000000" → "20,000,000").
   * Handles decimals by only formatting the integer part. Returns empty string for empty input.
   */
  const addCommas = (value: string): string => {
    if (!value) return '';
    const [integerPart, decimalPart] = value.split('.');
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart !== undefined ? `${formatted}.${decimalPart}` : formatted;
  };

  /**
   * Handle input for monetary fields. Strips everything except digits and
   * a single decimal point, then stores the clean numeric string in state.
   * The display value is formatted with commas via addCommas().
   */
  const handleMoneyInput = (
    rawValue: string | null | undefined,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = rawValue ?? '';
    // Strip commas and any non-numeric characters except digits and decimal point.
    const cleaned = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points — keep only the first one.
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2
      ? parts[0] + '.' + parts.slice(1).join('')
      : cleaned;
    setter(sanitized);
  };

  /**
   * Prevent non-numeric characters from being typed into monetary fields.
   * Attached as an onKeyDown handler. Allows digits, decimal point, Backspace,
   * Delete, Tab, arrow keys, and common keyboard shortcuts (Ctrl/Cmd+A/C/V/X).
   */
  const blockNonNumericKeys = (e: React.KeyboardEvent) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
      'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter',
    ];
    if (allowedKeys.includes(e.key)) return;
    // Allow Ctrl/Cmd shortcuts (select all, copy, paste, cut).
    if (e.ctrlKey || e.metaKey) return;
    // Allow digits and a single decimal point.
    if (/^[0-9.]$/.test(e.key)) return;
    // Block everything else.
    e.preventDefault();
  };

  /* ---- Pre-fill from bank defaults when a bank is selected ---- */
  useEffect(() => {
    if (bank) {
      setInterestRate(String(bank.defaultRate));
      setLtv(String(bank.defaultLTV));
      // Loan term defaults to bank max; gets recalculated when age changes.
      setLoanTerm(String(bank.maxTermYears));
    }
  }, [bank]);

  /* ---- Recalculate the default loan term when age changes ---- */
  useEffect(() => {
    if (!bank) return;

    const parsedAge = parseNumericInput(age);
    const maxTerm = calculateMaxTerm(
      bank.maxTermYears,
      bank.maxAgeAtMaturity,
      parsedAge
    );

    // Only update if the current term exceeds the new max.
    const currentTerm = parseNumericInput(loanTerm);
    if (currentTerm === undefined || currentTerm > maxTerm) {
      setLoanTerm(String(maxTerm));
    }
  }, [age, bank]);

  /**
   * Validate all form fields and return true if everything is valid.
   * Sets error messages for any invalid fields.
   */
  const validateForm = (): boolean => {
    const parsedAge = parseNumericInput(age);
    const parsedPrice = parseNumericInput(propertyPrice);
    const parsedRate = parseNumericInput(interestRate);
    const parsedLtv = parseNumericInput(ltv);
    const parsedTerm = parseNumericInput(loanTerm);
    const parsedSalary = parseNumericInput(monthlySalary);
    const parsedDebt = parseNumericInput(totalMonthlyDebt);
    const parsedTax = parseNumericInput(annualPropertyTax);
    const parsedInsurance = parseNumericInput(annualInsurance);

    // Calculate max term for validation.
    const maxTerm = bank
      ? calculateMaxTerm(bank.maxTermYears, bank.maxAgeAtMaturity, parsedAge)
      : 40;

    // Validate salary and debt as a linked pair.
    const salaryDebtErrors = validateSalaryDebtPair(parsedSalary, parsedDebt);

    const newErrors: Record<string, string | null> = {
      age: validateAge(parsedAge),
      propertyPrice: validatePropertyPrice(parsedPrice),
      interestRate: validateInterestRate(parsedRate),
      ltv: validateLTV(parsedLtv),
      loanTerm: validateLoanTerm(parsedTerm, maxTerm),
      monthlySalary: salaryDebtErrors.salary,
      totalMonthlyDebt: salaryDebtErrors.debtPayments,
      annualPropertyTax: validateOptionalAmount(parsedTax, 'Annual property tax'),
      annualInsurance: validateOptionalAmount(parsedInsurance, 'Annual insurance'),
    };

    setErrors(newErrors);

    // Form is valid when there are no error messages.
    return Object.values(newErrors).every((err) => err === null);
  };

  /**
   * Handle form submission. Validates inputs, then calls onCalculate
   * with the parsed MortgageInput.
   */
  const handleSubmit = () => {
    if (!validateForm()) return;

    const input: MortgageInput = {
      propertyPrice: parseNumericInput(propertyPrice)!,
      ltvPercent: parseNumericInput(ltv)!,
      annualInterestRate: parseNumericInput(interestRate)!,
      termYears: parseNumericInput(loanTerm)!,
      annualPropertyTax: parseNumericInput(annualPropertyTax),
      annualInsurance: parseNumericInput(annualInsurance),
      monthlySalary: parseNumericInput(monthlySalary),
      totalMonthlyDebtPayments: parseNumericInput(totalMonthlyDebt),
      // Pass the bank's TDSR limit as a decimal (e.g. 40 → 0.40).
      // Generic calculator uses 40% as a standard industry benchmark.
      bankTdsrLimit: bank ? bank.defaultTDSR / 100 : 0.40,
    };

    onCalculate(input);
  };

  /**
   * Reset the form to its initial state. For bank calculators, this restores
   * the bank's default values (rate, LTV, term). For the generic calculator,
   * all fields are cleared to empty strings. Also clears validation errors
   * and notifies the parent to clear any displayed results.
   */
  const handleReset = () => {
    // Clear all user-entered fields.
    setAge('');
    setPropertyPrice('');
    setMonthlySalary('');
    setTotalMonthlyDebt('');
    setAnnualPropertyTax('');
    setAnnualInsurance('');

    // For bank calculators, restore bank defaults. For generic, clear everything.
    if (bank) {
      setInterestRate(String(bank.defaultRate));
      setLtv(String(bank.defaultLTV));
      setLoanTerm(String(bank.maxTermYears));
    } else {
      setInterestRate('');
      setLtv('');
      setLoanTerm('');
    }

    // Clear all validation errors.
    setErrors({});

    // Notify the parent to clear any displayed calculation results.
    if (onReset) {
      onReset();
    }
  };

  return (
    <IonList className="mortgage-form">
      {/* ---- Age (optional) ---- */}
      <IonItem>
        <IonInput
          label="Age (optional)"
          labelPlacement="stacked"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 30"
          value={age}
          onIonInput={(e) => setAge(e.detail.value ?? '')}
        />
      </IonItem>
      {errors.age && (
        <div className="form-error"><p>{errors.age}</p></div>
      )}

      {/* ---- Property Price ---- */}
      <IonItem>
        <IonInput
          label="Price of Home or Land (JMD)"
          labelPlacement="stacked"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 20,000,000"
          value={addCommas(propertyPrice)}
          onIonInput={(e) => handleMoneyInput(e.detail.value, setPropertyPrice)}
          onKeyDown={blockNonNumericKeys}
          required
        />
      </IonItem>
      {errors.propertyPrice && (
        <div className="form-error"><p>{errors.propertyPrice}</p></div>
      )}

      {/* ---- Interest Rate ---- */}
      {/* Bank calculator: show a dropdown with the bank's available rates. */}
      {bank && bank.interestRates.length > 0 && (
        <IonItem>
          <IonSelect
            label="Select Rate"
            labelPlacement="stacked"
            value={parseNumericInput(interestRate)}
            onIonChange={(e) => setInterestRate(String(e.detail.value))}
          >
            {bank.interestRates.map((rate) => (
              <IonSelectOption key={rate} value={rate}>
                {rate}%
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      )}
      {/* Generic calculator: show a text input so the user can type any rate. */}
      {!bank && (
        <IonItem>
          <IonInput
            label="Interest Rate (%)"
            labelPlacement="stacked"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 9.85"
            value={interestRate}
            onIonInput={(e) => setInterestRate(e.detail.value ?? '')}
            required
          />
        </IonItem>
      )}
      {errors.interestRate && (
        <div className="form-error"><p>{errors.interestRate}</p></div>
      )}

      {/* ---- Loan-to-Value ---- */}
      <IonItem>
        <IonInput
          label="Loan Amount (% of Property Price)"
          labelPlacement="stacked"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 90"
          value={ltv}
          onIonInput={(e) => setLtv(e.detail.value ?? '')}
          required
        />
      </IonItem>
      {bank && (
        <>
          <span className="form-note">
            Max LTV for {bank.name}: {bank.maxLTV}%
          </span>
          <span className="form-note">
            Max term for {bank.name}: {bank.maxTermYears} years
            (maturity age: {bank.maxAgeAtMaturity})
          </span>
        </>
      )}
      {errors.ltv && (
        <div className="form-error"><p>{errors.ltv}</p></div>
      )}

      {/* ---- Loan Term ---- */}
      <IonItem>
        <IonInput
          label="Loan Term (years)"
          labelPlacement="stacked"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 30"
          value={loanTerm}
          onIonInput={(e) => setLoanTerm(e.detail.value ?? '')}
          required
        />
      </IonItem>
      {errors.loanTerm && (
        <div className="form-error"><p>{errors.loanTerm}</p></div>
      )}

      {/* ---- Optional: Monthly Salary (paired with debt payments) ---- */}
      <IonItem>
        <IonInput
          label="Gross Monthly Salary (JMD, optional)"
          labelPlacement="stacked"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 300,000"
          value={addCommas(monthlySalary)}
          onIonInput={(e) => handleMoneyInput(e.detail.value, setMonthlySalary)}
          onKeyDown={blockNonNumericKeys}
        />
      </IonItem>
      {errors.monthlySalary && (
        <div className="form-error"><p>{errors.monthlySalary}</p></div>
      )}

      {/* ---- Optional: Total Monthly Debt Payments (paired with salary) ---- */}
      <span className="form-note">
        Include all existing loan and credit card payments (excluding this mortgage).
        Fill in both salary and debt to see your TDSR eligibility.
      </span>
      <IonItem>
        <IonInput
          label="Total Monthly Debt Payments (JMD, optional)"
          labelPlacement="stacked"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 50,000"
          value={addCommas(totalMonthlyDebt)}
          onIonInput={(e) => handleMoneyInput(e.detail.value, setTotalMonthlyDebt)}
          onKeyDown={blockNonNumericKeys}
        />
      </IonItem>
      {errors.totalMonthlyDebt && (
        <div className="form-error"><p>{errors.totalMonthlyDebt}</p></div>
      )}

      {/* ---- Optional: Annual Property Tax ---- */}
      <IonItem>
        <IonInput
          label="Annual Property Tax (JMD, optional)"
          labelPlacement="stacked"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 50,000"
          value={addCommas(annualPropertyTax)}
          onIonInput={(e) => handleMoneyInput(e.detail.value, setAnnualPropertyTax)}
          onKeyDown={blockNonNumericKeys}
        />
      </IonItem>
      {errors.annualPropertyTax && (
        <div className="form-error"><p>{errors.annualPropertyTax}</p></div>
      )}

      {/* ---- Optional: Annual Insurance ---- */}
      <IonItem>
        <IonInput
          label="Annual Home Insurance (JMD, optional)"
          labelPlacement="stacked"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 75,000"
          value={addCommas(annualInsurance)}
          onIonInput={(e) => handleMoneyInput(e.detail.value, setAnnualInsurance)}
          onKeyDown={blockNonNumericKeys}
        />
      </IonItem>
      {errors.annualInsurance && (
        <div className="form-error"><p>{errors.annualInsurance}</p></div>
      )}

      {/* ---- Submit and Reset Buttons ---- */}
      <div className="form-buttons">
        <IonButton expand="block" className="calc-button" onClick={handleSubmit}>
          Calculate Mortgage
        </IonButton>
        <IonButton expand="block" fill="outline" className="clear-button" onClick={handleReset}>
          Clear
        </IonButton>
      </div>
    </IonList>
  );
};

export default MortgageForm;
