import { zeroAddress } from 'viem';
import { useNetwork } from 'wagmi';

type SwapProtocolAddresses = {
  poolFactoryAddress: `0x${string}`;
  nonfungiblePositionManagerAddress: `0x${string}`;
};

export const useSwapProtocolAddresses = (): SwapProtocolAddresses => {
  const { chain } = useNetwork();

  let poolFactoryAddress = '';
  let nonfungiblePositionManagerAddress = '';

  switch (chain?.id) {
    case 1440002:
      // XRPL Devnet
      poolFactoryAddress = '0x71992849909a5Ed0c8Cc3928F5F5287B13d08aBA';
      nonfungiblePositionManagerAddress = '0xd70B1Ac076ad3B7155735E3CfC8ED24DF37D3235';
      break;
    case 11155111:
      // Sepolia Testnet (our own deployments)
      // poolFactoryAddress = '0x76DDF5E3Cb4412fD8dc39440c56c0C58D0705290';
      // nonfungiblePositionManagerAddress = '0x93D346dacC2878557d8fbb53D995A5317e9B9370';

      // Sepolia Testnet (uniswap deployed)
      poolFactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
      nonfungiblePositionManagerAddress = '0x1238536071E1c677A632429e3655c799b22cDA52'
      break;
    default:
      poolFactoryAddress = zeroAddress;
      nonfungiblePositionManagerAddress = zeroAddress;
      break;
  }

  return {
    poolFactoryAddress: poolFactoryAddress as `0x${string}`,
    nonfungiblePositionManagerAddress: nonfungiblePositionManagerAddress as `0x${string}`,
  };
};
