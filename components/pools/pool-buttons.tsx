import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { Token } from '@/types/common';
import { Button, Stack } from '@mui/material';
import { zeroAddress } from 'viem';
import { erc20ABI, useAccount, useContractReads } from 'wagmi';

type PoolButtonsProps = {
  tokenA: Token | null;
  tokenB: Token | null;
  amountA: number;
  amountB: number;
};

const PoolButtons = ({ tokenA, tokenB, amountA, amountB }: PoolButtonsProps) => {
  const { address: userAddress } = useAccount();
  const { nonfungiblePositionManagerAddress } = useSwapProtocolAddresses();
  const tokenAContract = {
    address: tokenA?.address ?? zeroAddress,
    abi: erc20ABI
  };

  const tokenBContract = {
    address: tokenB?.address ?? zeroAddress,
    abi: erc20ABI
  };

  const { data: allowances } = useContractReads({
    contracts: [
      {
        ...tokenAContract,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, nonfungiblePositionManagerAddress]
      },
      {
        ...tokenBContract,
        functionName: 'allowance',
        args: [userAddress ?? zeroAddress, nonfungiblePositionManagerAddress]
      }
    ],
  });

  console.log('allowances', allowances);

  return (
    <Stack
      direction="column"
      spacing={2}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="stretch"
      >
        {tokenA !== null && (
          <Button variant="contained" size="large" fullWidth>
            Approve {tokenA.symbol}
          </Button>
        )}

        {tokenB !== null && (
          <Button variant="contained" size="large" fullWidth>
            Approve {tokenB.symbol}
          </Button>
        )}
      </Stack>

      <Button
        variant="contained"
        size="large"
        fullWidth
      >
        Preview
      </Button>
    </Stack>
  );
};

export default PoolButtons;
