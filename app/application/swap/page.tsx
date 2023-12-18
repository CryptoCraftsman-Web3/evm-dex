import { constants } from '@/lib/constants';
import SwapClientPage from './client-page';
import { getSession } from '@/lib/auth';
import NotSignedIn from '@/components/common/not-signed-in';

export const metadata = {
  title: 'Swap | ' + constants.appName,
};

const SwapPage = async () => {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  return <SwapClientPage />;
};

export default SwapPage;
