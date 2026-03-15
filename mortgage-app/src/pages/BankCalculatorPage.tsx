/* ==========================================================================
   BankCalculatorPage
   --------------------------------------------------------------------------
   Displays the mortgage form pre-filled with a specific bank's defaults.
   The bank ID comes from the URL parameter (:bankId). Includes a "View
   Bank Details" link and navigation buttons (back + home).
   ========================================================================== */

import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
} from '@ionic/react';
import { getBankById } from '../data/banks';
import { MortgageInput, calculateMortgage, MortgageResult } from '../calculators/mortgage';
import MortgageForm from '../components/MortgageForm';
import ResultsDisplay from '../components/ResultsDisplay';

/**
 * Bank calculator page. Fetches bank config from the URL param and passes
 * it to MortgageForm for pre-population.
 */
const BankCalculatorPage: React.FC = () => {
  const { bankId } = useParams<{ bankId: string }>();
  const history = useHistory();
  const bank = getBankById(bankId);

  // Holds the calculation result after the form is submitted.
  const [result, setResult] = useState<MortgageResult | null>(null);

  // If the bank ID is invalid, show a message.
  if (!bank) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
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
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{bank.name} Calculator</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/')}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Link to the bank's info page. */}
        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <IonButton
            fill="outline"
            size="small"
            onClick={() => history.push(`/bank/${bankId}/info`)}
          >
            View Bank Details
          </IonButton>
        </div>

        {/* The mortgage input form, pre-filled with this bank's defaults. */}
        <MortgageForm bank={bank} onCalculate={handleCalculate} />

        {/* Results appear below the form after calculation. */}
        {result && <ResultsDisplay result={result} />}
      </IonContent>
    </IonPage>
  );
};

export default BankCalculatorPage;
