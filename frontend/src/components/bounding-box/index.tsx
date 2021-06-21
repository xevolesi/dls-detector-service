import { useMemo, VFC } from 'react';
import { Box, Tooltip, Typography } from '@material-ui/core';

import { TBox } from '../../types';

import { useStyles } from './styles';

export type BoundingBoxProps = {
  box: TBox;
};

export const BoundingBox: VFC<BoundingBoxProps> = (props) => {
  const {
    box: { coordinates, color, confidence, class_name: name },
  } = props;

  const [left, top, width, height] = useMemo(
    () => coordinates.map((c) => (c * 100).toString().concat('%')),
    [coordinates],
  );

  const rgba = useMemo(() => `rgba(${color.join(', ')})`, [color]);

  const classes = useStyles();

  return (
    <Tooltip
      enterTouchDelay={0}
      title={
        <Typography
          sx={{ textTransform: 'capitalize' }}
          variant="body2"
          color="inherit"
        >
          {name}: {(confidence * 100).toFixed(2)}%
        </Typography>
      }
      arrow
      placement="top"
    >
      <Box
        tabIndex={0}
        className={classes.root}
        style={{ left, top, width, height, borderColor: rgba }}
      />
    </Tooltip>
  );
};
