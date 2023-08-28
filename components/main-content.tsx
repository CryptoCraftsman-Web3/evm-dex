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
          spacing={2}
          width={{ xs: '100%', md: '600px', lg: '800px' }}
          paddingBottom={{ xs: 2, md: 'initial' }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default MainContent;
