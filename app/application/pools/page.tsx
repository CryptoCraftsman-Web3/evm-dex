import { getSession } from '@/lib/auth';
import PoolsClientPage from './client-page';
import NotSignedIn from '@/components/common/not-signed-in';

const PoolsPage = async () => {
  const session = await getSession();
  if (!session) return <NotSignedIn />;

  return <PoolsClientPage />;
};

export default PoolsPage;
