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

/** Map of bank IDs to their logo image paths in /public/logos/. */
const bankLogos: Record<string, string> = {
  'first-caribbean': '/logos/firstcaribeanBank-logo.png',
  'jmmb': '/logos/JMMB-Republica-Dominicana-.webp',
  'jn-bank': '/logos/jnBank-logo.png',
  'ncb': '/logos/ncb-logo.png',
  'scotiabank': '/logos/scotiaBank-logo.png',
  'vmbs': '/logos/VMG_logo_2362x1233.png',
  'sagicor': '/logos/sagicorBank-logo.png',
};

/**
 * Home page listing all available banks and the generic calculator option.
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <img
              src="/logos/company-logo.jpeg"
              alt="Mortgage Calculator"
              style={{ height: '110px', objectFit: 'contain', verticalAlign: 'middle' }}
            />
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Welcome header matching the dark fintech reference design. */}
        <div className="home-header">
          <h1>Mortgage Calculator</h1>
          <p>Select a bank or use the generic calculator.</p>
        </div>

        {/* Generic calculator button — blue accent to stand out. */}
        <div className="generic-calc-container">
          <IonButton
            expand="block"
            color="primary"
            onClick={() => navigate('/generic')}
            style={{ minHeight: '56px', fontSize: '1rem', fontWeight: 600 }}
          >
            Generic Mortgage Calculator
          </IonButton>
        </div>

        {/* Bank buttons — one per configured bank. */}
        <div className="bank-buttons-container">
          {banks.map((bank) => (
            <BankButton
              key={bank.id}
              bankId={bank.id}
              bankName={bank.name}
              logoSrc={bankLogos[bank.id]}
            />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
