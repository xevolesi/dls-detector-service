import { useEffect, useState, VFC } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
} from '@material-ui/core';
import { Replay } from '@material-ui/icons';

import { VideoSelect } from '../../components/video-select';
import { useSnackbar } from '../../lib/snackbar';
import { predict } from '../../api/predict';
import { extractErrorMessage } from '../../lib/helpers/extract-error-message';

export const VideoProcessing: VFC = () => {
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { showErrorMessage } = useSnackbar();

  const resetState = () => {
    setSrc('');
    setFile(null);
  };

  useEffect(() => {
    (async () => {
      try {
        if (file) {
          setLoading(true);
          setSrc(await predict.video(file));
        }
      } catch (e) {
        showErrorMessage(extractErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [file]);

  return (
    <>
      {src && (
        <Stack
          alignItems="center"
          spacing={2}
          sx={{
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <Box width="100%">
            <Button
              variant="outlined"
              startIcon={<Replay />}
              onClick={resetState}
            >
              Reset
            </Button>
          </Box>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            sx={{ overflow: 'hidden', height: '100%' }}
          >
            <Box
              component="video"
              sx={{
                maxHeight: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}
              controls
              autoPlay
            >
              <source src={src} />
            </Box>
          </Stack>
        </Stack>
      )}
      {!src && (
        <Stack height="100%" alignItems="center" justifyContent="center">
          <VideoSelect
            onDropAccepted={async ([file]) => {
              setFile(file);
            }}
            onDropRejected={() => {
              showErrorMessage(
                'Selecting file error. Check file type and size.',
              );
            }}
          />
        </Stack>
      )}
      {loading && (
        <Backdrop open>
          <CircularProgress />
        </Backdrop>
      )}
    </>
  );
};
