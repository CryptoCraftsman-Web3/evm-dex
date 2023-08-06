import { useNetwork } from 'wagmi';

export const usePoolFactory = (): `0x${string}` => {
  const { chain } = useNetwork();

  let poolFactoryAddress = '';

  switch (chain?.id) {
    case 1440002:
      // XRPL Devnet
      poolFactoryAddress = '0x71992849909a5Ed0c8Cc3928F5F5287B13d08aBA';
      break;
    case 11155111:
      // Sepolia Testnet
      poolFactoryAddress = '0x76DDF5E3Cb4412fD8dc39440c56c0C58D0705290';
      break;
    default:
      poolFactoryAddress = '0x0000000000000000000000000000000000000000';
      break;
  }

  return poolFactoryAddress as `0x${string}`;
};
