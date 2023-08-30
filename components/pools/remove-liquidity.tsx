'use client';

import { useEffect } from 'react';
import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Slider,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

type RemoveLiquidityProps = {
  positionTokenId: bigint;
  positionLiquidity: bigint;
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenADecimals: number;
  tokenBDecimals: number;
  tokenALiquidity: number;
  tokenBLiquidity: number;
  refetchPosition: () => void;
  getUnclaimedFees: () => void;
};

const RemoveLiquidity = ({
  positionTokenId,
  positionLiquidity,
  tokenASymbol,
  tokenBSymbol,
  tokenADecimals,
  tokenBDecimals,
  tokenALiquidity,
  tokenBLiquidity,
  refetchPosition,
  getUnclaimedFees,
}: RemoveLiquidityProps) => {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

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

  const [percentToRemove, setPercentToRemove] = useState<number>(0);

  const tokenAAmountToRemove = (tokenALiquidity * percentToRemove) / 100 / 10 ** tokenADecimals;
  const tokenBAmountToRemove = (tokenBLiquidity * percentToRemove) / 100 / 10 ** tokenBDecimals;

  const { config: decreaseLiquidityTxConfig } = usePrepareContractWrite({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'decreaseLiquidity',
    args: [
      {
        tokenId: positionTokenId,
        liquidity: (positionLiquidity * BigInt(percentToRemove)) / 100n,
        amount0Min: 1000n,
        amount1Min: 1000n,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      },
    ],
    value: 0n,
  });

  const {
    data: decreaseLiquidityTxData,
    write: decreaseLiquidity,
    isLoading: decreasingLiquidity,
  } = useContractWrite(decreaseLiquidityTxConfig);

  const {
    data: decreaseLiquidityTxReceipt,
    isLoading: decreaseLiquidityTxWaiting,
    isSuccess: decreaseLiquidityTxSuccess,
    isError: decreaseLiquidityTxError,
  } = useWaitForTransaction({
    hash: decreaseLiquidityTxData?.hash,
  });

  useEffect(() => {
    if (decreaseLiquidityTxSuccess) {
      toast('Liquidity removed successfully and credited to unclaimed fees', { type: 'success' });
      handleClose();
      refetchPosition();
      getUnclaimedFees();
    }

    if (decreaseLiquidityTxError) {
      toast('Error removing liquidity', { type: 'error' });
    }
  }, [decreaseLiquidityTxSuccess, decreaseLiquidityTxError]);

  return (
    <>
      <Button
        variant="contained"
        size="large"
        onClick={handleOpen}
      >
        Remove Liquidity
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
          <b>Remove Liquidity</b>
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
              <strong>
                {tokenASymbol} / {tokenBSymbol}
              </strong>
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="body1"
                color="GrayText"
              >
                Amount
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                my={2}
              >
                <Typography variant="h4">{percentToRemove}%</Typography>

                <ButtonGroup
                  variant="outlined"
                  size="medium"
                >
                  <Button onClick={() => setPercentToRemove(25)}>25%</Button>
                  <Button onClick={() => setPercentToRemove(50)}>50%</Button>
                  <Button onClick={() => setPercentToRemove(75)}>75%</Button>
                  <Button onClick={() => setPercentToRemove(100)}>100%</Button>
                </ButtonGroup>
              </Stack>

              <Slider
                value={percentToRemove}
                onChange={(e, value) => setPercentToRemove(value as number)}
                valueLabelDisplay="auto"
                step={1}
                marks={[
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                  { value: 75, label: '75%' },
                ]}
              />
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">Pooled {tokenASymbol}</Typography>
                <Typography variant="body1">
                  {tokenAAmountToRemove.toLocaleString(undefined, {
                    minimumFractionDigits: 8,
                    maximumFractionDigits: 8,
                  })}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">Pooled {tokenBSymbol}</Typography>
                <Typography variant="body1">
                  {tokenBAmountToRemove.toLocaleString(undefined, {
                    minimumFractionDigits: 8,
                    maximumFractionDigits: 8,
                  })}
                </Typography>
              </Stack>
            </Paper>

            <LoadingButton
              variant="contained"
              size="large"
              fullWidth
              disabled={!isConnected || percentToRemove === 0}
              loading={decreasingLiquidity || decreaseLiquidityTxWaiting}
              onClick={() => {
                if (decreaseLiquidity) decreaseLiquidity();
              }}
            >
              Remove Liquidity
            </LoadingButton>

            <Alert
              severity="info"
              variant="outlined"
            >
              <Typography
                variant="body2"
                width="100%"
              >
                Removing liquidity will withdraw your liquidity from the pool and credit the tokens to your unclaimed
                fees balance
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemoveLiquidity;
