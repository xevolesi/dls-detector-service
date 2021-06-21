import { FC, useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  BoxProps,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import ResizeObserver from 'resize-observer-polyfill';

export type ImageViewProps = {
  src: string;
  loading?: boolean;
} & BoxProps;

export const ImageView: FC<ImageViewProps> = (props) => {
  const { children, src, loading, sx, ...rest } = props;
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (element) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setRect(entry.contentRect);
        }
      });

      ro.observe(element);

      return () => ro.unobserve(element);
    }
  }, [element]);

  return (
    <Box
      position="relative"
      display="inline-flex"
      sx={{
        overflow: 'hidden',
        justifyContent: 'center',
        borderRadius: `${theme.shape.borderRadius}px`,
        ...sx,
      }}
      {...rest}
    >
      <Box
        ref={setElement}
        component="img"
        src={src}
        sx={{ maxHeight: '100%', maxWidth: '100%' }}
      />
      <Box
        sx={{ position: 'absolute', top: 0 }}
        style={rect ? { width: rect.width, height: rect.height } : undefined}
      >
        {children}
      </Box>
      {loading && (
        <Backdrop open sx={{ position: 'absolute' }}>
          <CircularProgress />
        </Backdrop>
      )}
    </Box>
  );
};
