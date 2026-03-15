/* ==========================================================================
   HomePage
   --------------------------------------------------------------------------
   The landing screen of the app. Displays a grid of bank buttons and a
   separate "Generic Calculator" button at the bottom. Tapping a bank
   navigates to /bank/:bankId; tapping Generic goes to /generic.
   ========================================================================== */

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { banks } from '../data/banks';
import BankButton from '../components/BankButton';
import './HomePage.css';

/**
 * Home page listing all available banks and the generic calculator option.
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mortgage Calculator</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Brief instruction for the user. */}
        <p style={{ textAlign: 'center', marginBottom: 16, color: 'var(--ion-color-medium)' }}>
          Select a bank to calculate with their rates, or use the generic calculator.
        </p>

        {/* Bank buttons — one per configured bank. */}
        <div className="bank-buttons-container">
          {banks.map((bank) => (
            <BankButton key={bank.id} bankId={bank.id} bankName={bank.name} />
          ))}
        </div>

        {/* Generic calculator button — styled differently to stand out. */}
        <div style={{ marginTop: 24 }}>
          <IonButton
            expand="block"
            color="primary"
            onClick={() => navigate('/generic')}
            style={{ minHeight: '52px', fontSize: '1rem' }}
          >
            Generic Mortgage Calculator
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
