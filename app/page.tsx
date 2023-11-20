import { constants } from '@/lib/constants';
import HomeClientPage from './client-page';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Home | ' + constants.appName,
};

export default function Home() {
  redirect('/swap'); // swap page is home page for now
  return (
    <>
      <HomeClientPage />
    </>
  );
}
