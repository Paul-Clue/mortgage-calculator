/* ==========================================================================
   BankButton Component
   --------------------------------------------------------------------------
   A styled button used on the Home screen to represent each bank.
   Tapping it navigates to the bank's mortgage calculator page.
   ========================================================================== */

import { useNavigate } from 'react-router-dom';
import './BankButton.css';

interface BankButtonProps {
  /** The bank's unique ID slug used in the route (e.g. "jn-bank") */
  bankId: string;

  /** The bank's display name (e.g. "JN Bank") */
  bankName: string;

  /** Optional path to a logo image. When provided, the logo is shown instead of text. */
  logoSrc?: string;
}

/**
 * Renders a full-width dark button for a bank on the Home screen.
 * Uses a plain button element for full CSS control over the dark theme styling.
 * Navigates to /bank/:bankId when tapped.
 */
const BankButton: React.FC<BankButtonProps> = ({ bankId, bankName, logoSrc }) => {
  const navigate = useNavigate();

  /** Navigate to the bank calculator page. */
  const handleClick = () => {
    navigate(`/bank/${bankId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bank-button"
      type="button"
    >
      {logoSrc ? (
        <span className="bank-button-content">
          <img
            src={logoSrc}
            alt={bankName}
            className="bank-button-logo"
          />
          <span>{bankName}</span>
        </span>
      ) : (
        bankName
      )}
    </button>
  );
};

export default BankButton;
