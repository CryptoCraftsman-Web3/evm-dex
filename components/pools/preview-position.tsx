import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { FeeTier, Token } from '@/types/common';
import { iUniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Token as UniswapToken } from '@uniswap/sdk-core';
import { TickMath, computePoolAddress, nearestUsableTick } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
import { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { parseUnits, zeroAddress } from 'viem';
import {
  useAccount,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

type PreviewPositionProps = {
  canSpendTokens: boolean;
  tokenA: Token | null;
  tokenB: Token | null;
  feeTier: FeeTier;
  amountA: number;
  amountB: number;
  minPrice: number;
  maxPrice: number;
  startingPrice: number;
  currentPrice: number;
  isPoolInitialized: boolean;
  isPairReversed: boolean;
  resetAndClose: () => void;
};

const PreviewPosition = ({
  canSpendTokens,
  tokenA,
  tokenB,
  feeTier,
  amountA,
  amountB,
  minPrice,
  maxPrice,
  startingPrice,
  currentPrice,
  isPoolInitialized,
  isPairReversed,
  resetAndClose,
}: PreviewPositionProps) => {
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBackdropClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'backdropClick') return;
    handleClose();
  };

  const price = isPoolInitialized ? currentPrice : startingPrice;

  const { address } = useAccount();
  const { poolFactory, nfPositionManager } = useSwapProtocolAddresses();
  const { chain } = useNetwork();

  const uniswapTokenA = new UniswapToken(
    chain?.id || 1,
    tokenA?.address || zeroAddress,
    tokenA?.decimals || 18,
    tokenA?.symbol || 'A',
    tokenA?.name || 'A'
  );

  const uniswapTokenB = new UniswapToken(
    chain?.id || 1,
    tokenB?.address || zeroAddress,
    tokenB?.decimals || 18,
    tokenB?.symbol || 'B',
    tokenB?.name || 'B'
  );

  const poolAddress =
    tokenA !== null && tokenB !== null && tokenA?.address !== tokenB?.address
      ? (computePoolAddress({
          factoryAddress: poolFactory,
          tokenA: uniswapTokenA,
          tokenB: uniswapTokenB,
          fee: feeTier.value,
        }) as `0x${string}`)
      : zeroAddress;

  const poolContract = {
    address: poolAddress,
    abi: iUniswapV3PoolABI,
  };

  const { data: poolInfo, refetch: refetchPool } = useContractReads({
    contracts: [
      {
        ...poolContract,
        functionName: 'token0',
      },
      {
        ...poolContract,
        functionName: 'token1',
      },
      {
        ...poolContract,
        functionName: 'fee',
      },
      {
        ...poolContract,
        functionName: 'tickSpacing',
      },
      {
        ...poolContract,
        functionName: 'liquidity',
      },
      {
        ...poolContract,
        functionName: 'slot0',
      },
    ],
    enabled: tokenA !== null && tokenB !== null && tokenA?.address && tokenB?.address && isPoolInitialized,
  });
  const tickSpacing = poolInfo?.[3].result ? (poolInfo[3].result as number) : 0;
  const liquidity = poolInfo?.[4].result ? (poolInfo[4].result as bigint) : 0n;

  const slot0 = poolInfo?.[5].result
    ? (poolInfo[5].result as [bigint, number, number, number, number, number, boolean])
    : [0n, 0, 0, 0, 0, 0, false];
  const sqrtPriceX96 = slot0[0] as bigint;
  const tick = slot0[1] as number;

  const sqrtMinPriceX96 = Math.sqrt(minPrice) * 2 ** 96;
  const sqrtMaxPriceX96 = Math.sqrt(maxPrice) * 2 ** 96;

  const minPriceTargetTick =
    sqrtMinPriceX96 !== 0 ? TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtMinPriceX96)) : TickMath.MIN_TICK;
  const maxPriceTargetTick =
    sqrtMaxPriceX96 !== 0 ? TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtMaxPriceX96)) : TickMath.MAX_TICK;

  const tickLower =
    tick && tickSpacing ? nearestUsableTick(minPriceTargetTick, tickSpacing) - tickSpacing * 2 : TickMath.MIN_TICK;
  const tickUpper =
    tick && tickSpacing ? nearestUsableTick(maxPriceTargetTick, tickSpacing) + tickSpacing * 2 : TickMath.MAX_TICK;

  const isAmountAValid = !isNaN(amountA) && amountA !== -Infinity && amountA !== Infinity;
  const isAmountBValid = !isNaN(amountB) && amountB !== -Infinity && amountB !== Infinity;

  const tokenAAddress = tokenA?.address || zeroAddress;
  const tokenBAddress = tokenB?.address || zeroAddress;

  const amountADesired = isAmountAValid ? parseUnits(amountA.toString(), tokenA?.decimals || 18) : 0n;
  const amountBDesired = isAmountBValid ? parseUnits(amountB.toString(), tokenB?.decimals || 18) : 0n;

  const { config: mintTxConfig } = usePrepareContractWrite({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'mint',
    args: [
      {
        token0: tokenAAddress,
        token1: tokenBAddress,
        fee: feeTier.value,
        tickLower,
        tickUpper,
        amount0Desired: amountADesired,
        amount1Desired: amountBDesired,
        amount0Min: 0n,
        amount1Min: 0n,
        recipient: address ? address : zeroAddress,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      },
    ],
    value: 0n,
    enabled:
      isAmountAValid &&
      isAmountBValid &&
      isPoolInitialized &&
      tokenA !== null &&
      tokenB !== null &&
      tokenA?.address !== tokenB?.address,
  });

  const { data: mintTxData, write: mint, isLoading: minting } = useContractWrite(mintTxConfig);

  const {
    isLoading: mintTxWaiting,
    isSuccess: mintTxSuccess,
    isError: mintTxError,
  } = useWaitForTransaction({
    hash: mintTxData?.hash,
    enabled: mintTxData !== undefined,
  });

  useEffect(() => {
    if (mintTxSuccess) {
      toast('Position minted successfully', { type: 'success' });
      handleClose();
      resetAndClose();
    }

    if (mintTxError) {
      toast('Error minting position', { type: 'error' });
    }
  }, [mintTxSuccess, mintTxError]);

  const addLiquidity = async () => {
    if (mint) mint();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={!canSpendTokens || !isPoolInitialized}
        onClick={handleOpen}
        sx={{ height: 56 }}
      >
        Preview Position
      </Button>

      <Dialog
        open={open}
        onClose={handleBackdropClose}
        maxWidth="lg"
        fullWidth={!isMdAndUp}
        PaperProps={{
          variant: 'outlined',
        }}
      >
        <DialogTitle>
          <b>Position Preview</b>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <IoIosClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack
            direction="column"
            spacing={1}
          >
            <Typography variant="h6">
              {tokenA?.symbol}/{tokenB?.symbol}
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, minWidth: { xs: '100%', md: '400px' } }}
            >
              <Stack
                direction="column"
                spacing={2}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">{tokenA?.symbol}</Typography>
                  <Typography variant="body1">
                    {amountA.toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{' '}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">{tokenB?.symbol}</Typography>
                  <Typography variant="body1">
                    {amountB.toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{' '}
                  </Typography>
                </Stack>

                <Divider />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">Fee Tier</Typography>
                  <Typography variant="body1">{feeTier.value / 10000}%</Typography>
                </Stack>
              </Stack>
            </Paper>

            <Typography variant="body1">
              <b>Selected Range</b>
            </Typography>

            <Stack
              direction="row"
              width="100%"
              justifyContent="space-between"
            >
              <Paper
                variant="outlined"
                sx={{ p: 2, minWidth: '49%' }}
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                >
                  <Typography
                    variant="body2"
                    color="GrayText"
                    textAlign="center"
                  >
                    Min Price
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign="center"
                  >
                    {minPrice.toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="GrayText"
                    textAlign="center"
                  >
                    {tokenB?.symbol} / {tokenA?.symbol}
                  </Typography>
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{ p: 2, minWidth: '49%' }}
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                >
                  <Typography
                    variant="body2"
                    color="GrayText"
                    textAlign="center"
                  >
                    Max Price
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign="center"
                  >
                    {maxPrice.toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="GrayText"
                    textAlign="center"
                  >
                    {tokenB?.symbol} / {tokenA?.symbol}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>

            <Paper
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Stack
                direction="column"
                justifyContent="center"
              >
                <Typography
                  variant="body2"
                  color="GrayText"
                  textAlign="center"
                >
                  Price
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="center"
                >
                  {price.toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  color="GrayText"
                  textAlign="center"
                >
                  {tokenB?.symbol} / {tokenA?.symbol}
                </Typography>
              </Stack>
            </Paper>

            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              loading={minting || mintTxWaiting}
              onClick={() => addLiquidity()}
            >
              Add Liquidity
            </LoadingButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreviewPosition;
