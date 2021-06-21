import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(
  ({ shape, shadows, transitions }) => ({
    root: {
      position: 'absolute',
      borderWidth: 3,
      borderStyle: 'solid',
      borderRadius: shape.borderRadius,
      boxShadow: shadows[3],
      transition: transitions.create(['box-shadow'], {
        duration: transitions.duration.short,
      }),
      outline: 'none',

      '&:focus': {
        zIndex: 1,
        boxShadow: shadows[6],
        borderWidth: 4,
      },
    },
  }),
  { name: 'BoundingBox' },
);
