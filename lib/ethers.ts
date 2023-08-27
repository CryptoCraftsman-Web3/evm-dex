import { useNetwork } from 'wagmi';
import { ethers } from 'ethers';

export const useEthersProvider = () => {
  const { chain } = useNetwork();
  if (!chain) return null;

  if (chain.id === 11155111)
    return new ethers.providers.InfuraProvider(11155111, process.env.NEXT_PUBLIC_INFURA_API_KEY);

  const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrls.public.http[0]);
  return provider;
};
