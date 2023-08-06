export type Token = {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
};

export type FeeTier = {
  id: number;
  label: string;
  value: number;
  tip: string;
};
