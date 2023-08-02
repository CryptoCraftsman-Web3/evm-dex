'use client';

import { Box } from '@mui/material';

type MainContentProps = {
  children: React.ReactNode;
};

const MainContent = ({ children }: MainContentProps) => {
  return (
    <Box sx={{ my: 8 }}>
      {children}
    </Box>
  )
};

export default MainContent;
