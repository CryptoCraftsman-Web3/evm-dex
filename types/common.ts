export type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export type FeeTier = {
  id: number;
  label: string;
  value: number;
  tip: string;
};
