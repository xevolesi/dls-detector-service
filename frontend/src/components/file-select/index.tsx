import { FC } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { ButtonBase, Stack, Typography } from '@material-ui/core';
import { FileUploadRounded } from '@material-ui/icons';
import clsx from 'clsx';

import { useStyles } from './styles';

export type FileSelectProps = {
  error?: boolean;
} & DropzoneOptions;

export const FileSelect: FC<FileSelectProps> = (props) => {
  const { error, children, ...rest } = props;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    ...rest,
  });
  const classes = useStyles();

  return (
    <ButtonBase
      className={clsx(
        classes.root,
        isDragActive && classes.dragActive,
        error && classes.error,
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Stack spacing={2} alignItems="center">
        <FileUploadRounded fontSize="large" />

        <Typography align="center">
          Drag &rsquo;n&rsquo; drop file here, or&nbsp;click to&nbsp;select file
        </Typography>

        {children}
      </Stack>
    </ButtonBase>
  );
};
