import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { FeeTier, Token } from '@/types/common';
import { BigintIsh, CurrencyAmount, Percent, Price, Token as UniswapToken } from '@uniswap/sdk-core';
import {
  Position,
  Pool,
  nearestUsableTick,
  MintOptions,
  NonfungiblePositionManager,
  priceToClosestTick,
  TickMath,
  FeeAmount,
  computePoolAddress,
  TICK_SPACINGS,
} from '@uniswap/v3-sdk';
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
import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import {
  useAccount,
  useContractReads,
  useNetwork,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import { iUniswapV3PoolABI } from '@/types/wagmi/uniswap-v3-core';
import { parseUnits, zeroAddress } from 'viem';
import JSBI from 'jsbi';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';

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
    tokenA !== null && tokenB !== null
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
    enabled: tokenA !== null && tokenB !== null && isPoolInitialized,
  });

  const tickSpacing = poolInfo?.[3].result ? (poolInfo[3].result as number) : 0;
  const liquidity = poolInfo?.[4].result ? (poolInfo[4].result as bigint) : 0n; console.log(liquidity);
  const slot0 = poolInfo?.[5].result
    ? (poolInfo[5].result as [bigint, number, number, number, number, number, boolean])
    : [0n, 0, 0, 0, 0, 0, false];
  const sqrtPriceX96 = slot0[0] as bigint;
  const tick = slot0[1] as number;

  const tokenAAmount = CurrencyAmount.fromRawAmount(
    uniswapTokenA,
    parseUnits(amountA.toString(), tokenA?.decimals || 18).toString()
  );

  const tokenBAmount = CurrencyAmount.fromRawAmount(
    uniswapTokenB,
    parseUnits(amountB.toString(), tokenB?.decimals || 18).toString()
  );

  const configuredPool =
    isPoolInitialized && tokenA !== null && tokenB !== null
      ? new Pool(
          tokenAAmount.currency,
          tokenBAmount.currency,
          feeTier.value,
          slot0[0].toString(),
          liquidity.toString(),
          slot0[1] as number
        )
      : undefined; console.log(liquidity, liquidity.toString());

  const position =
    configuredPool !== undefined && liquidity > 0n
      ? Position.fromAmounts({
          pool: configuredPool,
          tickLower: nearestUsableTick(tick, tickSpacing) - tickSpacing * 2,
          tickUpper: nearestUsableTick(tick, tickSpacing) + tickSpacing * 2,
          amount0: tokenAAmount.quotient,
          amount1: tokenBAmount.quotient,
          useFullPrecision: true,
        })
      : undefined;

  const mintOptions: MintOptions = {
    recipient: address ? address : zeroAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
  };

  const { calldata } =
    position !== undefined
      ? NonfungiblePositionManager.addCallParameters(position, mintOptions)
      : {
          calldata: undefined,
        };

  const { config: mintLiquidtyTxConfig } = usePrepareSendTransaction({
    to: nfPositionManager,
    value: 0n,
    data: calldata ? calldata as `0x${string}` : '0x0',
  });

  const {
    data: mintLiquidtyTxData,
    sendTransaction: mintLiquidity,
    isLoading: mintingLiquidty,
  } = useSendTransaction(mintLiquidtyTxConfig);

  const { isLoading: isMintLiquidtyTxWaiting } = useWaitForTransaction({
    hash: mintLiquidtyTxData?.hash,
    enabled: Boolean(mintLiquidtyTxData?.hash),
  });

  const addLiquidity = async () => {
    if (!mintLiquidity) return;
    mintLiquidity();
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
