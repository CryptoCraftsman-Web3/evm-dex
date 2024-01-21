import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '../providers';
import Header from '@/components/header';
import { constants } from '@/lib/constants';
import MainContent from '@/components/main-content';
import AppFooter from '@/components/app-footer';
import { Box } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: constants.appName,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </head>
      <body className={inter.className} style={{ minHeight: '100vh' }}>
        <Providers>
          <Header location='app' />

          <Box
            sx={{
              width: '1320px',
              maxWidth: '100%',
              mx: 'auto',
              px: { xs: '8px', md: 0 }
            }}
          >
            {children}
          </Box>

          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
