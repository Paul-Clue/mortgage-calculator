/* ==========================================================================
   BankButton Component
   --------------------------------------------------------------------------
   A styled button used on the Home screen to represent each bank.
   Tapping it navigates to the bank's mortgage calculator page.
   ========================================================================== */

import { IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

interface BankButtonProps {
  /** The bank's unique ID slug used in the route (e.g. "jn-bank") */
  bankId: string;

  /** The bank's display name (e.g. "JN Bank") */
  bankName: string;
}

/**
 * Renders a full-width button for a bank on the Home screen.
 * Navigates to /bank/:bankId when tapped.
 */
const BankButton: React.FC<BankButtonProps> = ({ bankId, bankName }) => {
  const navigate = useNavigate();

  /** Navigate to the bank calculator page. */
  const handleClick = () => {
    navigate(`/bank/${bankId}`);
  };

  return (
    <IonButton
      expand="block"
      color="secondary"
      onClick={handleClick}
      className="bank-button"
      style={{ margin: '8px 0', minHeight: '52px', fontSize: '1rem' }}
    >
      {bankName}
    </IonButton>
  );
};

export default BankButton;
