import { appDomains, constants } from '@/lib/constants';
import HomeClientPage from './client-page';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Home | ' + constants.appName,
};

export default function Home() {
  if (appDomains.includes(process.env.VERCEL_URL)) {
    redirect('/swap');
  }

  return (
    <>
      <HomeClientPage />
    </>
  );
}
