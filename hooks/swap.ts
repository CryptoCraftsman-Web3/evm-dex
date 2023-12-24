import { useAccount, useNetwork } from 'wagmi';
import { useSwapProtocolAddresses } from './swap-protocol-hooks';
import { useTokenManager } from '@/app/application/swap/token';

export function useTokenSwap() {
  const { chain } = useNetwork();
  const { address: userAddress, isConnected: isUserWalletConnected } = useAccount();
  const { serpentSwapUtility, poolFactory } = useSwapProtocolAddresses();

  const { tokenA, tokenB, setTokenA, setTokenB } = useTokenManager();
}
