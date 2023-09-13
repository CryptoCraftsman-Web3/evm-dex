'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import { Inter } from 'next/font/google';
import CssBaseline from '@mui/material/CssBaseline';
import { createConfig, sepolia, WagmiConfig } from 'wagmi';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from 'connectkit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { xrplDevnet } from '@/lib/xrpl-chains';

const inter = Inter({ subsets: ['latin'] });

const wagmiConfig = createConfig(
  getDefaultConfig({
    infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PID,
    appName: 'StaykX EVM Dex',
    chains: [sepolia, xrplDevnet],
  })
);

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#3B0054',
      },
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
        },
      },
    },
    shape: {
      borderRadius: 0,
    },
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
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider customTheme={connectKitTheme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          <ToastContainer
            theme="dark"
            position="bottom-center"
            autoClose={2500}
            bodyStyle={{
              fontFamily: inter.style.fontFamily,
            }}
            closeButton={false}
          />
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
