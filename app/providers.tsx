'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import { Inter } from 'next/font/google';
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({ subsets: ['latin'] });

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
    typography: {
      fontFamily: inter.style.fontFamily,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Providers;
