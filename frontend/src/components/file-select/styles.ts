import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(
  ({ spacing, palette, shape, transitions }) => ({
    root: {
      width: '100%',
      maxWidth: 400,
      padding: spacing(2),
      border: `1px dashed ${palette.grey[400]}`,
      borderRadius: shape.borderRadius,
      cursor: 'pointer',
      transition: transitions.create(['border-color'], {
        duration: transitions.duration.short,
      }),
    },
    dragActive: {
      borderColor: palette.common.black,
    },
    error: {
      borderColor: palette.error.main,
    },
  }),
  { name: 'FileSelect' },
);
