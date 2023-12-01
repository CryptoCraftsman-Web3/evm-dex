import MainContent from '@/components/main-content';
import { constants } from '@/lib/constants';
import type { Metadata } from 'next';
import '../globals.css';
import Providers from '../providers';
import HomeHeader from '@/components/home-header';
import Footer from '@/components/footer';


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
      <body>
        <Providers>
          <HomeHeader />

          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
