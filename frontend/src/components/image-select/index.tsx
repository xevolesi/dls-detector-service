import { VFC } from 'react';
import { Typography } from '@material-ui/core';

import { FileSelect, FileSelectProps } from '../file-select';

export const ImageSelect: VFC<FileSelectProps> = (props) => {
  return (
    <FileSelect
      accept={['.jpg', '.png', '.jpeg']}
      maxSize={10 * 1024 ** 2}
      {...props}
    >
      <Typography variant="body2" align="center">
        <Typography variant="inherit" display="block" gutterBottom>
          Accepted file types is <strong>.jpg</strong>, <strong>.jpeg</strong>{' '}
          and&nbsp;<strong>.png</strong>
        </Typography>

        <Typography variant="inherit" display="block">
          File size must be under <strong>10mb</strong>
        </Typography>
      </Typography>
    </FileSelect>
  );
};
