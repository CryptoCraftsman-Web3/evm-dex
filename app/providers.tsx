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
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
