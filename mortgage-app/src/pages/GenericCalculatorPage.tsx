/* ==========================================================================
   GenericCalculatorPage
   --------------------------------------------------------------------------
   A mortgage calculator not tied to any specific bank. All fields start
   empty and the user must fill in their own values.
   ========================================================================== */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { MortgageInput, calculateMortgage, MortgageResult } from '../calculators/mortgage';
import MortgageForm from '../components/MortgageForm';
import ResultsDisplay from '../components/ResultsDisplay';
import BackButton from '../components/BackButton';

/**
 * Generic calculator page — no bank defaults. The user enters all values.
 */
const GenericCalculatorPage: React.FC = () => {
  const navigate = useNavigate();

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
            <BackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Generic Calculator</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => navigate('/')}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Pass null for bank so the form starts with empty fields. */}
        <MortgageForm bank={null} onCalculate={handleCalculate} onReset={() => setResult(null)} />

        {/* Results appear below the form after calculation. */}
        {result && <ResultsDisplay result={result} />}
      </IonContent>
    </IonPage>
  );
};

export default GenericCalculatorPage;
