import { zeroAddress } from 'viem';
import { useNetwork } from 'wagmi';

type SwapProtocolAddresses = {
  poolFactory: `0x${string}`;
  nfPositionManager: `0x${string}`;
  serpentSwapUtility: `0x${string}`;
  quoterV2: `0x${string}`;
};

export const useSwapProtocolAddresses = (): SwapProtocolAddresses => {
  const { chain } = useNetwork();

  let poolFactory: `0x${string}` = zeroAddress;
  let nfPositionManager: `0x${string}` = zeroAddress;
  let serpentSwapUtility: `0x${string}` = zeroAddress;
  let quoterV2: `0x${string}` = zeroAddress;

  switch (chain?.id) {
    case 1440002:
      // XRPL Devnet
      poolFactory = '0x71992849909a5Ed0c8Cc3928F5F5287B13d08aBA';
      nfPositionManager = '0xd70B1Ac076ad3B7155735E3CfC8ED24DF37D3235';
      serpentSwapUtility = '0x1f9dE68B808a758D5eB56EB10e62d6360B79d210';
      quoterV2 = '0x2abc3CFB89DE3685e10C61f0E763131D63aC14a6';
      break;
    case 11155111:
      // Sepolia Testnet (our own deployments)
      // poolFactory = '0x76DDF5E3Cb4412fD8dc39440c56c0C58D0705290';
      // nfPositionManager = '0x93D346dacC2878557d8fbb53D995A5317e9B9370';

      // Sepolia Testnet (uniswap deployed)
      poolFactory = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
      nfPositionManager = '0x1238536071E1c677A632429e3655c799b22cDA52';
      serpentSwapUtility = '0x6C45c98B989058feF7e6d0701515Ad6238ac45C6';
      quoterV2 = '0x7452004cf527EEf23f0C74fcdB159160E766700F';
      break;
    default:
      poolFactory = zeroAddress;
      nfPositionManager = zeroAddress;
      serpentSwapUtility = zeroAddress;
      quoterV2 = zeroAddress;
      break;
  }

  return {
    poolFactory,
    nfPositionManager,
    serpentSwapUtility,
    quoterV2,
  };
};
