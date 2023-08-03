'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import { Inter } from 'next/font/google';
import CssBaseline from '@mui/material/CssBaseline';
import { createConfig, WagmiConfig } from 'wagmi';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from 'connectkit';

const inter = Inter({ subsets: ['latin'] });

const wagmiConfig = createConfig(
  getDefaultConfig({
    infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PID,
    appName: 'StaykX EVM Dex',
  })
);

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
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        }
      }
    }
  });

  const ckBorderRadius = `${theme.shape.borderRadius}px`;

  const connectKitTheme = {
    '--ck-font-family': inter.style.fontFamily,
    '--ck-overlay-backdrop-filter': 'blur',
    '--ck-border-radius': ckBorderRadius,
    '--ck-connectbutton-border-radius': ckBorderRadius,
    '--ck-connectbutton-color': theme.palette.text.primary,
    '--ck-connectbutton-background': theme.palette.primary.dark,
    '--ck-connectbutton-hover-background': theme.palette.primary.main,
    '--ck-connectbutton-active-background': theme.palette.primary.dark,
    '--ck-body-background': theme.palette.background.default,
    '--ck-primary-button-color': theme.palette.primary.contrastText,
    '--ck-primary-button-background': theme.palette.primary.dark,
    '--ck-primary-button-hover-background': theme.palette.primary.main,
    '--ck-primary-button-active-background': theme.palette.primary.dark,
    '--ck-primary-button-border-radius': ckBorderRadius,
    '--ck-primary-button-hover-border-radius': ckBorderRadius,
    '--ck-primary-button-active-border-radius': ckBorderRadius,
    '--ck-secondary-button-background': theme.palette.primary.dark,
    '--ck-secondary-button-hover-background': theme.palette.primary.main,
    '--ck-secondary-button-active-background': theme.palette.primary.dark,
    '--ck-secondary-button-border-radius': ckBorderRadius,
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider customTheme={connectKitTheme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
