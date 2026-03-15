/* ==========================================================================
   GenericCalculatorPage
   --------------------------------------------------------------------------
   A mortgage calculator not tied to any specific bank. All fields start
   empty and the user must fill in their own values.
   ========================================================================== */

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { MortgageInput, calculateMortgage, MortgageResult } from '../calculators/mortgage';
import MortgageForm from '../components/MortgageForm';
import ResultsDisplay from '../components/ResultsDisplay';

/**
 * Generic calculator page — no bank defaults. The user enters all values.
 */
const GenericCalculatorPage: React.FC = () => {
  const history = useHistory();

  // Holds the calculation result after form submission.
  const [result, setResult] = useState<MortgageResult | null>(null);

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
          <IonTitle>Generic Calculator</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/')}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Pass null for bank so the form starts with empty fields. */}
        <MortgageForm bank={null} onCalculate={handleCalculate} />

        {/* Results appear below the form after calculation. */}
        {result && <ResultsDisplay result={result} />}
      </IonContent>
    </IonPage>
  );
};

export default GenericCalculatorPage;
