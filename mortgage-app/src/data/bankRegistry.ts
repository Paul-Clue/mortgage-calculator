/* ==========================================================================
   Bank Registry — maps bank IDs to their raw markdown content.
   --------------------------------------------------------------------------
   Vite's ?raw import suffix reads each file as a plain string at build time,
   so no runtime filesystem access is needed.
   ========================================================================== */

// Raw markdown imports — Vite bundles these as strings at build time.
import jnBankMd from '../../banks/jn-bank.md?raw';
import vmbsMd from '../../banks/vmbs.md?raw';
import sagicorMd from '../../banks/sagicor.md?raw';
import scotiabankMd from '../../banks/scotiabank.md?raw';
import ncbMd from '../../banks/ncb.md?raw';
import jmmbMd from '../../banks/jmmb.md?raw';
import firstCaribbeanMd from '../../banks/first-caribbean.md?raw';

/**
 * Maps each bank ID to its raw markdown content string.
 * Used by BankInfoPage to render bank details.
 */
const bankMarkdown: Record<string, string> = {
  'jn-bank': jnBankMd,
  'vmbs': vmbsMd,
  'sagicor': sagicorMd,
  'scotiabank': scotiabankMd,
  'ncb': ncbMd,
  'jmmb': jmmbMd,
  'first-caribbean': firstCaribbeanMd,
};

/**
 * Retrieve the markdown content for a bank by its ID.
 * Returns undefined if the bank ID is not recognized.
 */
export function getBankMarkdown(bankId: string): string | undefined {
  return bankMarkdown[bankId];
}
