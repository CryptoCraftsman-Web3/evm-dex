import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { FeeTier, Token } from '@/types/common';
import { CurrencyAmount, Percent, Token as UniswapToken } from '@uniswap/sdk-core';
import { Position, Pool, nearestUsableTick, MintOptions, NonfungiblePositionManager } from '@uniswap/v3-sdk';
import {
  Button,
  Dialog,
  useMediaQuery,
  Theme,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  Stack,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import { computePoolAddress } from '@uniswap/v3-sdk';
import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { useAccount, useContractReads, useNetwork, usePrepareSendTransaction, useSendTransaction } from 'wagmi';
import { iUniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';
import { zeroAddress } from 'viem';

type PreviewPositionProps = {
  canSpendTokens: boolean;
  tokenA: Token | null;
  tokenB: Token | null;
  feeTier: FeeTier;
  amountA: number;
  amountB: number;
  minPrice: number;
  maxPrice: number;
  price: number;
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
  price,
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

  const { poolFactoryAddress, nonfungiblePositionManagerAddress } = useSwapProtocolAddresses();
  const { chain } = useNetwork();

  const tokenAUniswap = new UniswapToken(
    chain?.id || 1,
    tokenA?.address || zeroAddress,
    tokenA?.decimals || 18,
    tokenA?.symbol || '',
    tokenA?.name || ''
  );

  const tokenBUniswap = new UniswapToken(
    chain?.id || 1,
    tokenB?.address || zeroAddress,
    tokenB?.decimals || 18,
    tokenB?.symbol || '',
    tokenB?.name || ''
  );

  const currentPoolAddress =
    tokenA && tokenB
      ? (computePoolAddress({
          factoryAddress: poolFactoryAddress,
          tokenA: tokenAUniswap,
          tokenB: tokenBUniswap,
          fee: feeTier.value,
        }) as `0x${string}`)
      : zeroAddress;

  const {
    data: poolInfoResult,
    isLoading: isPoolInfoLoading,
    refetch: refetchPoolInfo,
  } = useContractReads({
    contracts: [
      {
        address: currentPoolAddress,
        abi: iUniswapV3PoolABI,
        functionName: 'token0',
      },
      {
        address: currentPoolAddress,
        abi: iUniswapV3PoolABI,
        functionName: 'token1',
      },
      {
        address: currentPoolAddress,
        abi: iUniswapV3PoolABI,
        functionName: 'fee',
      },
      {
        address: currentPoolAddress,
        abi: iUniswapV3PoolABI,
        functionName: 'tickSpacing',
      },
      {
        address: currentPoolAddress,
        abi: iUniswapV3PoolABI,
        functionName: 'liquidity',
      },
      {
        address: currentPoolAddress,
        abi: iUniswapV3PoolABI,
        functionName: 'slot0',
      },
    ],
  });

  const { address } = useAccount();

  const getPoolInfo = () => {
    if (!poolInfoResult) return null;
    const slot0 = poolInfoResult![5].result as [bigint, number, number, number, number, number, boolean];
    return {
      token0: poolInfoResult![0].result!,
      token1: poolInfoResult![1].result!,
      fee: poolInfoResult![2].result! as number,
      tickSpacing: poolInfoResult![3].result! as number,
      liquidity: poolInfoResult![4].result!,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
  };

  const constructPosition = (
    token0Amount: CurrencyAmount<UniswapToken>,
    token1Amount: CurrencyAmount<UniswapToken>
  ): Position | null => {
    // get pool info
    const poolInfo = getPoolInfo();

    if (!poolInfo) return null;

    // construct pool instance
    const configuredPool = new Pool(
      token0Amount.currency,
      token1Amount.currency,
      poolInfo.fee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick
    );

    // create position using the maximum liquidity from input amounts
    return Position.fromAmounts({
      pool: configuredPool,
      tickLower: nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) - poolInfo.tickSpacing * 2,
      tickUpper: nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) + poolInfo.tickSpacing * 2,
      amount0: token0Amount.quotient,
      amount1: token1Amount.quotient,
      useFullPrecision: true,
    });
  };

  const positionToMint =
    tokenA && tokenB && amountA && amountB
      ? constructPosition(
          CurrencyAmount.fromRawAmount(tokenAUniswap, amountA),
          CurrencyAmount.fromRawAmount(tokenBUniswap, amountB)
        )
      : null;

  const mintOptions: MintOptions = {
    recipient: address! as string,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
  };

  const { calldata, value } = NonfungiblePositionManager.addCallParameters(positionToMint!, mintOptions);

  const { config: mintPositionTxConfig } = usePrepareSendTransaction({
    to: nonfungiblePositionManagerAddress,
    value: 0n,
    data: calldata as `0x${string}`,
  });

  const {
    isLoading: isMinting,
    isSuccess: isMinted,
    sendTransaction: mintPosition,
  } = useSendTransaction(mintPositionTxConfig);

  const addLiquidity = async () => {
    if (!mintPosition) return;
    await mintPosition();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={!canSpendTokens}
        onClick={handleOpen}
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
                  <Typography variant="body1">{amountA.toLocaleString()} </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">{tokenB?.symbol}</Typography>
                  <Typography variant="body1">{amountB.toLocaleString()} </Typography>
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
                    {minPrice.toLocaleString()}
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
                    {maxPrice.toLocaleString()}
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

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => addLiquidity()}
            >
              Add Liquidity
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreviewPosition;
