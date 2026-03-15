/* ==========================================================================
   BankInfoPage
   --------------------------------------------------------------------------
   Renders the bank's markdown info file using react-markdown with
   rehype-sanitize for XSS protection. The markdown is loaded at build
   time via Vite's ?raw import (handled in bankRegistry.ts).
   ========================================================================== */

import { useParams, useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { getBankById } from '../data/banks';
import { getBankMarkdown } from '../data/bankRegistry';
import BackButton from '../components/BackButton';
import './BankInfoPage.css';

/**
 * Displays rendered markdown content for a specific bank.
 * Bank ID is taken from the URL parameter.
 */
const BankInfoPage: React.FC = () => {
  const { bankId } = useParams<{ bankId: string }>();
  const navigate = useNavigate();
  const bank = getBankById(bankId!);
  const markdown = getBankMarkdown(bankId!);

  // If bank or markdown not found, show an error message.
  if (!bank || !markdown) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <BackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Bank Info</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Bank information not found.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton defaultHref={`/bank/${bankId}`} />
          </IonButtons>
          <IonTitle>{bank.name} Info</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => navigate('/')}>Home</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="bank-info-markdown">
          {/* Render the markdown content with XSS sanitization. */}
          <ReactMarkdown
            rehypePlugins={[rehypeSanitize]}
            components={{
              // Make links open in a new tab / external browser.
              a: ({ children, href, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BankInfoPage;
