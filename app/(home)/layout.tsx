import MainContent from '@/components/main-content';
import { constants } from '@/lib/constants';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Providers from '../providers';

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
      <body className={inter.className}>
        <Providers>
          <MainContent>{children}</MainContent>
        </Providers>
      </body>
    </html>
  );
}
