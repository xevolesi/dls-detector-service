import { AlertProps, SnackbarOrigin } from '@material-ui/core';
import { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Snackbar {
  export interface Message {
    text: string;
    severity: AlertProps['severity'];
    closeButton?: boolean;
    action?: ReactNode;
  }

  export interface ShowMessageOptions {
    closeButton?: boolean;
    action?: ReactNode;
  }

  export interface ContextValue {
    showMessage: (
      text: string,
      severity?: Message['severity'],
      options?: ShowMessageOptions,
    ) => void;
    showInfoMessage: (text: string, options?: ShowMessageOptions) => void;
    showErrorMessage: (text: string, options?: ShowMessageOptions) => void;
    showWarningMessage: (text: string, options?: ShowMessageOptions) => void;
    showSuccessMessage: (text: string, options?: ShowMessageOptions) => void;
  }

  export interface ProviderProps {
    autoHideDuration?: number;
    anchorOrigin?: SnackbarOrigin;
  }
}
