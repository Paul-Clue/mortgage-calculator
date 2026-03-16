/* ==========================================================================
   ErrorBoundary Component
   --------------------------------------------------------------------------
   A React error boundary that catches runtime errors in its child component
   tree. Instead of crashing to a white screen, it shows a friendly message
   with a button to retry or go home.

   React error boundaries must be class components — there is no hooks
   equivalent for componentDidCatch / getDerivedStateFromError.
   ========================================================================== */

import React from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonText,
} from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  /** Whether an error has been caught in this boundary. */
  hasError: boolean;
  /** The error message, if available. */
  errorMessage: string;
}

/**
 * Catches JavaScript errors anywhere in its child component tree and
 * displays a fallback UI instead of crashing the entire app.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  /**
   * Called when a descendant component throws during rendering.
   * Updates state so the next render shows the fallback UI.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  /**
   * Log the error for debugging. In production, this could send
   * the error to an external reporting service.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  /**
   * Reset the error state so the user can retry rendering the page.
   */
  handleRetry = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  /**
   * Navigate to the home page and reset the error state.
   */
  handleGoHome = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <IonPage>
          <IonContent className="ion-padding ion-text-center">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '16px',
              padding: '32px',
              color: 'var(--app-text-primary)',
            }}>
              <IonIcon
                icon={alertCircleOutline}
                style={{ fontSize: '64px', color: 'var(--ion-color-danger)' }}
              />
              <IonText>
                <h2 style={{ color: 'var(--app-text-primary)' }}>Something went wrong</h2>
              </IonText>
              <IonText>
                <p style={{ color: 'var(--app-text-secondary)' }}>{this.state.errorMessage}</p>
              </IonText>
              <IonButton onClick={this.handleRetry} color="primary">
                Try Again
              </IonButton>
              <IonButton onClick={this.handleGoHome} fill="outline"
                style={{ '--border-color': 'var(--app-border)', '--color': 'var(--app-text-secondary)' } as React.CSSProperties}
              >
                Go to Home
              </IonButton>
            </div>
          </IonContent>
        </IonPage>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
