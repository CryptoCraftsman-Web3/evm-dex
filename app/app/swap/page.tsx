import { constants } from '@/lib/constants';
import SwapClientPage from './client-page';

export const metadata = {
  title: 'Swap | ' + constants.appName,
};

const SwapPage = () => {
  return <SwapClientPage />;
};

export default SwapPage;
