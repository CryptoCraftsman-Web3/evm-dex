import { getSession } from '@/lib/auth';
import NFTsClientPage from './client-page';

export default async function NFTsPage() {
  const session = await getSession();
  if (!session)

  return <NFTsClientPage />;
}
