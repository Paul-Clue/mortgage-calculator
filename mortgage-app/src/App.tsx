/* ==========================================================================
   App.tsx — Root Component & Router Configuration
   --------------------------------------------------------------------------
   Sets up Ionic React and defines all routes with lazy-loaded pages:
     /          → redirects to /home
     /home      → HomePage (bank list + generic calculator button)
     /bank/:id  → BankCalculatorPage (pre-filled with bank defaults)
     /bank/:id/info → BankInfoPage (rendered markdown)
     /generic   → GenericCalculatorPage (empty form)
   
   Pages are lazy-loaded via React.lazy() for better initial load performance.
   ========================================================================== */

import React, { Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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

/* Dark mode — auto-detected from OS preference */
import '@ionic/react/css/palettes/dark.system.css';

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
    <IonReactRouter>
      <IonRouterOutlet>
        <Suspense fallback={<PageLoader />}>
          {/* Home page — list of banks + generic calculator button */}
          <Route exact path="/home">
            <HomePage />
          </Route>

          {/* Bank-specific calculator — pre-filled with bank defaults */}
          <Route exact path="/bank/:bankId">
            <BankCalculatorPage />
          </Route>

          {/* Bank info page — rendered markdown content */}
          <Route exact path="/bank/:bankId/info">
            <BankInfoPage />
          </Route>

          {/* Generic calculator — all fields start empty */}
          <Route exact path="/generic">
            <GenericCalculatorPage />
          </Route>

          {/* Default redirect to home */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </Suspense>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
