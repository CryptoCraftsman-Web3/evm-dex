import { ethers } from 'ethers';

export type Quote = {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: ethers.BigNumber;
  amountOut: ethers.BigNumber;
  fee: number;
  sqrtPriceX96: ethers.BigNumber;
  sqrtPriceX96After: ethers.BigNumber;
};