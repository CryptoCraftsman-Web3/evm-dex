'use client';

import { Typography, Button, Box } from '@mui/material';
import { ConnectKitButton } from 'connectkit';

const HomeClientPage = () => {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <ConnectKitButton />
    </Box>
  );
};

export default HomeClientPage;
