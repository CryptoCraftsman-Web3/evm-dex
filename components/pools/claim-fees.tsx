import { useSwapProtocolAddresses } from '@/hooks/swap-protocol-hooks';
import { nonfungiblePositionManagerABI } from '@/types/wagmi/uniswap-v3-periphery';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { zeroAddress } from 'viem';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

type ClaimFeesProps = {
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenAUnclaimedAmount: number;
  tokenBUnclaimedAmount: number;
  positionTokenId: bigint;
  getUnclaimedFees: () => void;
};

const ClaimFees = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAUnclaimedAmount,
  tokenBUnclaimedAmount,
  positionTokenId,
  getUnclaimedFees,
}: ClaimFeesProps) => {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const { address } = useAccount();

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

  const { nfPositionManager } = useSwapProtocolAddresses();
  const { config: claimFeeTxConfig } = usePrepareContractWrite({
    address: nfPositionManager,
    abi: nonfungiblePositionManagerABI,
    functionName: 'collect',
    args: [
      {
        tokenId: positionTokenId,
        recipient: address || zeroAddress,
        amount0Max: 2n ** 128n - 1n,
        amount1Max: 2n ** 128n - 1n,
      },
    ],
    value: 0n,
    enabled: address !== undefined,
  });

  const { data: claimFeeTxData, write: claimFee, isLoading: isClaimingFee } = useContractWrite(claimFeeTxConfig);

  const {
    isLoading: isClaimingFeeWaiting,
    isSuccess: isClaimingFeeSuccess,
    isError: isClaimingFeeError,
  } = useWaitForTransaction({
    hash: claimFeeTxData?.hash,
    enabled: claimFeeTxData?.hash !== undefined,
  });

  useEffect(() => {
    if (isClaimingFeeSuccess) {
      toast('Fees claimed successfully', { type: 'success' });
      handleClose();
      getUnclaimedFees();
    }

    if (isClaimingFeeError) {
      toast('Error claiming fees', { type: 'error' });
    }
  }, [isClaimingFeeSuccess, isClaimingFeeError]);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        size="large"
      >
        Claim Fees
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
          <b>Claim Fees</b>
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
            spacing={2}
            sx={{ width: { xs: '100%', md: 400 } }}
          >
            <Paper variant="outlined">
              <Stack
                direction="column"
                spacing={2}
                p={2}
              >
                <Typography variant="body1">
                  {tokenASymbol}: {tokenAUnclaimedAmount}
                </Typography>

                <Typography variant="body1">
                  {tokenBSymbol}: {tokenBUnclaimedAmount}
                </Typography>
              </Stack>
            </Paper>

            <Alert
              severity="info"
              variant="outlined"
            >
              <Typography
                variant="body1"
                width="100%"
              >
                Claiming fees will withdraw currently available fees to your wallet
              </Typography>
            </Alert>

            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              loading={isClaimingFee || isClaimingFeeWaiting}
              onClick={claimFee}
            >
              Claim Fees
            </LoadingButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimFees;
