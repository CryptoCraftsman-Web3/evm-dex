import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { syncTransaction } from '@/lib/actions/transactions';
import { FeeTier, Token } from '@/types/common';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { LoadingButton } from '@mui/lab';
import { Alert, FormControl, FormLabel, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { zeroAddress } from 'viem';
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

type StartingPriceProps = {
  startingPrice: number;
  setStartingPrice: (startingPrice: number) => void;
  tokenA: Token | null;
  tokenB: Token | null;
  feeTier: FeeTier;
  isPairReversed: boolean;
  refetchPoolAddressFromFactory: () => void;
};

const StartingPrice = ({
  startingPrice,
  setStartingPrice,
  tokenA,
  tokenB,
  feeTier,
  isPairReversed,
  refetchPoolAddressFromFactory,
}: StartingPriceProps) => {
  const { chain } = useNetwork();
  const { nfPositionManager, serpentSwapUtility } = useSwapProtocolAddresses();

  const tokenAAddress = tokenA?.address ?? zeroAddress;
  const tokenBAddress = tokenB?.address ?? zeroAddress;

  const sqrtPriceX96: bigint = BigInt(Math.sqrt(startingPrice) * 2 ** 96);
  const reversedSqrtPriceX96: bigint = startingPrice > 0 ? BigInt(Math.sqrt(1 / startingPrice) * 2 ** 96) : 0n;

  // const { config: initializePoolTxConfig } = usePrepareContractWrite({
  //   address: serpentSwapUtility,
  //   abi: serpentSwapUtilityV1ABI,
  //   functionName: 'createAndInitializePool',
  //   args: [tokenAAddress, tokenBAddress, feeTier.value, sqrtPriceX96],
  // });

  const { config: initializePoolTxConfig } = usePrepareContractWrite({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'createAndInitializePoolIfNecessary',
    args: [
      isPairReversed ? tokenBAddress : tokenAAddress,
      isPairReversed ? tokenAAddress : tokenBAddress,
      feeTier.value,
      isPairReversed ? reversedSqrtPriceX96 : sqrtPriceX96,
    ],
    value: 0n,
  });

  const {
    data: initializePoolTxData,
    write: initializePool,
    isLoading: initializingPool,
  } = useContractWrite(initializePoolTxConfig);

  const {
    isLoading: initializePoolTxWaiting,
    isSuccess: initializePoolTxSuccess,
    isError: initializePoolTxError,
  } = useWaitForTransaction({
    hash: initializePoolTxData?.hash,
  });

  useEffect(() => {
    if (initializePoolTxData?.hash && chain?.id) {
      syncTransaction(chain.id, initializePoolTxData.hash, 'initializePool');
    }
  }, [initializePoolTxData, chain]);

  useEffect(() => {
    refetchPoolAddressFromFactory();
    if (initializePoolTxSuccess) {
      toast('Pool initialized successfully', { type: 'success' });
    }

    if (initializePoolTxError) {
      toast('Error initializing pool', { type: 'error' });
    }
  }, [initializePoolTxSuccess, initializePoolTxError]);

  const handleInitializePool = async () => {
    if (startingPrice === 0) {
      toast('Please enter a starting price', { type: 'error' });
      return;
    }

    if (!initializePool) return;
    initializePool();
  };

  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 2 }}>Set Starting Price</FormLabel>
      <Stack
        direction="column"
        spacing={2}
      >
        <Alert
          severity="warning"
          variant="outlined"
          icon={false}
        >
          This pool has not been initialized yet. You will need to deploy and set the starting price. This is a separate
          and additional gas fee from adding liquidity.
        </Alert>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
        >
          <TextField
            label={`${tokenA?.symbol ?? ''} Price`}
            InputProps={{
              endAdornment: <>{tokenB?.symbol ?? ''}</>,
              inputProps: {
                min: 0,
                style: { textAlign: 'right', paddingRight: '1rem' },
              },
            }}
            type="number"
            value={startingPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setStartingPrice(0);
                return;
              }
              const parsed = parseFloat(value);
              if (isNaN(parsed)) setStartingPrice(0);
              if (parsed < 0) setStartingPrice(0);
              setStartingPrice(parsed);
            }}
            fullWidth
          />

          <LoadingButton
            variant="contained"
            size="large"
            fullWidth
            onClick={handleInitializePool}
            loading={initializingPool || initializePoolTxWaiting}
          >
            Initialize Pool
          </LoadingButton>
        </Stack>
      </Stack>
    </FormControl>
  );
};

export default StartingPrice;
