export type Token = {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  isNative: boolean;
};

export type FeeTier = {
  id: number;
  label: string;
  value: number;
  tip: string;
};

export type Position = {
  tokenId: bigint;
  nonce: bigint;
  operator: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
};
