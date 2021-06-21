import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Snackbar,
  SnackbarCloseReason,
  SnackbarOrigin,
} from '@material-ui/core';

import { useToggle } from '../hooks/use-toggle';

import { SnackbarContext } from './snackbar-context';
import { Snackbar as SnackbarNS } from './types';

const defaultAnchorOrigin: SnackbarOrigin = {
  vertical: 'top',
  horizontal: 'center',
};

const defaultAutoHideDuration = 2000;

/**
 * Провайдер содержит в себе логику отображения сообщений и предоставляет
 * методы для отображения через контекст.
 */
export const SnackbarProvider: FC<SnackbarNS.ProviderProps> = (props) => {
  const {
    anchorOrigin = defaultAnchorOrigin,
    autoHideDuration = defaultAutoHideDuration,
    children,
  } = props;

  const [queue, setQueue] = useState<SnackbarNS.Message[]>([]);
  const [open, { close: closeSnackbar, open: openSnackbar }] = useToggle(false);
  const [message] = queue;

  const takeNext = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  const onSnackbarClose = useCallback(
    (_: unknown, reason: SnackbarCloseReason) => {
      if (reason === 'timeout') {
        closeSnackbar();
      }
    },
    [],
  );

  const showMessage = useCallback<SnackbarNS.ContextValue['showMessage']>(
    (text, severity, options) => {
      setQueue((q) => [...q, { text, severity, ...options }]);
    },
    [],
  );

  const showErrorMessage = useCallback<
    SnackbarNS.ContextValue['showErrorMessage']
  >((text, options) => {
    showMessage(text, 'error', options);
  }, []);

  const showInfoMessage = useCallback<
    SnackbarNS.ContextValue['showInfoMessage']
  >((text, options) => {
    showMessage(text, 'info', options);
  }, []);

  const showWarningMessage = useCallback<
    SnackbarNS.ContextValue['showWarningMessage']
  >((text, options) => {
    showMessage(text, 'warning', options);
  }, []);

  const showSuccessMessage = useCallback<
    SnackbarNS.ContextValue['showSuccessMessage']
  >((text, options) => {
    showMessage(text, 'success', options);
  }, []);

  const contextValue = useMemo<SnackbarNS.ContextValue>(
    () => ({
      showMessage,
      showErrorMessage,
      showInfoMessage,
      showWarningMessage,
      showSuccessMessage,
    }),
    [],
  );

  const TransitionProps = useMemo(() => ({ onExited: takeNext }), []);

  useEffect(() => {
    if (message) {
      openSnackbar();
    }
  }, [message]);

  return (
    <>
      <Snackbar
        open={open}
        onClose={onSnackbarClose}
        anchorOrigin={anchorOrigin}
        TransitionProps={TransitionProps}
        autoHideDuration={autoHideDuration}
      >
        {message && (
          <Alert
            variant="filled"
            onClose={message.closeButton ? closeSnackbar : undefined}
            severity={message.severity}
            action={message.action}
          >
            {message.text}
          </Alert>
        )}
      </Snackbar>
      <SnackbarContext.Provider value={contextValue}>
        {children}
      </SnackbarContext.Provider>
    </>
  );
};
