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
  // IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  IonText,
  IonNote,
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

interface MortgageFormProps {
  /** Bank configuration (null for the generic calculator) */
  bank: BankConfig | null;

  /** Called when the user submits a valid form */
  onCalculate: (input: MortgageInput) => void;
}

/**
 * The main mortgage input form. Pre-fills fields from the bank config
 * if provided, otherwise starts empty for the generic calculator.
 */
const MortgageForm: React.FC<MortgageFormProps> = ({ bank, onCalculate }) => {
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
      bankTdsrLimit: bank ? bank.defaultTDSR / 100 : undefined,
    };

    onCalculate(input);
  };

  return (
    <IonList>
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
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.age}</p>
        </IonText>
      )}

      {/* ---- Property Price ---- */}
      <IonItem>
        <IonInput
          label="Price of Home or Land (JMD)"
          labelPlacement="stacked"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 20000000"
          value={propertyPrice}
          onIonInput={(e) => setPropertyPrice(e.detail.value ?? '')}
          required
        />
      </IonItem>
      {errors.propertyPrice && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.propertyPrice}</p>
        </IonText>
      )}

      {/* ---- Interest Rate (always shown so user can type a value) ---- */}
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
      {/* Show rate dropdown only when a bank provides rate options. */}
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
      {errors.interestRate && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.interestRate}</p>
        </IonText>
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
        <IonNote style={{ paddingLeft: 16, fontSize: '0.8rem' }}>
          Max LTV for {bank.name}: {bank.maxLTV}%
        </IonNote>
      )}
      {errors.ltv && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.ltv}</p>
        </IonText>
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
      {bank && (
        <IonNote style={{ paddingLeft: 16, fontSize: '0.8rem' }}>
          Max term for {bank.name}: {bank.maxTermYears} years
          (maturity age: {bank.maxAgeAtMaturity})
        </IonNote>
      )}
      {errors.loanTerm && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.loanTerm}</p>
        </IonText>
      )}

      {/* ---- Optional: Monthly Salary (paired with debt payments) ---- */}
      <IonItem>
        <IonInput
          label="Gross Monthly Salary (JMD, optional)"
          labelPlacement="stacked"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 300000"
          value={monthlySalary}
          onIonInput={(e) => setMonthlySalary(e.detail.value ?? '')}
        />
      </IonItem>
      {errors.monthlySalary && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.monthlySalary}</p>
        </IonText>
      )}

      {/* ---- Optional: Total Monthly Debt Payments (paired with salary) ---- */}
      <IonNote style={{ paddingLeft: 16, fontSize: '0.8rem' }}>
        Include all existing loan and credit card payments (excluding this mortgage).
        Fill in both salary and debt to see your TDSR eligibility.
      </IonNote>
      <IonItem>
        <IonInput
          label="Total Monthly Debt Payments (JMD, optional)"
          labelPlacement="stacked"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 50000"
          value={totalMonthlyDebt}
          onIonInput={(e) => setTotalMonthlyDebt(e.detail.value ?? '')}
        />
      </IonItem>
      {errors.totalMonthlyDebt && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.totalMonthlyDebt}</p>
        </IonText>
      )}

      {/* ---- Optional: Annual Property Tax ---- */}
      <IonItem>
        <IonInput
          label="Annual Property Tax (JMD, optional)"
          labelPlacement="stacked"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 50000"
          value={annualPropertyTax}
          onIonInput={(e) => setAnnualPropertyTax(e.detail.value ?? '')}
        />
      </IonItem>
      {errors.annualPropertyTax && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.annualPropertyTax}</p>
        </IonText>
      )}

      {/* ---- Optional: Annual Insurance ---- */}
      <IonItem>
        <IonInput
          label="Annual Home Insurance (JMD, optional)"
          labelPlacement="stacked"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 75000"
          value={annualInsurance}
          onIonInput={(e) => setAnnualInsurance(e.detail.value ?? '')}
        />
      </IonItem>
      {errors.annualInsurance && (
        <IonText color="danger" style={{ paddingLeft: 16, fontSize: '0.85rem' }}>
          <p>{errors.annualInsurance}</p>
        </IonText>
      )}

      {/* ---- Submit Button ---- */}
      <div style={{ padding: '16px' }}>
        <IonButton expand="block" color="primary" onClick={handleSubmit}>
          Calculate Mortgage
        </IonButton>
      </div>
    </IonList>
  );
};

export default MortgageForm;
