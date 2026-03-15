/* ==========================================================================
   BackButton Component
   --------------------------------------------------------------------------
   A simple back navigation button that replaces IonBackButton.
   Uses React Router v6's useNavigate(-1) to go back in history.
   Falls back to a provided href if there is no history to go back to.
   ========================================================================== */

import { IonButton, IonIcon } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  /** Fallback URL if there is no browser history to go back to. */
  defaultHref?: string;
}

/**
 * Renders a toolbar-style back button. Navigates back in history,
 * or to defaultHref if history is empty (e.g., user opened the page directly).
 */
const BackButton: React.FC<BackButtonProps> = ({ defaultHref = '/' }) => {
  const navigate = useNavigate();

  /**
   * Go back if there is history, otherwise navigate to the fallback URL.
   * window.history.length > 1 indicates there is a previous page to go back to.
   */
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(defaultHref);
    }
  };

  return (
    <IonButton fill="clear" onClick={handleBack}>
      <IonIcon slot="icon-only" icon={arrowBackOutline} />
    </IonButton>
  );
};

export default BackButton;
