import { Chain } from 'wagmi'

export const xrplDevnet = {
  id: 1440002,
  name: 'XRPL Devnet',
  network: 'xrpl-devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XRP',
    symbol: 'XRP',
  },
  rpcUrls: {
    public: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
    default: { http: ['https://rpc-evm-sidechain.xrpl.org'] },
  },
  blockExplorers: {
    etherscan: { name: 'XRP Ledger', url: 'https://evm-sidechain.xrpl.org' },
    default: { name: 'XRP Ledger', url: 'https://evm-sidechain.xrpl.org' },
  },
  testnet: true,
} as const satisfies Chain
