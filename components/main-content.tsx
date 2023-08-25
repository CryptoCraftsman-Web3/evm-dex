'use client';

import { Box, Stack } from '@mui/material';

type MainContentProps = {
  children: React.ReactNode;
};

const MainContent = ({ children }: MainContentProps) => {
  return (
    <Box sx={{ my: 8 }}>
      <Box
        px={{ xs: 2, md: 6 }}
        pt={{ xs: 4, md: 8 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          direction="column"
          spacing={4}
          width={{ xs: '100%', md: '600px', lg: '800px' }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default MainContent;
