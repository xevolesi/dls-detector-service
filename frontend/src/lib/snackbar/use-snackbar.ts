import { useContext } from 'react';

import { SnackbarContext } from './snackbar-context';

/**
 * Хук, предоставляющий методы для отображения Snackbar
 */
export function useSnackbar() {
  return useContext(SnackbarContext);
}
