/* ==========================================================================
   BankCalculatorPage
   --------------------------------------------------------------------------
   Displays the mortgage form pre-filled with a specific bank's defaults.
   The bank ID comes from the URL parameter (:bankId). Includes a "View
   Bank Details" link and navigation buttons (back + home).
   ========================================================================== */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { getBankById } from '../data/banks';
import { MortgageInput, calculateMortgage, MortgageResult } from '../calculators/mortgage';
import MortgageForm from '../components/MortgageForm';
import ResultsDisplay from '../components/ResultsDisplay';
import BackButton from '../components/BackButton';

/**
 * Bank calculator page. Fetches bank config from the URL param and passes
 * it to MortgageForm for pre-population.
 */
const BankCalculatorPage: React.FC = () => {
  const { bankId } = useParams<{ bankId: string }>();
  const navigate = useNavigate();
  const bank = getBankById(bankId!);

  // Holds the calculation result after the form is submitted.
  const [result, setResult] = useState<MortgageResult | null>(null);

  // If the bank ID is invalid, show a message.
  if (!bank) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Bank Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>The selected bank could not be found.</p>
        </IonContent>
      </IonPage>
    );
  }

  /** Run the mortgage calculation and store the result. */
  const handleCalculate = (input: MortgageInput) => {
    const calcResult = calculateMortgage(input);
    setResult(calcResult);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{bank.name} Calculator</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => navigate('/')}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Link to the bank's info page. */}
        <div style={{ textAlign: 'right', marginBottom: 12 }}>
          <IonButton
            fill="outline"
            size="small"
            onClick={() => navigate(`/bank/${bankId}/info`)}
            style={{ '--border-color': 'var(--app-border)', '--color': 'var(--app-text-secondary)' } as React.CSSProperties}
          >
            View Bank Details
          </IonButton>
        </div>

        {/* The mortgage input form, pre-filled with this bank's defaults. */}
        <MortgageForm bank={bank} onCalculate={handleCalculate} onReset={() => setResult(null)} />

        {/* Results appear below the form after calculation. */}
        {result && <ResultsDisplay result={result} />}
      </IonContent>
    </IonPage>
  );
};

export default BankCalculatorPage;
