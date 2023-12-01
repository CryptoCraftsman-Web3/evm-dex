import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '../providers';
import AppHeader from '@/components/app-header';
import { constants } from '@/lib/constants';
import MainContent from '@/components/main-content';
import AppFooter from '@/components/app-footer';

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
        <link rel="icon" href="/serpent-swap-logo.svg" />
      </head>
      <body className={inter.className} style={{ minHeight: '100vh' }}>
        <Providers>
          <AppHeader />
          <MainContent>{children}</MainContent>
          <AppFooter />
        </Providers>
      </body>
    </html>
  );
}
