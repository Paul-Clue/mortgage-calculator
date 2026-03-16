/* ==========================================================================
   App.tsx — Root Component & Router Configuration
   --------------------------------------------------------------------------
   Sets up Ionic React and defines all routes with lazy-loaded pages:
     /          → redirects to /home
     /home      → HomePage (bank list + generic calculator button)
     /bank/:id  → BankCalculatorPage (pre-filled with bank defaults)
     /bank/:id/info → BankInfoPage (rendered markdown)
     /generic   → GenericCalculatorPage (empty form)
   
   Uses React Router v6 (BrowserRouter + Routes) instead of
   @ionic/react-router, which only supports React Router v5.
   Ionic UI components (IonPage, IonContent, etc.) work fine without it.

   Pages are lazy-loaded via React.lazy() for better initial load performance.
   ========================================================================== */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { IonApp, IonSpinner, setupIonicReact } from '@ionic/react';
import ErrorBoundary from './components/ErrorBoundary';

/* ---- Lazy-loaded pages for code splitting ---- */
const HomePage = React.lazy(() => import('./pages/HomePage'));
const BankCalculatorPage = React.lazy(() => import('./pages/BankCalculatorPage'));
const GenericCalculatorPage = React.lazy(() => import('./pages/GenericCalculatorPage'));
const BankInfoPage = React.lazy(() => import('./pages/BankInfoPage'));

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode — always enabled for the dark fintech theme */
import '@ionic/react/css/palettes/dark.always.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

/**
 * A simple loading spinner shown while lazy-loaded pages are being fetched.
 */
const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <IonSpinner name="crescent" />
  </div>
);

const App: React.FC = () => (
  <IonApp>
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Home page — list of banks + generic calculator button */}
            <Route path="/home" element={<HomePage />} />

            {/* Bank-specific calculator — pre-filled with bank defaults */}
            <Route path="/bank/:bankId" element={<BankCalculatorPage />} />

            {/* Bank info page — rendered markdown content */}
            <Route path="/bank/:bankId/info" element={<BankInfoPage />} />

            {/* Generic calculator — all fields start empty */}
            <Route path="/generic" element={<GenericCalculatorPage />} />

            {/* Default redirect to home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </IonApp>
);

export default App;
