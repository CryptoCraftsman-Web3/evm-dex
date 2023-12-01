import { appDomains, constants } from '@/lib/constants';
import HomeClientPage from './client-page';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Home | ' + constants.appName,
};

export default function Home() {
  return (
    <>
      <HomeClientPage />
    </>
  );
}
