'use client';

import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { FeeTier, Token } from '@/types/common';
import { uniswapV3FactoryABI } from '@/types/wagmi/uniswap-v3-core';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { Token as UniswapToken } from '@uniswap/sdk-core';
import { computePoolAddress } from '@uniswap/v3-sdk';
import { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { zeroAddress } from 'viem';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import SelectToken from '../common/select-token';
import { config } from '../config';
import DepositAmounts from './deposit-amounts';
import PoolButtons from './pool-buttons';
import SelectFeeTier from './select-fee-tier';
import SetPriceRange from './set-price-range';
import StartingPrice from './starting-price';

type NewLiquidityPositionProps = {
  refetchPoolsCount: () => void;
};

const NewLiquidityPosition = ({ refetchPoolsCount }: NewLiquidityPositionProps) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  useEffect(() => {
    if (!isConnected) setOpen(false);
  }, [isConnected]);

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

  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);
  const [feeTier, setFeeTier] = useState<FeeTier>(config.feeTiers[0]);
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);

  const { poolFactory } = useSwapProtocolAddresses();

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

  const { data: poolAddressFromFactory } = useContractRead({
    address: poolFactory,
    abi: uniswapV3FactoryABI,
    functionName: 'getPool',
    args: [tokenA?.address || zeroAddress, tokenB?.address || zeroAddress, feeTier.value],
  });

  const isPoolInitialized =
    poolAddressFromFactory === poolAddress && poolAddress !== zeroAddress && poolAddressFromFactory !== zeroAddress;

  const tokenAAddressInt = BigInt(tokenA?.address ?? zeroAddress);
  const tokenBAddressInt = BigInt(tokenB?.address ?? zeroAddress);

  const isPairReversed = tokenAAddressInt > tokenBAddressInt;
  const validPriceRange = minPrice < maxPrice && minPrice > 0 && maxPrice > 0;

  const resetAndClose = () => {
    setTokenA(null);
    setTokenB(null);
    setFeeTier(config.feeTiers[0]);
    setStartingPrice(0);
    setCurrentPrice(0);
    setMinPrice(0);
    setMaxPrice(0);
    setAmountA(0);
    setAmountB(0);
    handleClose();

    refetchPoolsCount();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
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
          elevation: 0,
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
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 4 }}
            alignItems="stretch"
          >
            {/* start of column 1 in desktop layout */}
            <Stack
              direction="column"
              spacing={2}
              width="100%"
            >
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 2 }}>Select Asset Pair</FormLabel>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  width="100%"
                  justifyContent="stretch"
                >
                  <SelectToken
                    inputLabel="Pair Token A"
                    token={tokenA}
                    setToken={setTokenA}
                  />

                  <SelectToken
                    inputLabel="Pair Token B"
                    token={tokenB}
                    setToken={setTokenB}
                  />
                </Stack>
                {tokenA !== null && tokenB !== null && tokenA?.address === tokenB?.address && (
                  <Alert
                    severity="error"
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Token A and Token B cannot be the same
                  </Alert>
                )}
              </FormControl>

              <SelectFeeTier
                tokenA={tokenA}
                tokenB={tokenB}
                feeTier={feeTier}
                setFeeTier={setFeeTier}
              />

              {isMdAndUp && (
                <DepositAmounts
                  tokenA={tokenA}
                  tokenB={tokenB}
                  amountA={amountA}
                  setAmountA={setAmountA}
                  amountB={amountB}
                  setAmountB={setAmountB}
                  startingPrice={startingPrice}
                  currentPrice={currentPrice}
                  isPoolInitialized={isPoolInitialized}
                  validPriceRange={validPriceRange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
              )}
            </Stack>
            {/* end of column 1 in desktop layout */}

            {isMdAndUp && (
              <Divider
                orientation="vertical"
                sx={{ height: 'auto' }}
              />
            )}

            {/* start of column 2 in desktop layout */}
            <Stack
              direction="column"
              spacing={2}
              justifyContent="stretch"
              width="100%"
            >
              {!isPoolInitialized && tokenA && tokenB && tokenA?.address !== tokenB?.address && (
                <StartingPrice
                  startingPrice={startingPrice}
                  setStartingPrice={setStartingPrice}
                  tokenA={tokenA}
                  tokenB={tokenB}
                  feeTier={feeTier}
                  isPairReversed={isPairReversed}
                />
              )}

              <SetPriceRange
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                tokenA={tokenA}
                tokenB={tokenB}
                feeTier={feeTier}
                isPoolInitialized={isPoolInitialized}
                currentPrice={currentPrice}
                setCurrentPrice={setCurrentPrice}
                isPairReversed={isPairReversed}
              />

              {!isMdAndUp && (
                <DepositAmounts
                  tokenA={tokenA}
                  tokenB={tokenB}
                  amountA={amountA}
                  setAmountA={setAmountA}
                  amountB={amountB}
                  setAmountB={setAmountB}
                  startingPrice={startingPrice}
                  currentPrice={currentPrice}
                  isPoolInitialized={isPoolInitialized}
                  validPriceRange={validPriceRange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
              )}

              <PoolButtons
                tokenA={tokenA}
                tokenB={tokenB}
                feeTier={feeTier}
                amountA={amountA}
                amountB={amountB}
                minPrice={minPrice}
                maxPrice={maxPrice}
                startingPrice={startingPrice}
                currentPrice={currentPrice}
                isPoolInitialized={isPoolInitialized}
                isPairReversed={isPairReversed}
                resetAndClose={resetAndClose}
              />
            </Stack>
            {/* end of column 2 in desktop layout */}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewLiquidityPosition;
