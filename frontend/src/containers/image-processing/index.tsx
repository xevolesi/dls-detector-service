import { useEffect, useMemo, useState, VFC } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Autocomplete,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Chip,
} from '@material-ui/core';
import { Replay, Tune } from '@material-ui/icons';

import { ImageSelect } from '../../components/image-select';
import { getImageUrlFromFile } from '../../lib/helpers/get-image-url-from-file';
import { useSnackbar } from '../../lib/snackbar';
import { ImageView } from '../../components/image-view';
import { BoundingBox } from '../../components/bounding-box';
import { extractErrorMessage } from '../../lib/helpers/extract-error-message';
import { TBox } from '../../types';
import { predict } from '../../api/predict';
import { useToggle } from '../../lib/hooks/use-toggle';

export const ImageProcessing: VFC = () => {
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { showErrorMessage } = useSnackbar();
  const [dialogOpen, dialog] = useToggle(false);

  const boxColors = useMemo(() => {
    return boxes.reduce<Record<string, TBox['color']>>((acc, box) => {
      acc[box.class_name] = box.color;

      return acc;
    }, {});
  }, [boxes]);

  const filterOptions = useMemo(() => {
    return Object.keys(boxColors).sort((a, b) => a.localeCompare(b));
  }, [boxColors]);

  const filteredBoxes = useMemo(() => {
    if (filter.length) {
      return boxes.filter((box) => filter.includes(box.class_name));
    }

    return boxes;
  }, [boxes, filter]);

  const resetState = () => {
    setImage('');
    setFile(null);
    setBoxes([]);
    setFilter([]);
  };

  useEffect(() => {
    (async () => {
      try {
        if (file) {
          setLoading(true);
          setBoxes(await predict.boxes(file));
          setImage(await getImageUrlFromFile(file));
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
      {!image && (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: '100%' }}
        >
          <ImageSelect
            onDropRejected={() => {
              showErrorMessage(
                'Selecting file error. Check file type and size.',
              );
            }}
            onDropAccepted={async ([file]) => {
              setFile(file);
            }}
          />
        </Stack>
      )}

      {image && (
        <Stack
          sx={{
            overflow: 'hidden',
            height: '100%',
          }}
          spacing={2}
          alignItems="center"
        >
          <Box width="100%">
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Tune />}
                  disabled={loading}
                  onClick={dialog.open}
                >
                  Filter
                </Button>
                <Dialog
                  scroll="paper"
                  open={dialogOpen}
                  onClose={dialog.close}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Class filter</DialogTitle>
                  <DialogContent dividers>
                    <Autocomplete
                      multiple
                      fullWidth
                      options={filterOptions}
                      value={filter}
                      onChange={(_, value) => setFilter(value)}
                      renderInput={(params) => (
                        <TextField {...params} label="Selected classes" />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          // eslint-disable-next-line react/jsx-key
                          <Chip
                            variant="outlined"
                            label={option}
                            sx={{
                              borderColor: `rgba(${boxColors[option].join(
                                ', ',
                              )})`,
                              borderWidth: 2,
                              textTransform: 'capitalize',
                            }}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box
                            component="span"
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {option}
                          </Box>
                        </li>
                      )}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={dialog.close}>Close</Button>
                  </DialogActions>
                </Dialog>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Replay />}
                  onClick={resetState}
                  disabled={loading}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>

          <ImageView src={image} loading={false}>
            {filteredBoxes.map((box) => {
              return <BoundingBox key={box.coordinates.join(',')} box={box} />;
            })}
          </ImageView>
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
