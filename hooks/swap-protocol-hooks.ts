import { zeroAddress } from 'viem';
import { useNetwork } from 'wagmi';

type SwapProtocolAddresses = {
  poolFactory: `0x${string}`;
  nfPositionManager: `0x${string}`;
  serpentSwapUtility: `0x${string}`;
  quoterV2: `0x${string}`;
  swapRouter: `0x${string}`;
};

export const useSwapProtocolAddresses = (): SwapProtocolAddresses => {
  const { chain } = useNetwork();

  let poolFactory: `0x${string}` = zeroAddress;
  let nfPositionManager: `0x${string}` = zeroAddress;
  let serpentSwapUtility: `0x${string}` = zeroAddress;
  let quoterV2: `0x${string}` = zeroAddress;
  let swapRouter: `0x${string}` = zeroAddress;

  switch (chain?.id) {
    case 1440002:
      // XRPL Devnet
      poolFactory = '0x123b5c88Cc98f8f73b686cd8bdEA213EAa4360e8';
      nfPositionManager = '0x2Bd64c4C3C59b2f4B8f5A077c17eD9F9e816dF64';
      serpentSwapUtility = '0x1f9dE68B808a758D5eB56EB10e62d6360B79d210';
      quoterV2 = '0xDb3721EBB2CC650e4A41f685294b51406F6Ab5D4';
      swapRouter = '0x8E839AA95Ab9EeA254373a722159D96D7DedAfaB';
      break;
    case 11155111:
      // Sepolia Testnet (our own deployments)
      // poolFactory = '0x76DDF5E3Cb4412fD8dc39440c56c0C58D0705290';
      // nfPositionManager = '0x93D346dacC2878557d8fbb53D995A5317e9B9370';

      // Sepolia Testnet (uniswap deployed)
      poolFactory = '0x19f217A65E827f6fA955F89b7ABfACcCcf7c9860';
      nfPositionManager = '0xd33dde75E3105e3506b437438fedDC27a2Dd7A95';
      serpentSwapUtility = '0x6C45c98B989058feF7e6d0701515Ad6238ac45C6';
      quoterV2 = '0x1BF0070245CF5C9Ed97B6b41E8a087703fd76e1B';
      swapRouter = '0x8049c9E3cE496b47E0fE8aa8EdAEf751cF87e07d';
      break;
    default:
      poolFactory = zeroAddress;
      nfPositionManager = zeroAddress;
      serpentSwapUtility = zeroAddress;
      quoterV2 = zeroAddress;
      swapRouter = zeroAddress;
      break;
  }

  return {
    poolFactory,
    nfPositionManager,
    serpentSwapUtility,
    quoterV2,
    swapRouter,
  };
};
