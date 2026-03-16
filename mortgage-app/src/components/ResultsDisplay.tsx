/* ==========================================================================
   ResultsDisplay Component
   --------------------------------------------------------------------------
   Renders the full mortgage calculation results including payment breakdown,
   totals, and optional property tax / insurance details.
   ========================================================================== */

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import { MortgageResult } from '../calculators/mortgage';
import { formatCurrency, formatDate } from '../utils/format';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  /** The mortgage calculation result to display */
  result: MortgageResult;
}

/**
 * Renders the mortgage calculation results in a clean card layout.
 * Shows the monthly payment, total costs, an optional housing breakdown,
 * and an optional TDSR eligibility section.
 */
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  // Determine whether to show the housing cost breakdown section.
  const showHousingBreakdown =
    result.monthlyPropertyTax > 0 || result.monthlyInsurance > 0;

  // Show the TDSR section only when salary + debt data was provided.
  const showTdsr = result.tdsrPercent !== undefined;

  return (
    <div className="results-display">
      {/* ---- Monthly Payment Card ---- */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Monthly Mortgage Payment</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p className="payment-amount">
            {formatCurrency(result.monthlyPayment)}
          </p>
        </IonCardContent>
      </IonCard>

      {/* ---- Housing Cost Breakdown (only shown if tax or insurance provided) ---- */}
      {showHousingBreakdown && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Monthly Housing Cost Breakdown</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Mortgage Payment</IonLabel>
                <IonLabel slot="end">{formatCurrency(result.monthlyPayment)}</IonLabel>
              </IonItem>
              {result.monthlyPropertyTax > 0 && (
                <IonItem>
                  <IonLabel>Property Tax</IonLabel>
                  <IonLabel slot="end">{formatCurrency(result.monthlyPropertyTax)}</IonLabel>
                </IonItem>
              )}
              {result.monthlyInsurance > 0 && (
                <IonItem>
                  <IonLabel>Insurance</IonLabel>
                  <IonLabel slot="end">{formatCurrency(result.monthlyInsurance)}</IonLabel>
                </IonItem>
              )}
              <IonItem lines="none">
                <IonLabel><strong>Total Monthly Cost</strong></IonLabel>
                <IonLabel slot="end">
                  <strong>{formatCurrency(result.totalMonthlyHousingCost)}</strong>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      )}

      {/* ---- Loan Summary Card ---- */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Loan Summary</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem>
              <IonLabel>Loan Amount</IonLabel>
              <IonLabel slot="end">{formatCurrency(result.loanAmount)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Down Payment</IonLabel>
              <IonLabel slot="end">{formatCurrency(result.downPayment)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Total Payments</IonLabel>
              <IonLabel slot="end">{result.totalPayments} months</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Total Interest Paid</IonLabel>
              <IonLabel slot="end">{formatCurrency(result.totalInterest)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Total Amount Paid</IonLabel>
              <IonLabel slot="end">{formatCurrency(result.totalAmountPaid)}</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Estimated Payoff Date</IonLabel>
              <IonLabel slot="end">{formatDate(result.payoffDate)}</IonLabel>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>

      {/* ---- Principal vs Interest Breakdown ---- */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Principal vs Interest</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem>
              <IonLabel>Principal</IonLabel>
              <IonLabel slot="end">{formatCurrency(result.loanAmount)}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Interest</IonLabel>
              <IonLabel slot="end">{formatCurrency(result.totalInterest)}</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Interest as % of Total</IonLabel>
              <IonLabel slot="end">
                {((result.totalInterest / result.totalAmountPaid) * 100).toFixed(1)}%
              </IonLabel>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>

      {/* ---- TDSR Eligibility (only shown when salary + debt were provided) ---- */}
      {showTdsr && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Debt Service Ratio (TDSR)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Your TDSR</IonLabel>
                <IonLabel slot="end">{result.tdsrPercent!.toFixed(1)}%</IonLabel>
              </IonItem>

              {/* TDSR limit, max allowed debt, and eligibility fields. */}
              {result.bankTdsrLimitPercent !== undefined && (
                <>
                  <IonItem>
                    <IonLabel>TDSR Limit</IonLabel>
                    <IonLabel slot="end">{result.bankTdsrLimitPercent}%</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Max Allowed Monthly Debt</IonLabel>
                    <IonLabel slot="end">
                      {formatCurrency(result.maxAllowedMonthlyDebt!)}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel><strong>Eligibility</strong></IonLabel>
                    <IonLabel
                      slot="end"
                      color={result.isEligible ? 'success' : 'danger'}
                    >
                      <strong>{result.isEligible ? 'Eligible' : 'Not Eligible'}</strong>
                    </IonLabel>
                  </IonItem>
                </>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>
      )}
    </div>
  );
};

export default ResultsDisplay;
