/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

import { Snackbar } from './types';

/**
 * Контекст для проброса методов работы со Snackbar
 */
export const SnackbarContext = createContext<Snackbar.ContextValue>({
  showMessage: () => {},
  showInfoMessage: () => {},
  showErrorMessage: () => {},
  showSuccessMessage: () => {},
  showWarningMessage: () => {},
});
