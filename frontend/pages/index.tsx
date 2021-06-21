import Head from 'next/head';
import { AppBar, Box, Container, Tab, Tabs, useTheme } from '@material-ui/core';
import { useState } from 'react';

import { ImageProcessing } from '../src/containers/image-processing';
import { VideoProcessing } from '../src/containers/video-processing';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Head>
        <title>Detector</title>
      </Head>

      <Box
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          pb: 2,
          gap: 3,
        }}
      >
        <AppBar position="static">
          <Tabs
            indicatorColor="secondary"
            textColor="inherit"
            value={activeTab}
            onChange={(_, v: number) => setActiveTab(v)}
          >
            <Tab label="Image" />
            <Tab label="Video" />
          </Tabs>
        </AppBar>
        <Container maxWidth="lg" sx={{ overflow: 'hidden' }}>
          {activeTab === 0 && <ImageProcessing />}
          {activeTab === 1 && <VideoProcessing />}
        </Container>
      </Box>
    </>
  );
}
