'use client';

import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { Token } from '@/types/common';
import { uniswapV3FactoryABI } from '@/types/wagmi/uniswap-v3-core';
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
  useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { parseUnits, zeroAddress } from 'viem';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import DepositAmounts from './deposit-amounts';
import { syncTransaction } from '@/lib/actions/transactions';

type AddLiquidityProps = {
  positionTokenId: bigint;
  tokenAAddress: `0x${string}`;
  tokenBAddress: `0x${string}`;
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenADecimals: number;
  tokenBDecimals: number;
  amountAInWei: number;
  amountBInWei: number;
  fee: number;
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  refetchPosition: () => void;
};

const AddLiquidity = ({
  positionTokenId,
  tokenAAddress,
  tokenBAddress,
  tokenASymbol,
  tokenBSymbol,
  tokenADecimals,
  tokenBDecimals,
  amountAInWei,
  amountBInWei,
  fee,
  minPrice,
  maxPrice,
  currentPrice,
  refetchPosition,
}: AddLiquidityProps) => {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const { address } = useAccount();

  const { poolFactory, nfPositionManager } = useSwapProtocolAddresses();

  const handleOpen = () => {
    if (!isConnected) {
      toast('Please connect your wallet first', { type: 'error' });
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBackdropClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'backdropClick') return;
    handleClose();
  };

  const amountAFormatted = (amountAInWei / 10 ** (tokenADecimals || 18)).toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });
  const amountBFormatted = (amountBInWei / 10 ** (tokenBDecimals || 18)).toLocaleString(undefined, {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });

  const tokenA: Token = {
    address: tokenAAddress,
    symbol: tokenASymbol,
    decimals: tokenADecimals,
    name: tokenASymbol,
    isNative: false,
  };

  const tokenB: Token = {
    address: tokenBAddress,
    symbol: tokenBSymbol,
    decimals: tokenBDecimals,
    name: tokenBSymbol,
    isNative: false,
  };

  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);

  const { data: pool, refetch: refetchPool } = useContractRead({
    address: poolFactory,
    abi: uniswapV3FactoryABI,
    functionName: 'getPool',
    args: [tokenA?.address ?? zeroAddress, tokenB?.address ?? zeroAddress, fee],
    enabled: tokenA !== null && tokenB !== null,
  });

  const isPoolInitialized = pool !== zeroAddress && pool !== undefined;
  const validPriceRange = minPrice < maxPrice && minPrice > 0 && maxPrice > 0;

  const isAmountAValid = !isNaN(amountA) && amountA !== -Infinity && amountA !== Infinity;
  const isAmountBValid = !isNaN(amountB) && amountB !== -Infinity && amountB !== Infinity;

  const { config: increaseLiquidityTxConfig } = usePrepareContractWrite({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'increaseLiquidity',
    args: [
      {
        tokenId: positionTokenId,
        amount0Desired: isAmountAValid ? parseUnits(amountA.toString(), tokenA?.decimals ?? 18) : 0n,
        amount1Desired: isAmountBValid ? parseUnits(amountB.toString(), tokenB?.decimals ?? 18) : 0n,
        amount0Min: 1000n,
        amount1Min: 1000n,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      },
    ],
    value: 0n,
    enabled: address !== undefined && amountA > 0 && amountB > 0,
  });

  const {
    data: increaseLiquidityTxData,
    write: increaseLiquidity,
    isLoading: isIncreasingLiquidity,
  } = useContractWrite(increaseLiquidityTxConfig);

  useEffect(() => {
    if (increaseLiquidityTxData?.hash && chain?.id) {
      syncTransaction(chain.id, increaseLiquidityTxData.hash, 'increaseLiquidity');
    }
  }, [increaseLiquidityTxData, chain]);

  const {
    isLoading: isIncreaseLiquidityTxWaiting,
    isSuccess: isIncreaseLiquiditySuccess,
    isError: isIncreaseLiquidityError,
  } = useWaitForTransaction({
    hash: increaseLiquidityTxData?.hash,
    enabled: increaseLiquidityTxData?.hash !== undefined,
  });

  useEffect(() => {
    if (isIncreaseLiquiditySuccess) {
      toast('Added liquidity successfully', { type: 'success' });
      handleClose();
      refetchPosition();
    }

    if (isIncreaseLiquidityError) {
      toast('Error adding liquidity', { type: 'error' });
    }
  }, [isIncreaseLiquiditySuccess, isIncreaseLiquidityError]);

  return (
    <>
      <Button
        variant="widget"
        color="primary"
        size="large"
        onClick={handleOpen}
        fullWidth
      >
        Add Liquidity
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
          <b>Add Liquidity</b>
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
            sx={{ width: { xs: '100%', md: 400 } }}
          >
            <Typography variant="h6">
              {tokenASymbol}/{tokenBSymbol}
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1">{tokenASymbol}</Typography>
                <Typography variant="body1">{amountAFormatted}</Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1">{tokenBSymbol}</Typography>
                <Typography variant="body1">{amountBFormatted}</Typography>
              </Stack>

              <Divider
                sx={{
                  my: 1,
                }}
              />

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1">Fee</Typography>
                <Typography variant="body1">{fee / 10000}%</Typography>
              </Stack>
            </Paper>

            <Typography
              variant="body1"
              sx={{ pt: 2 }}
            >
              Selected Range
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <Paper
                variant="outlined"
                sx={{
                  padding: 2,
                  minWidth: { xs: '47%', md: '49%' },
                }}
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    variant="body1"
                    color="GrayText"
                  >
                    Min Price
                  </Typography>

                  <Typography variant="body1">
                    <strong>
                      {minPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 8,
                        maximumFractionDigits: 8,
                      })}
                    </strong>
                  </Typography>

                  <Typography
                    variant="body1"
                    color="GrayText"
                  >
                    {tokenBSymbol} per {tokenASymbol}
                  </Typography>
                </Stack>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  padding: 2,
                  minWidth: '49%',
                }}
              >
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    variant="body1"
                    color="GrayText"
                  >
                    Max Price
                  </Typography>

                  <Typography variant="body1">
                    <strong>
                      {maxPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 8,
                        maximumFractionDigits: 8,
                      })}
                    </strong>
                  </Typography>

                  <Typography
                    variant="body1"
                    color="GrayText"
                  >
                    {tokenBSymbol} per {tokenASymbol}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>

            <Paper
              variant="outlined"
              sx={{
                padding: 2,
              }}
            >
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  variant="body1"
                  color="GrayText"
                >
                  Current Price
                </Typography>

                <Typography variant="body1">
                  <strong>
                    {currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 8,
                      maximumFractionDigits: 8,
                    })}
                  </strong>
                </Typography>

                <Typography
                  variant="body1"
                  color="GrayText"
                >
                  {tokenBSymbol} per {tokenASymbol}
                </Typography>
              </Stack>
            </Paper>

            <Typography
              variant="body1"
              sx={{ pt: 2 }}
            >
              Add More Liquidity
            </Typography>

            <DepositAmounts
              tokenA={tokenA}
              tokenB={tokenB}
              amountA={amountA}
              setAmountA={setAmountA}
              amountB={amountB}
              setAmountB={setAmountB}
              startingPrice={0}
              currentPrice={currentPrice}
              isPoolInitialized={isPoolInitialized}
              isPairReversed={false}
              validPriceRange={validPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              showLabel={false}
              layout="column"
            />

            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={amountA === 0 && amountB === 0}
              loading={isIncreasingLiquidity || isIncreaseLiquidityTxWaiting}
              onClick={() => {
                console.log('increase liquidity');
                console.log(increaseLiquidity);
                if (increaseLiquidity) increaseLiquidity();
              }}
            >
              Add Liquidity
            </LoadingButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddLiquidity;