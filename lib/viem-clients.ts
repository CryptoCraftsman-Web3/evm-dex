import { createPublicClient, http } from 'viem';
import { xrplDevnet } from './xrpl-chains';
import { sepolia } from 'viem/chains';

export const xrplDevnetPublicClient = createPublicClient({
  ...xrplDevnet,
  transport: http(xrplDevnet.rpcUrls.public.http[0]),
});

const sepoliaPublicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const publicClients: {
  [chainId: number]: ReturnType<typeof createPublicClient>;
} = {
  [xrplDevnet.id]: xrplDevnetPublicClient,
  [sepolia.id]: sepoliaPublicClient,
};
