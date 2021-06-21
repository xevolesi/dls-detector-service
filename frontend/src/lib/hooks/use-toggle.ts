import { useCallback, useMemo, useState } from 'react';

interface ToggleActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Хук для удобного контроля булева состояния.
 *
 * @example
 * const [open, actions] = useToggle(false);
 *
 * return (
 *    <>
 *      <Button onCLick={actions.open}>Open modal</Button>
 *      <Modal open={open} onClose={actions.close} />
 *    </>
 * )
 *
 */
export function useToggle(
  defaultValue: boolean,
): [value: boolean, actions: ToggleActions] {
  const [value, setValue] = useState(defaultValue);

  const open = useCallback(() => {
    setValue(true);
  }, []);

  const close = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  const actions = useMemo(() => ({ open, close, toggle }), []);

  return [value, actions];
}
