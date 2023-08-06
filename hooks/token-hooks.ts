// returns a predefined list of ERC20 tokens to be used in the app

import { useNetwork } from 'wagmi';

export type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export const useErc20Tokens = () => {
  // get current chain
  const { chain } = useNetwork();

  // predefined list of tokens by contract address (we should move this to a database in the future)
  let tokens: Token[] = [];

  switch (chain?.id) {
    case 1440002: tokens = xrplDevnetTokens; break;
    case 11155111: tokens = sepoliaTokens; break;
    default: tokens = []; break;
  }

  return tokens;
};

const xrplDevnetTokens = [
  {
    name: 'Wrapped XRP',
    symbol: 'WXRP',
    address: '0xb560eF7E09609C939E09a1a15961043278D27b03',
    decimals: 18,
  },
  {
    name: 'USDX',
    symbol: 'USDX',
    address: '0x0c5C1D094f92eFfd9A6a9b0546b7b1B852B442a2',
    decimals: 18,
  },
];

const sepoliaTokens = [
  {
    name: 'Wrapped XRP',
    symbol: 'WXRP',
    address: '0x030bEE4bbB0D8504e5F9E215647796BE3951A422',
    decimals: 18,
  },
  {
    name: 'USDX',
    symbol: 'USDX',
    address: '0x71992849909a5Ed0c8Cc3928F5F5287B13d08aBA',
    decimals: 18,
  },
];