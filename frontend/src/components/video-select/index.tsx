import { VFC } from 'react';
import { Typography } from '@material-ui/core';

import { FileSelect, FileSelectProps } from '../file-select';

export const VideoSelect: VFC<FileSelectProps> = (props) => {
  return (
    <FileSelect
      accept={['.webm', '.avi', '.mp4', '.mkv']}
      maxSize={100 * 1024 ** 2}
      {...props}
    >
      <Typography variant="body2" align="center">
        <Typography variant="inherit" display="block" gutterBottom>
          Accepted file types is <strong>.webm</strong>, <strong>.avi</strong>,{' '}
          <strong>.mp4</strong> and&nbsp;<strong>.mkv</strong>
        </Typography>

        <Typography variant="inherit" display="block">
          File size must be under <strong>100mb</strong>
        </Typography>
      </Typography>
    </FileSelect>
  );
};
